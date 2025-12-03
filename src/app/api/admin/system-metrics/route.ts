import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// In-memory storage for system metrics (in production, use Redis or database)
let systemMetrics = {
  serverStartTime: new Date(),
  apiCallCount: 0,
  errorCount: 0,
  lastHealthCheck: new Date(),
  responseTimes: [] as number[],
  averageResponseTime: 0,
};

// Middleware-like function to track API calls (would be implemented globally in production)
export function trackApiCall(responseTime: number, isError = false) {
  systemMetrics.apiCallCount++;
  if (isError) systemMetrics.errorCount++;
  systemMetrics.responseTimes.push(responseTime);

  // Keep only last 100 response times for average calculation
  if (systemMetrics.responseTimes.length > 100) {
    systemMetrics.responseTimes.shift();
  }

  // Calculate rolling average
  systemMetrics.averageResponseTime =
    systemMetrics.responseTimes.reduce((a, b) => a + b, 0) /
    systemMetrics.responseTimes.length;
}

export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    // Perform health checks
    const [dbHealth, userCount, articleCount, recentApiCalls] =
      await Promise.all([
        // Database health check
        checkDatabaseHealth(),

        // Quick counts for system load indication
        db.user.count(),
        db.article.count(),

        // Recent API activity (simulated - in production would track real API calls)
        Promise.resolve(systemMetrics.apiCallCount),
      ]);

    const uptime = now.getTime() - systemMetrics.serverStartTime.getTime();
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeDays = Math.floor(uptimeHours / 24);

    const metrics = {
      serverUptime:
        uptimeDays > 0
          ? `${uptimeDays}d ${uptimeHours % 24}h`
          : `${uptimeHours}h`,
      serverUptimePercentage: 99.9, // Simulated - in production calculate from actual downtime
      responseTime: Math.round(systemMetrics.averageResponseTime || 45), // Default to 45ms if no data
      databaseHealth: dbHealth ? "Healthy" : "Unhealthy",
      apiCallsToday: recentApiCalls,
      totalUsers: userCount,
      totalArticles: articleCount,
      errorRate:
        systemMetrics.apiCallCount > 0
          ? (systemMetrics.errorCount / systemMetrics.apiCallCount) * 100
          : 0,
      lastHealthCheck: systemMetrics.lastHealthCheck.toISOString(),
    };

    // Update last health check time
    systemMetrics.lastHealthCheck = now;

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching system metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch system metrics" },
      { status: 500 }
    );
  }
}

// Database health check function
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Simple query to test database connectivity
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}
