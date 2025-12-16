import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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

    // Remove password dari response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Registrasi berhasil",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
