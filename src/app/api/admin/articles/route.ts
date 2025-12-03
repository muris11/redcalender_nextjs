import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [articles, totalArticles] = await Promise.all([
      db.article.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: { name: true },
          },
          category: true,
        },
      }),
      db.article.count(),
    ]);

    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      articles,
      totalArticles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, categoryId, thumbnail, createdBy } = body;

    if (!title || !content || !categoryId || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await db.articleCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const article = await db.article.create({
      data: {
        title,
        content,
        categoryId,
        thumbnail,
        createdBy,
        published: true, // Default to published for now
      },
      include: {
        author: {
          select: { name: true },
        },
        category: true,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
