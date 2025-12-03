import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: "Admin report export removed" },
    { status: 410 }
  );
}
