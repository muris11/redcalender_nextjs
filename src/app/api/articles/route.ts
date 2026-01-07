import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [articles, totalArticles] = await Promise.all([
      db.article.findMany({
        where: { published: true },
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
      db.article.count({ where: { published: true } }),
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
