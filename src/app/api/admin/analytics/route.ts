import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get current date for calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parallel database queries for better performance
    const [
      totalUsers,
      activeUsers,
      totalArticles,
      publishedArticles,
      totalCycles,
      activeCycles,
      dailyLogsToday,
      dailyLogsThisWeek,
      userGrowthThisMonth,
      userGrowthLastMonth,
      articleGrowthThisMonth,
      articleGrowthLastMonth,
      cycleGrowthThisMonth,
      cycleGrowthLastMonth,
    ] = await Promise.all([
      // Total Users
      db.user.count(),

      // Active Users (logged in within last 30 days - approximation using createdAt or last activity)
      db.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Total Articles
      db.article.count(),

      // Published Articles
      db.article.count({
        where: { published: true },
      }),

      // Total Cycles
      db.cycle.count(),

      // Active Cycles (cycles created this month)
      db.cycle.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),

      // Daily Logs Today
      db.dailyLog.count({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Daily Logs This Week
      db.dailyLog.count({
        where: {
          date: {
            gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // User Growth This Month
      db.user.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),

      // User Growth Last Month
      db.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),

      // Article Growth This Month
      db.article.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),

      // Article Growth Last Month
      db.article.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),

      // Cycle Growth This Month
      db.cycle.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),

      // Cycle Growth Last Month
      db.cycle.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const analytics = {
      totalUsers,
      activeUsers,
      totalArticles,
      publishedArticles,
      totalCycles,
      activeCycles,
      dailyLogsToday,
      dailyLogsThisWeek,
      userGrowth: {
        thisMonth: userGrowthThisMonth,
        lastMonth: userGrowthLastMonth,
        percentage: calculateGrowth(userGrowthThisMonth, userGrowthLastMonth),
      },
      articleGrowth: {
        thisMonth: articleGrowthThisMonth,
        lastMonth: articleGrowthLastMonth,
        percentage: calculateGrowth(
          articleGrowthThisMonth,
          articleGrowthLastMonth
        ),
      },
      cycleGrowth: {
        thisMonth: cycleGrowthThisMonth,
        lastMonth: cycleGrowthLastMonth,
        percentage: calculateGrowth(cycleGrowthThisMonth, cycleGrowthLastMonth),
      },
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
