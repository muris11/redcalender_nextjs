import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "redcalendar_session";

const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// Simple token verification for middleware (Edge runtime safe)
function verifyTokenFromCookie(token: string): { id: string; role: string } | null {
  try {
    const secret =
      process.env.AUTH_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "redcalendar-secret-key-change-in-production";
    const decoded = JSON.parse(decodeBase64(token));
    const expectedSignature = encodeBase64(`${decoded.data}:${secret}`);

    if (decoded.signature !== expectedSignature) {
      return null;
    }

    return JSON.parse(decoded.data);
  } catch {
    return null;
  }
}

// Routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/help-center",
  "/contact",
  "/terms",
  "/privacy-policy",
];

// API routes that don't require authentication
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api", // Health check
];

// Routes that require ADMIN role
const adminRoutes = ["/admin"];
const adminApiRoutes = [
  "/api/admin/users",
  "/api/admin/articles",
  "/api/admin/categories",
  "/api/admin/upload",
  "/api/admin/analytics",
  "/api/admin/activities",
  "/api/admin/seed",
  "/api/admin/system-metrics",
  "/api/admin/debug",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Files with extensions
  ) {
    return NextResponse.next();
  }
  
  // Get session from cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let session: { id: string; role: string } | null = null;
  
  // Only verify token if it exists and is not empty
  if (token && token.length > 0) {
    session = verifyTokenFromCookie(token);
  }
  
  // Check if route is public
  const isHomePage = pathname === "/";
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isPublicApiRoute = publicApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  
  // Helper function to add no-cache headers to response
  const addNoCacheHeaders = (response: NextResponse) => {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
    return response;
  };
  
  // Allow public routes (including home page) - NO REDIRECT for unauthenticated users
  if (isHomePage || isPublicRoute || isPublicApiRoute) {
    // Only redirect authenticated users away from login/register
    if (session && (pathname === "/login" || pathname === "/register")) {
      if (session.role === "ADMIN") {
        return addNoCacheHeaders(NextResponse.redirect(new URL("/admin", request.url)));
      }
      return addNoCacheHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
    // For unauthenticated users or other public routes, just continue
    return addNoCacheHeaders(NextResponse.next());
  }
  
  // Check if route requires authentication
  const isApiRoute = pathname.startsWith("/api/");
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAdminApiRoute = adminApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  
  // No session - redirect to login or return 401
  if (!session) {
    if (isApiRoute) {
      return addNoCacheHeaders(NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ));
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return addNoCacheHeaders(NextResponse.redirect(loginUrl));
  }
  
  // Check admin routes
  if (isAdminRoute || isAdminApiRoute) {
    if (session.role !== "ADMIN") {
      if (isApiRoute) {
        return addNoCacheHeaders(NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        ));
      }
      return addNoCacheHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
  }
  
  // User routes - authenticated users only
  const userRoutes = ["/dashboard", "/calender", "/log", "/analysis", "/education", "/profile", "/report", "/onboarding"];
  const isUserRoute = userRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  
  // Admin trying to access user routes - redirect to admin
  if (isUserRoute && session.role === "ADMIN") {
    return addNoCacheHeaders(NextResponse.redirect(new URL("/admin", request.url)));
  }
  
  return addNoCacheHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
