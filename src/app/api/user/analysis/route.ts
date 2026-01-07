import { calculateCyclePhase } from "@/lib/cycle-utils";
import { db } from "@/lib/db";
import { requireUserAccess } from "@/lib/auth";
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

    // Verify user can only access their own data
    const auth = await requireUserAccess(userId);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's cycles
    const cycles = await db.cycle.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
      take: 12, // Last 12 cycles
    });

    // Get daily logs for symptom analysis
    const dailyLogs = await db.dailyLog.findMany({
      where: { userId },
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
      take: 180, // Last 6 months
    });

    // Calculate cycle analysis
    const analysis = calculateCycleAnalysis(user, cycles, dailyLogs);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        avgCycleLength: user.avgCycleLength,
        avgPeriodLength: user.avgPeriodLength,
        menstrualStatus: user.menstrualStatus,
        lastPeriodDate: user.lastPeriodDate,
      },
      cycles: cycles,
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}

function calculateCycleAnalysis(user: any, cycles: any[], dailyLogs: any[]) {
  const today = new Date();
  const lastPeriodDate = user.lastPeriodDate
    ? new Date(user.lastPeriodDate)
    : null;
  const avgCycleLength = user.avgCycleLength || 28;
  const avgPeriodLength = user.avgPeriodLength || 6;

  // Current cycle analysis
  let currentPhase = "follicular";
  let cycleDay = 1;
  let daysUntilNextPeriod = 0;
  let fertileWindowStart: number | null = null;
  let fertileWindowEnd: number | null = null;
  let ovulationDay: number | null = null;

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
    ovulationDay = 14; // Approximate ovulation day
  }

  // Cycle regularity analysis
  let cycleRegularity = "regular";
  let variation = 0;

  if (cycles.length >= 3) {
    const cycleLengths: number[] = [];
    for (let i = 1; i < cycles.length; i++) {
      const prevCycle = cycles[i - 1];
      const currCycle = cycles[i];
      const days = Math.floor(
        (new Date(currCycle.startDate).getTime() -
          new Date(prevCycle.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (days > 0) cycleLengths.push(days);
    }

    if (cycleLengths.length > 0) {
      const avg = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
      const max = Math.max(...cycleLengths);
      const min = Math.min(...cycleLengths);
      variation = max - min;

      if (variation > 9 || avg < 21 || avg > 35) {
        cycleRegularity = "irregular";
      } else if (variation > 5) {
        cycleRegularity = "somewhat_irregular";
      }
    }
  }

  // Symptom analysis
  const symptomFrequency: Record<string, number> = {};
  const moodFrequency: Record<string, number> = {};

  dailyLogs.forEach((log) => {
    // Count symptoms
    log.logSymptoms.forEach((logSymptom: any) => {
      const symptomName = logSymptom.symptom.name;
      symptomFrequency[symptomName] = (symptomFrequency[symptomName] || 0) + 1;
    });

    // Count moods
    log.logMoods.forEach((logMood: any) => {
      const moodName = logMood.mood.name;
      moodFrequency[moodName] = (moodFrequency[moodName] || 0) + 1;
    });
  });

  // Health recommendations based on analysis
  const recommendations = generateRecommendations(
    currentPhase,
    cycleRegularity,
    symptomFrequency,
    user.menstrualStatus
  );

  return {
    currentPhase,
    cycleDay,
    daysUntilNextPeriod,
    fertileWindow: {
      start: fertileWindowStart,
      end: fertileWindowEnd,
      isActive:
        fertileWindowStart &&
        fertileWindowEnd &&
        cycleDay >= fertileWindowStart &&
        cycleDay <= fertileWindowEnd,
    },
    ovulationDay,
    cycleRegularity,
    variation,
    avgCycleLength:
      cycles.length > 0
        ? Math.round(
            cycles.reduce((sum, cycle) => {
              const nextCycle = cycles.find(
                (c) => new Date(c.startDate) > new Date(cycle.startDate)
              );
              if (nextCycle) {
                return (
                  sum +
                  Math.floor(
                    (new Date(nextCycle.startDate).getTime() -
                      new Date(cycle.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
              }
              return sum;
            }, 0) /
              (cycles.length - 1)
          )
        : avgCycleLength,
    avgPeriodLength:
      cycles.length > 0
        ? Math.round(
            cycles.reduce((sum, cycle) => {
              if (cycle.startDate && cycle.endDate) {
                return (
                  sum +
                  Math.floor(
                    (new Date(cycle.endDate).getTime() -
                      new Date(cycle.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
              }
              return sum;
            }, 0) / cycles.filter((c) => c.startDate && c.endDate).length
          )
        : avgPeriodLength,
    symptomFrequency: (Object.entries(symptomFrequency) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    moodFrequency: (Object.entries(moodFrequency) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    recommendations,
    healthAlerts: generateHealthAlerts(
      cycleRegularity,
      variation,
      user.menstrualStatus
    ),
  };
}

function generateRecommendations(
  phase: string,
  regularity: string,
  symptoms: any,
  menstrualStatus: string
) {
  const recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
  }> = [];

  // Phase-based recommendations
  switch (phase) {
    case "menstrual":
      recommendations.push({
        type: "phase",
        title: "Tips Saat Menstruasi",
        description:
          "Minum air hangat, konsumsi makanan kaya zat besi, dan istirahat yang cukup.",
        priority: "high",
      });
      break;
    case "follicular":
      recommendations.push({
        type: "phase",
        title: "Tips Fase Folikuler",
        description:
          "Energi Anda meningkat. Ini waktu yang baik untuk memulai proyek baru dan olahraga.",
        priority: "medium",
      });
      break;
    case "ovulation":
      recommendations.push({
        type: "phase",
        title: "Tips Masa Subur",
        description:
          "Tingkat kesuburan tinggi. Pertimbangkan planning kehamilan atau kontrasepsi tambahan.",
        priority: "high",
      });
      break;
    case "luteal":
      recommendations.push({
        type: "phase",
        title: "Tips Fase Luteal",
        description:
          "Hormon sedang bersiap menstruasi. Fokus pada perawatan diri dan kelola stres.",
        priority: "medium",
      });
      break;
  }

  // Regularity-based recommendations
  if (regularity === "irregular") {
    recommendations.push({
      type: "health",
      title: "Siklus Tidak Teratur",
      description:
        "Siklus Anda tidak teratur. Disarankan untuk berkonsultasi dengan dokter.",
      priority: "high",
    });
  }

  // Symptom-based recommendations
  const commonSymptoms = Object.keys(symptoms);
  if (
    commonSymptoms.includes("Kelelahan") ||
    commonSymptoms.includes("Lelah/mudah capek")
  ) {
    recommendations.push({
      type: "lifestyle",
      title: "Energi Rendah",
      description:
        "Tingkatkan asupan zat besi dan vitamin B. Pertimbangkan untuk tidur lebih awal.",
      priority: "medium",
    });
  }

  if (commonSymptoms.includes("Sakit kepala")) {
    recommendations.push({
      type: "lifestyle",
      title: "Sakit Kepala",
      description:
        "Coba teknik relaksasi, minum cukup air, dan hindari makanan pemicu.",
      priority: "medium",
    });
  }

  return recommendations;
}

function generateHealthAlerts(
  regularity: string,
  variation: number,
  menstrualStatus: string
) {
  const alerts: Array<{
    type: string;
    title: string;
    message: string;
    severity: string;
  }> = [];

  if (regularity === "irregular" || variation > 9) {
    alerts.push({
      type: "warning",
      title: "Siklus Tidak Normal",
      message:
        "Siklus Anda fluktuatif melebihi variasi tipikal. Penting untuk tetap waspada. Jika Anda merasa khawatir, jangan ragu untuk berbicara dengan penyedia perawatan kesehatan.",
      severity: "medium",
    });
  }

  if (menstrualStatus === "pms") {
    alerts.push({
      type: "info",
      title: "PMS Terdeteksi",
      message:
        "Anda melaporkan sering mengalami PMS. Pertimbangkan untuk mencatat gejala lebih detail dan berkonsultasi dengan dokter jika gejala berat.",
      severity: "low",
    });
  }

  return alerts;
}
