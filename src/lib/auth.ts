import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "./db";

// Simple token-based authentication using signed cookies
// In production, consider using proper JWT library or next-auth

const AUTH_COOKIE_NAME = "redcalendar_session";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  isOnboarded: boolean;
}

export interface AuthResult {
  user: SessionUser | null;
  error: string | null;
}

// Edge-safe base64 encoding/decoding (must match middleware exactly)
const encodeBase64 = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeBase64 = (value: string): string => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// Create a simple signed token (base64 encoded JSON with signature)
function createToken(payload: SessionUser): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "redcalendar-secret-key-change-in-production";
  const data = JSON.stringify(payload);
  const signature = encodeBase64(`${data}:${secret}`);
  return encodeBase64(JSON.stringify({ data, signature }));
}

// Verify and decode token
function verifyToken(token: string): SessionUser | null {
  try {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "redcalendar-secret-key-change-in-production";
    const decoded = JSON.parse(decodeBase64(token));
    const expectedSignature = encodeBase64(`${decoded.data}:${secret}`);
    
    if (decoded.signature !== expectedSignature) {
      return null;
    }
    
    return JSON.parse(decoded.data) as SessionUser;
  } catch {
    return null;
  }
}

// Set session cookie after login/register
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
  });
}

// Clear session cookie on logout
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// Get current session from cookies (for API routes)
export async function getSession(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return { user: null, error: "Not authenticated" };
    }
    
    const user = verifyToken(token);
    if (!user) {
      return { user: null, error: "Invalid session" };
    }
    
    return { user, error: null };
  } catch {
    return { user: null, error: "Session error" };
  }
}

// Get session from request (for middleware)
export function getSessionFromRequest(request: NextRequest): SessionUser | null {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Validate that user has required role
export async function requireAuth(requiredRole?: "USER" | "ADMIN"): Promise<AuthResult> {
  const session = await getSession();
  
  if (!session.user) {
    return { user: null, error: "Authentication required" };
  }
  
  if (requiredRole && session.user.role !== requiredRole) {
    // ADMIN can access everything
    if (session.user.role === "ADMIN") {
      return session;
    }
    return { user: null, error: "Insufficient permissions" };
  }
  
  return session;
}

// Validate that user can only access their own data
export async function requireUserAccess(requestedUserId: string): Promise<AuthResult> {
  const session = await getSession();
  
  if (!session.user) {
    return { user: null, error: "Authentication required" };
  }
  
  // Admin can access any user's data
  if (session.user.role === "ADMIN") {
    return session;
  }
  
  // User can only access their own data
  if (session.user.id !== requestedUserId) {
    return { user: null, error: "Access denied" };
  }
  
  return session;
}

// Refresh session with latest user data from database
export async function refreshSession(userId: string): Promise<SessionUser | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOnboarded: true,
      },
    });
    
    if (!user) return null;
    
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isOnboarded: user.isOnboarded,
    };
    
    await setSessionCookie(sessionUser);
    return sessionUser;
  } catch {
    return null;
  }
}
