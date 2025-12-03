import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate filename
    const filename = `article_${Date.now()}_${(file as any).name}`;

    // Upload to Supabase Storage (bucket: articles)
    const { data, error } = await server.storage
      .from("articles")
      .upload(filename, file as any, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If the project prefers private buckets, generate a signed URL
    const usePrivate = process.env.SUPABASE_USE_PRIVATE_BUCKET === "true";
    if (usePrivate) {
      const expires = parseInt(
        process.env.SUPABASE_SIGNED_URL_EXPIRES || "3600",
        10
      );
      const filePath = data?.path || filename;
      const { data: signedData, error: signedErr } = await server.storage
        .from("articles")
        .createSignedUrl(filePath, expires);

      if (signedErr) {
        console.error("Failed to create signed URL:", signedErr);
        return NextResponse.json(
          { error: "Failed to generate signed URL" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        signedUrl: signedData.signedUrl,
        path: filePath,
      });
    }

    const { data: publicData } = server.storage
      .from("articles")
      .getPublicUrl(data?.path || filename);

    const publicUrl = publicData.publicUrl;

    return NextResponse.json({ publicUrl, path: data?.path || filename });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { path } = body || {};
    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const { data, error } = await server.storage
      .from("articles")
      .remove([path]);
    if (error) {
      console.error("Failed to remove file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "File removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove file" },
      { status: 500 }
    );
  }
}
