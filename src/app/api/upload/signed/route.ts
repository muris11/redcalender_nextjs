import { createSupabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const server = createSupabaseServer();
    if (!server) {
      return NextResponse.json(
        {
          error:
            "Server is not configured for uploads. Missing SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const path = url.searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 }
      );
    }

    const expires = parseInt(
      process.env.SUPABASE_SIGNED_URL_EXPIRES || "3600",
      10
    );
    const { data, error } = await server.storage
      .from("articles")
      .createSignedUrl(path, expires);
    if (error) {
      console.error("Failed to create signed URL:", error);
      return NextResponse.json(
        { error: "Failed to create signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl: data.signedUrl, path });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create signed url" },
      { status: 500 }
    );
  }
}
