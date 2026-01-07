import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

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
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isOnboarded: user.isOnboarded,
    };

    const token = createToken(sessionUser);

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login berhasil',
      user: userWithoutPassword,
      redirectUrl: user.role === 'ADMIN' ? '/admin' : (user.isOnboarded ? '/dashboard' : '/onboarding')
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}