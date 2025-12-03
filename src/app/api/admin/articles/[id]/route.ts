import { db } from "@/lib/db";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  const { id } = await params;
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
        category: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { params } = context || {};
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, content, categoryId, thumbnail, published } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and categoryId are required" },
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

    const article = await db.article.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        thumbnail,
        published,
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
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { params } = context || {};
  const { id } = await params;
  try {
    // delete associated thumbnail from storage if present
    const article = await db.article.findUnique({
      where: { id },
      select: { thumbnail: true },
    });
    if (article && article.thumbnail) {
      try {
        const server = createSupabaseServer();
        if (server) {
          const extractPath = (value: string) => {
            try {
              if (!value) return "";
              if (/^https?:\/\//i.test(value)) {
                const u = new URL(value);
                const parts = u.pathname.split("/");
                const idx = parts.indexOf("articles");
                if (idx >= 0) return parts.slice(idx + 1).join("/");
                return value;
              }
              return value;
            } catch (err) {
              return value;
            }
          };

          const path = extractPath(article.thumbnail);
          if (path) {
            await server.storage.from("articles").remove([path]);
          }
        }
      } catch (err) {
        console.error("Failed to delete thumbnail from storage:", err);
      }
    }

    await db.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
