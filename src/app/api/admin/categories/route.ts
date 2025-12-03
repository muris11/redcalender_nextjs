import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const categories = await db.articleCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, color, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await db.articleCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await db.articleCategory.create({
      data: {
        name,
        slug,
        description: description || "",
        icon: icon || "FileText",
        color: color || "#6B7280",
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, color, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current category)
    const url = new URL(request.url);
    const categoryId = url.pathname.split("/").pop();

    const existingCategory = await db.articleCategory.findFirst({
      where: {
        slug,
        NOT: { id: categoryId },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await db.articleCategory.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description,
        icon,
        color,
        order: parseInt(order),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const categoryId = url.pathname.split("/").pop();

    // Check if category has articles
    const categoryWithArticles = await db.articleCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (categoryWithArticles && categoryWithArticles._count.articles > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing articles" },
        { status: 400 }
      );
    }

    await db.articleCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
