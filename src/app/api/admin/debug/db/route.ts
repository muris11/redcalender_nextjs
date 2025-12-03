import { db, getDbInfo, testDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const connected = await testDatabaseConnection();
    const dbInfo = getDbInfo();

    let totalUsers: number | null = null;
    if (connected) {
      try {
        totalUsers = await db.user.count();
      } catch (error) {
        console.warn("Failed to count users in debug endpoint", error);
      }
    }

    return NextResponse.json(
      { connected, dbInfo, totalUsers },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Debug DB route error:", error);
    return NextResponse.json(
      { error: "Failed to run debug checks" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
