import { db, testDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ok = await testDatabaseConnection();
    if (!ok) {
      return NextResponse.json(
        {
          error:
            "Tidak dapat terhubung ke database. Pastikan DATABASE_URL telah diset ke Vercel Postgres.",
        },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isOnboarded: true,
        createdAt: true,
        _count: {
          select: { cycles: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.info(`Admin: fetched user ${user.email}`);

    return NextResponse.json(user, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
