/**
 * Utility functions for menstrual cycle calculations
 */

export interface CyclePhase {
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  cycleDay: number;
  fertileWindow: {
    isActive: boolean;
    start: number;
    end: number;
  };
}

/**
 * Calculate current cycle phase and day based on user's last period date
 */
export function calculateCyclePhase(
  lastPeriodDate: Date | string | null,
  avgCycleLength: number = 28,
  avgPeriodLength: number = 6,
  currentDate: Date = new Date()
): CyclePhase {
  let cycleDay = 1;
  let phase: "menstrual" | "follicular" | "ovulation" | "luteal" = "follicular";

  if (lastPeriodDate) {
    const lastPeriod =
      typeof lastPeriodDate === "string"
        ? new Date(lastPeriodDate)
        : lastPeriodDate;
    const daysSinceLastPeriod = Math.floor(
      (currentDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPeriod >= 0) {
      cycleDay = daysSinceLastPeriod + 1;

      // Determine phase based on cycle day
      if (cycleDay <= avgPeriodLength) {
        phase = "menstrual";
      } else if (cycleDay >= 12 && cycleDay <= 16) {
        phase = "ovulation";
      } else if (cycleDay > 16 && cycleDay <= avgCycleLength) {
        phase = "luteal";
      } else if (cycleDay > avgPeriodLength && cycleDay < 12) {
        phase = "follicular";
      } else {
        // Beyond cycle length, reset to follicular for next cycle
        phase = "follicular";
        cycleDay = cycleDay - avgCycleLength;
      }
    }
  }

  // Calculate fertile window (typically days 10-16, but can be adjusted)
  const fertileWindowStart = 11;
  const fertileWindowEnd = 17;

  return {
    phase,
    cycleDay,
    fertileWindow: {
      isActive: cycleDay >= fertileWindowStart && cycleDay <= fertileWindowEnd,
      start: fertileWindowStart,
      end: fertileWindowEnd,
    },
  };
}

/**
 * Get phase name in Indonesian (user-friendly terminology)
 */
export function getPhaseName(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "Sedang Menstruasi";
    case "follicular":
      return "Setelah Menstruasi";
    case "ovulation":
      return "Masa Subur";
    case "luteal":
      return "Menjelang Menstruasi";
    default:
      return phase;
  }
}

/**
 * Get phase color for UI
 */
export function getPhaseColor(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "bg-red-100 text-red-800";
    case "follicular":
      return "bg-green-100 text-green-800";
    case "ovulation":
      return "bg-purple-100 text-purple-800";
    case "luteal":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Calculate cycle regularity based on cycle lengths
 */
export function calculateCycleRegularity(cycleLengths: number[]): {
  isRegular: boolean;
  avgLength: number;
  variation: number;
} {
  if (cycleLengths.length === 0) {
    return { isRegular: false, avgLength: 28, variation: 0 };
  }

  const avgLength =
    cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const variation = Math.sqrt(
    cycleLengths.reduce(
      (sum, length) => sum + Math.pow(length - avgLength, 2),
      0
    ) / cycleLengths.length
  );

  // Consider regular if average is 21-35 days and variation is less than 7 days
  const isRegular = avgLength >= 21 && avgLength <= 35 && variation < 7;

  return { isRegular, avgLength, variation };
}
