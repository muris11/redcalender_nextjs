import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "redcalendar_session";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Use the same encoding as middleware (Edge-compatible)
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

function createToken(payload: SessionUser): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "redcalendar-secret-key-change-in-production";
  const data = JSON.stringify(payload);
  const signature = encodeBase64(`${data}:${secret}`);
  return encodeBase64(JSON.stringify({ data, signature }));
}

export async function POST(request: NextRequest) {
  console.log("🔄 [REGISTRATION] API called at", new Date().toISOString());
  try {
    // Skip an explicit connect/test here to avoid extra latency on each request.
    // The Prisma client is initialized once per server and will manage pooling.
    console.log(
      "🔍 [REGISTRATION] Proceeding without explicit DB connectivity test to reduce latency"
    );

    const body = await request.json();
    console.log("📝 [REGISTRATION] Received data:", {
      name: body.name,
      email: body.email,
      phone: body.phone,
      avgCycleLength: body.avgCycleLength,
      avgPeriodLength: body.avgPeriodLength,
      theme: body.theme,
      hasPassword: !!body.password,
    });

    const {
      name,
      email,
      phone,
      password,
      birthYear,
      avgCycleLength,
      avgPeriodLength,
      theme,
    } = body;

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    console.log("💾 [REGISTRATION] Creating user with data:", {
      name,
      email,
      phone,
      avgCycleLength: avgCycleLength ? parseInt(avgCycleLength) : 28,
      avgPeriodLength: avgPeriodLength ? parseInt(avgPeriodLength) : 6,
      theme: theme || null,
      isOnboarded: false,
    });

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        avgCycleLength: avgCycleLength ? parseInt(avgCycleLength) : 28,
        avgPeriodLength: avgPeriodLength ? parseInt(avgPeriodLength) : 6,
        theme: theme || null,
        isOnboarded: false,
      },
    });

    console.log("✅ [REGISTRATION] User created successfully:", {
      id: user.id,
      name: user.name,
      email: user.email,
      avgCycleLength: user.avgCycleLength,
      avgPeriodLength: user.avgPeriodLength,
      theme: user.theme,
      isOnboarded: user.isOnboarded,
    });

    // Log for debugging: show new user id and total users count
    // Optional: Log created user id for debugging (avoid heavy queries in hot paths)
    console.info(`📊 [REGISTRATION] New user created: ${user.id}`);

    // Create session data and set HTTP-only cookie
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isOnboarded: user.isOnboarded,
    };
    const token = createToken(sessionUser);

    // Remove password dari response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: "Registrasi berhasil",
      user: userWithoutPassword,
      redirectUrl: "/onboarding"
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
