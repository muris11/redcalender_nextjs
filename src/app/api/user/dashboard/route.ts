import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avgCycleLength: true,
        avgPeriodLength: true,
        lastPeriodDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get latest cycle data
    const latestCycle = await db.cycle.findFirst({
      where: { userId },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        isAbnormal: true,
      },
    });

    // Get recent cycles for averages (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentCycles = await db.cycle.findMany({
      where: {
        userId,
        startDate: { gte: sixMonthsAgo },
      },
      orderBy: { startDate: "desc" },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    // Get today's log
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLog = await db.dailyLog.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        logSymptoms: {
          include: { symptom: true },
        },
        logMoods: {
          include: { mood: true },
        },
      },
    });

    // Get total counts
    const [totalCycles, totalLogs] = await Promise.all([
      db.cycle.count({ where: { userId } }),
      db.dailyLog.count({ where: { userId } }),
    ]);

    // Calculate cycle metrics
    const cycleMetrics = calculateCycleMetrics(user, latestCycle, recentCycles);

    // Calculate today's data
    const todayData = calculateTodayData(todayLog);

    // Calculate quick stats
    const quickStats = calculateQuickStats(
      user,
      totalCycles,
      totalLogs,
      recentCycles
    );

    // Generate health alerts
    const alerts = generateHealthAlerts(cycleMetrics, todayData, quickStats);

    const dashboardData = {
      currentCycle: cycleMetrics,
      recentCycles: {
        averageLength: user.avgCycleLength || 28,
        averagePeriodLength: user.avgPeriodLength || 6,
        regularity: calculateRegularity(recentCycles),
        lastPeriodDate: latestCycle?.startDate || user.lastPeriodDate,
      },
      todayLog: todayData,
      stats: quickStats,
      alerts,
    };

    return NextResponse.json({ dashboard: dashboardData });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Helper function to calculate cycle metrics
function calculateCycleMetrics(
  user: any,
  latestCycle: any,
  recentCycles: any[]
) {
  const now = new Date();

  if (!latestCycle) {
    return {
      cycleDay: 1,
      currentPhase: "unknown" as const,
      daysUntilNextPeriod: 28, // Default
      nextPeriodDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
      isLate: false,
      daysLate: 0,
    };
  }

  const cycleStart = new Date(latestCycle.startDate);
  const cycleDay =
    Math.floor((now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) +
    1;
  const avgCycleLength = user.avgCycleLength || 28;

  // Calculate next period date
  const nextPeriodDate = new Date(cycleStart);
  nextPeriodDate.setDate(cycleStart.getDate() + avgCycleLength);

  const daysUntilNextPeriod = Math.ceil(
    (nextPeriodDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine current phase
  let currentPhase: "menstrual" | "follicular" | "ovulation" | "luteal" =
    "follicular";

  if (cycleDay <= (user.avgPeriodLength || 6)) {
    currentPhase = "menstrual";
  } else if (
    cycleDay >= avgCycleLength - 14 &&
    cycleDay <= avgCycleLength - 10
  ) {
    currentPhase = "ovulation";
  } else if (cycleDay > avgCycleLength - 10) {
    currentPhase = "luteal";
  }

  return {
    cycleDay,
    currentPhase,
    daysUntilNextPeriod: Math.max(0, daysUntilNextPeriod),
    nextPeriodDate,
    isLate: daysUntilNextPeriod < 0,
    daysLate: Math.abs(Math.min(0, daysUntilNextPeriod)),
  };
}

// Helper function to calculate today's data
function calculateTodayData(todayLog: any) {
  if (!todayLog) {
    return {
      hasLogged: false,
      waterIntake: 0,
      symptoms: [],
      mood: "",
      lastLoggedAt: null,
    };
  }

  return {
    hasLogged: true,
    waterIntake: todayLog.waterIntake || 0,
    symptoms: todayLog.logSymptoms?.map((ls: any) => ls.symptom.name) || [],
    mood: todayLog.logMoods?.[0]?.mood.name || "",
    lastLoggedAt: todayLog.updatedAt,
  };
}

// Helper function to calculate quick stats
function calculateQuickStats(
  user: any,
  totalCycles: number,
  totalLogs: number,
  recentCycles: any[]
) {
  // Calculate logging streak (simplified - consecutive days with logs)
  const streakDays = 0; // TODO: Implement streak calculation

  // Calculate health score (0-100)
  let healthScore = 100;

  // Deduct for irregular cycles
  const regularity = calculateRegularity(recentCycles);
  if (regularity === "irregular") healthScore -= 20;

  // Deduct for low logging frequency
  const expectedLogs = Math.floor(
    (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const loggingRate = totalLogs / expectedLogs;
  if (loggingRate < 0.7) healthScore -= 15;

  return {
    totalCycles,
    totalLogs,
    streakDays,
    healthScore: Math.max(0, Math.min(100, healthScore)),
  };
}

// Helper function to calculate cycle regularity
function calculateRegularity(cycles: any[]): "regular" | "irregular" {
  if (cycles.length < 3) return "regular";

  const lengths = cycles
    .slice(0, -1)
    .map((cycle, index) => {
      const nextCycle = cycles[index + 1];
      if (!nextCycle) return 0;
      return Math.floor(
        (new Date(cycle.startDate).getTime() -
          new Date(nextCycle.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    })
    .filter((length) => length > 0);

  if (lengths.length < 2) return "regular";

  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, length) => sum + Math.pow(length - avgLength, 2), 0) /
    lengths.length;
  const stdDev = Math.sqrt(variance);

  // If standard deviation is more than 7 days, consider irregular
  return stdDev > 7 ? "irregular" : "regular";
}

// Generate health alerts
function generateHealthAlerts(
  cycleMetrics: any,
  todayData: any,
  quickStats: any
) {
  const alerts: Array<{
    type: "period" | "fertility" | "health" | "reminder";
    message: string;
    priority: "low" | "medium" | "high";
    actionRequired: boolean;
  }> = [];

  // Late period alert
  if (cycleMetrics.isLate && cycleMetrics.daysLate > 2) {
    alerts.push({
      type: "period" as const,
      message: `Periode Anda terlambat ${cycleMetrics.daysLate} hari. Pertimbangkan untuk melakukan tes kehamilan jika memungkinkan.`,
      priority: "high" as const,
      actionRequired: true,
    });
  }

  // Upcoming period reminder
  if (
    cycleMetrics.daysUntilNextPeriod <= 3 &&
    cycleMetrics.daysUntilNextPeriod > 0
  ) {
    alerts.push({
      type: "reminder" as const,
      message: `Periode Anda akan datang dalam ${cycleMetrics.daysUntilNextPeriod} hari. Persiapkan kebutuhan menstruasi.`,
      priority: "medium" as const,
      actionRequired: false,
    });
  }

  // Fertile window alert
  if (cycleMetrics.currentPhase === "ovulation") {
    alerts.push({
      type: "fertility" as const,
      message:
        "Anda sedang dalam masa subur. Ini adalah waktu yang baik untuk konsepsi jika sedang merencanakan kehamilan.",
      priority: "medium" as const,
      actionRequired: false,
    });
  }

  // Low health score alert
  if (quickStats.healthScore < 60) {
    alerts.push({
      type: "health" as const,
      message:
        "Skor kesehatan Anda rendah. Pertimbangkan untuk berkonsultasi dengan dokter atau meningkatkan rutinitas logging.",
      priority: "medium" as const,
      actionRequired: true,
    });
  }

  // No logging today reminder
  if (!todayData.hasLogged) {
    alerts.push({
      type: "reminder" as const,
      message:
        "Belum ada log hari ini. Jaga konsistensi tracking untuk wawasan kesehatan yang lebih baik.",
      priority: "low" as const,
      actionRequired: false,
    });
  }

  return alerts;
}
