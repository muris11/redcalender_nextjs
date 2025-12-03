import { calculateCyclePhase } from "@/lib/cycle-utils";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "3months"; // 3months, 6months, 1year

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "3months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6months":
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    // Get user's cycles within the period
    const cycles = await db.cycle.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Get daily logs for symptom and mood analysis
    const dailyLogs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      include: {
        logSymptoms: {
          include: {
            symptom: true,
          },
        },
        logMoods: {
          include: {
            mood: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Calculate report data
    const reportData = calculateReportData(user, cycles, dailyLogs, period);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        menstrualStatus: user.menstrualStatus,
        lastPeriodDate: user.lastPeriodDate,
        avgCycleLength: user.avgCycleLength,
        avgPeriodLength: user.avgPeriodLength,
      },
      period,
      cycles: cycles.map((cycle) => ({
        id: cycle.id,
        startDate: cycle.startDate.toISOString().split("T")[0],
        endDate: cycle.endDate
          ? cycle.endDate.toISOString().split("T")[0]
          : null,
        isAbnormal: cycle.isAbnormal,
      })),
      report: reportData,
    });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

function calculateReportData(
  user: any,
  cycles: any[],
  dailyLogs: any[],
  period: string
) {
  const today = new Date();
  const lastPeriodDate = user.lastPeriodDate
    ? new Date(user.lastPeriodDate)
    : null;
  const avgCycleLength = user.avgCycleLength || 28;
  const avgPeriodLength = user.avgPeriodLength || 6;

  // Current cycle analysis
  let currentPhase = "follicular";
  let cycleDay = 1;
  let fertileWindowStart = 11;
  let fertileWindowEnd = 17;

  if (lastPeriodDate) {
    const cycleInfo = calculateCyclePhase(
      lastPeriodDate,
      avgCycleLength,
      avgPeriodLength,
      today
    );
    currentPhase = cycleInfo.phase;
    cycleDay = cycleInfo.cycleDay;
    fertileWindowStart = cycleInfo.fertileWindow.start;
    fertileWindowEnd = cycleInfo.fertileWindow.end;
  }

  // Calculate cycle statistics
  const cycleStats = calculateCycleStatistics(cycles);

  // Symptom and mood analysis
  const symptomAnalysis = analyzeSymptoms(dailyLogs);
  const moodAnalysis = analyzeMoods(dailyLogs);

  // Health alerts
  const healthAlerts = generateHealthAlerts(cycleStats, user.menstrualStatus);

  // Recommendations
  const recommendations = generateRecommendations(
    currentPhase,
    cycleStats,
    symptomAnalysis,
    user.menstrualStatus
  );

  return {
    cycleDay,
    currentPhase,
    avgCycleLength: cycleStats.avgCycleLength,
    avgPeriodLength: cycleStats.avgPeriodLength,
    fertileWindow: {
      isActive: cycleDay >= fertileWindowStart && cycleDay <= fertileWindowEnd,
      start: fertileWindowStart,
      end: fertileWindowEnd,
    },
    cycleStats,
    symptomFrequency: symptomAnalysis.frequency,
    moodFrequency: moodAnalysis.frequency,
    healthAlerts,
    recommendations,
  };
}

function calculateCycleStatistics(cycles: any[]) {
  if (cycles.length === 0) {
    return {
      avgCycleLength: 28,
      avgPeriodLength: 6,
      regularity: "insufficient_data",
      variation: 0,
      totalCycles: 0,
      cycleLengths: [],
      periodLengths: [],
    };
  }

  // Calculate cycle lengths
  const cycleLengths: number[] = [];
  const periodLengths: number[] = [];

  for (let i = 1; i < cycles.length; i++) {
    const prevCycle = cycles[i - 1];
    const currCycle = cycles[i];
    const cycleLength = Math.floor(
      (new Date(currCycle.startDate).getTime() -
        new Date(prevCycle.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (cycleLength > 0) cycleLengths.push(cycleLength);
  }

  // Calculate period lengths
  cycles.forEach((cycle) => {
    if (cycle.startDate && cycle.endDate) {
      const periodLength = Math.floor(
        (new Date(cycle.endDate).getTime() -
          new Date(cycle.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (periodLength > 0) periodLengths.push(periodLength);
    }
  });

  const avgCycleLength =
    cycleLengths.length > 0
      ? Math.round(
          cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
        )
      : 28;

  const avgPeriodLength =
    periodLengths.length > 0
      ? Math.round(
          periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length
        )
      : 6;

  // Calculate regularity
  let regularity = "regular";
  let variation = 0;

  if (cycleLengths.length >= 3) {
    const max = Math.max(...cycleLengths);
    const min = Math.min(...cycleLengths);
    variation = max - min;

    if (variation > 9 || avgCycleLength < 21 || avgCycleLength > 35) {
      regularity = "irregular";
    } else if (variation > 5) {
      regularity = "somewhat_irregular";
    }
  }

  return {
    avgCycleLength,
    avgPeriodLength,
    regularity,
    variation,
    totalCycles: cycles.length,
    cycleLengths,
    periodLengths,
  };
}

function analyzeSymptoms(dailyLogs: any[]) {
  const symptomCount: Record<string, number> = {};

  dailyLogs.forEach((log) => {
    log.logSymptoms.forEach((logSymptom: any) => {
      const symptomName = logSymptom.symptom.name;
      symptomCount[symptomName] = (symptomCount[symptomName] || 0) + 1;
    });
  });

  const frequency = Object.entries(symptomCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return { frequency, total: dailyLogs.length };
}

function analyzeMoods(dailyLogs: any[]) {
  const moodCount: Record<string, number> = {};

  dailyLogs.forEach((log) => {
    log.logMoods.forEach((logMood: any) => {
      const moodName = logMood.mood.name;
      moodCount[moodName] = (moodCount[moodName] || 0) + 1;
    });
  });

  const frequency = Object.entries(moodCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return { frequency, total: dailyLogs.length };
}

function generateHealthAlerts(cycleStats: any, menstrualStatus: string) {
  const alerts: Array<{
    title: string;
    message: string;
    severity: "low" | "medium" | "high";
  }> = [];

  if (cycleStats.regularity === "irregular" || cycleStats.variation > 9) {
    alerts.push({
      title: "Variasi Siklus",
      message: `Siklus Anda mengalami variasi ${cycleStats.variation} hari dalam periode terakhir.`,
      severity: "medium",
    });
  }

  if (cycleStats.avgCycleLength < 21 || cycleStats.avgCycleLength > 35) {
    alerts.push({
      title: "Panjang Siklus Tidak Normal",
      message: `Rata-rata panjang siklus Anda adalah ${cycleStats.avgCycleLength} hari. Normal: 21-35 hari.`,
      severity: "medium",
    });
  }

  if (menstrualStatus === "pms") {
    alerts.push({
      title: "PMS Terdeteksi",
      message:
        "Anda melaporkan sering mengalami PMS. Pertimbangkan untuk mencatat gejala lebih detail.",
      severity: "low",
    });
  }

  if (cycleStats.totalCycles < 3) {
    alerts.push({
      title: "Data Siklus Terbatas",
      message: "Dibutuhkan minimal 3 siklus untuk analisis yang akurat.",
      severity: "low",
    });
  }

  return alerts;
}

function generateRecommendations(
  phase: string,
  cycleStats: any,
  symptomAnalysis: any,
  menstrualStatus: string
) {
  const recommendations: Array<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }> = [];

  // Phase-based recommendations
  switch (phase) {
    case "menstrual":
      recommendations.push({
        title: "Tips Saat Menstruasi",
        description:
          "Minum air hangat, konsumsi makanan kaya zat besi, dan istirahat yang cukup.",
        priority: "high",
      });
      break;
    case "follicular":
      recommendations.push({
        title: "Tips Fase Folikuler",
        description:
          "Energi Anda meningkat. Ini waktu yang baik untuk memulai proyek baru dan olahraga.",
        priority: "medium",
      });
      break;
    case "ovulation":
      recommendations.push({
        title: "Tips Masa Subur",
        description:
          "Tingkat kesuburan tinggi. Pertimbangkan planning kehamilan atau kontrasepsi tambahan.",
        priority: "high",
      });
      break;
    case "luteal":
      recommendations.push({
        title: "Tips Fase Luteal",
        description:
          "Hormon sedang bersiap menstruasi. Fokus pada perawatan diri dan kelola stres.",
        priority: "medium",
      });
      break;
  }

  // Regularity-based recommendations
  if (cycleStats.regularity === "irregular") {
    recommendations.push({
      title: "Konsultasi Dokter",
      description:
        "Disarankan untuk berkonsultasi terkait variasi siklus yang tidak teratur.",
      priority: "medium",
    });
  }

  // Symptom-based recommendations
  const commonSymptoms = symptomAnalysis.frequency.map((s: any) => s.name);
  if (
    commonSymptoms.includes("Kelelahan") ||
    commonSymptoms.includes("Lelah")
  ) {
    recommendations.push({
      title: "Energi Rendah",
      description:
        "Tingkatkan asupan zat besi dan vitamin B. Pertimbangkan untuk tidur lebih awal.",
      priority: "medium",
    });
  }

  if (commonSymptoms.includes("Sakit kepala")) {
    recommendations.push({
      title: "Sakit Kepala",
      description:
        "Coba teknik relaksasi, minum cukup air, dan hindari makanan pemicu.",
      priority: "medium",
    });
  }

  return recommendations;
}
