import { calculateCyclePhase } from "@/lib/cycle-utils";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth().toString()
    );

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

    // Get cycles for the month and surrounding months for accurate calculation
    const startDate = new Date(year, month - 1, 1); // Previous month
    const endDate = new Date(year, month + 2, 0); // Next month end

    const cycles = await db.cycle.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { startDate: "asc" },
    });

    // Get daily logs for the month
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const dailyLogs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        date: true,
        id: true,
      },
    });

    // Generate calendar data
    const calendarData = generateCalendarData(
      year,
      month,
      user,
      cycles,
      dailyLogs
    );

    return NextResponse.json({
      year,
      month,
      calendarData,
      user: {
        avgCycleLength: user.avgCycleLength,
        avgPeriodLength: user.avgPeriodLength,
        lastPeriodDate: user.lastPeriodDate,
      },
    });
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
}

function generateCalendarData(
  year: number,
  month: number,
  user: any,
  cycles: any[],
  dailyLogs: any[]
) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  // Adjust starting day of week for Monday-first calendar
  // getDay() returns 0=Sunday, 1=Monday, etc.
  // We want Monday=0, Tuesday=1, ..., Sunday=6
  const jsDayOfWeek = firstDayOfMonth.getDay();
  const startingDayOfWeek = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;

  const calendarDays: Array<{
    date: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    phase: "menstrual" | "follicular" | "ovulation" | "luteal" | null;
    cycleDay: number | null;
    hasData: boolean;
  }> = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    calendarDays.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      isToday: false,
      phase: null,
      cycleDay: null,
      hasData: false,
    });
  }

  // Current month days
  const today = new Date();
  // Use local date instead of UTC for accurate today detection
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const isToday = dateString === todayString;

    // Calculate cycle phase
    let phase: "menstrual" | "follicular" | "ovulation" | "luteal" | null =
      null;
    let cycleDay: number | null = null;

    if (user.lastPeriodDate) {
      const cycleInfo = calculateCyclePhase(
        user.lastPeriodDate,
        user.avgCycleLength || 28,
        user.avgPeriodLength || 6,
        date
      );
      phase = cycleInfo.phase;
      cycleDay = cycleInfo.cycleDay;
    } else {
      // Demo data: simulate a cycle starting from day 1 of current month
      const dayOfMonth = date.getDate();
      cycleDay = dayOfMonth;

      // Simulate cycle phases for demonstration
      if (dayOfMonth <= 5) {
        phase = "menstrual";
      } else if (dayOfMonth >= 12 && dayOfMonth <= 16) {
        phase = "ovulation";
      } else if (dayOfMonth > 16 && dayOfMonth <= 28) {
        phase = "luteal";
      } else if (dayOfMonth > 5 && dayOfMonth < 12) {
        phase = "follicular";
      }
    }

    // Check if day has logged data
    const hasData = dailyLogs.some(
      (log) => new Date(log.date).toDateString() === date.toDateString()
    );

    calendarDays.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: true,
      isToday,
      phase,
      cycleDay,
      hasData,
    });
  }

  // Next month days to fill grid (42 days total for 6 rows)
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    calendarDays.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      isToday: false,
      phase: null,
      cycleDay: null,
      hasData: false,
    });
  }

  return calendarDays;
}
