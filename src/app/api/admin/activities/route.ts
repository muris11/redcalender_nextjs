import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get recent user activities by combining different actions
    // Since we don't have a dedicated activity log table yet, we'll synthesize activities
    // from recent database changes across different tables

    const [recentUsers, recentArticles, recentCycles, recentDailyLogs] =
      await Promise.all([
        // Recent user registrations
        db.user.findMany({
          take: Math.ceil(limit / 4), // Distribute limit across activity types
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),

        // Recent articles
        db.article.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            createdAt: true,
            author: {
              select: { name: true },
            },
            category: true,
          },
        }),

        // Recent cycles
        db.cycle.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { name: true },
            },
          },
        }),

        // Recent daily logs
        db.dailyLog.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { name: true },
            },
          },
        }),
      ]);

    // Combine and sort all activities by timestamp
    const activities = [
      ...recentUsers.map((user) => ({
        id: `user-${user.id}`,
        user: user.name,
        action: "Joined platform",
        time: user.createdAt,
        type: "user" as const,
        timestamp: user.createdAt,
      })),
      ...recentArticles.map((article) => ({
        id: `article-${article.id}`,
        user: article.author.name,
        action: "Created new article",
        time: article.createdAt,
        type: "article" as const,
        timestamp: article.createdAt,
        details: { title: article.title, category: article.category },
      })),
      ...recentCycles.map((cycle) => ({
        id: `cycle-${cycle.id}`,
        user: cycle.user.name,
        action: "Logged menstrual cycle",
        time: cycle.createdAt,
        type: "cycle" as const,
        timestamp: cycle.createdAt,
      })),
      ...recentDailyLogs.map((log) => ({
        id: `dailylog-${log.id}`,
        user: log.user.name,
        action: "Submitted daily log",
        time: log.createdAt,
        type: "log" as const,
        timestamp: log.createdAt,
        details: { date: log.date.toISOString().split("T")[0] },
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit)
      .map((activity) => ({
        ...activity,
        time: getRelativeTime(activity.timestamp),
      }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}
