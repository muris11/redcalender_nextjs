import { db, testDatabaseConnection } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify admin access
  const auth = await requireAuth("ADMIN");
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isOnboarded: true,
          createdAt: true,
          _count: {
            select: { cycles: true },
          },
        },
      }),
      db.user.count(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    console.info(
      `Admin: fetched ${users.length} users (page ${page}/${totalPages}) from database`
    );

    return NextResponse.json(
      { users, totalUsers, totalPages, currentPage: page },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Verify admin access
  const auth = await requireAuth("ADMIN");
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verify admin access
  const auth = await requireAuth("ADMIN");
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

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

    const body = await request.json();
    const { name, email, phone, role, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        role: role || "USER",
        password: hashedPassword,
      },
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

    console.info(`Admin: created new user ${user.email}`);

    return NextResponse.json({ user, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Verify admin access
  const auth = await requireAuth("ADMIN");
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

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

    const body = await request.json();
    const { id, name, email, phone, role, password } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "ID, name, and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await db.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken by another user" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      phone,
      role,
    };

    // Only update password if provided - hash it first
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
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

    console.info(`Admin: updated user ${user.email}`);

    return NextResponse.json({ user, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
