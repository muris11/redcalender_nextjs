import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AUTH_COOKIE_NAME = "redcalendar_session";

// Use the same decoding as middleware (Edge-compatible)
const decodeBase64 = (value: string): string => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const encodeBase64 = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  isOnboarded: boolean;
}

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

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }
    
    const sessionUser = verifyToken(token);
    
    if (!sessionUser) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }
    
    // Optionally refresh user data from database
    const freshUser = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOnboarded: true,
      },
    });
    
    if (!freshUser) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      authenticated: true,
      user: freshUser,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Session error" },
      { status: 500 }
    );
  }
}
