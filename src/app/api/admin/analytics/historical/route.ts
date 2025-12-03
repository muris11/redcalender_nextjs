import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Generate all months for the current year
    type MonthStat = {
      startDate: Date;
      endDate: Date;
      monthName: string;
      year: number;
      month: number;
    };
    const months: MonthStat[] = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 1);

      months.push({
        startDate,
        endDate,
        monthName: `${startDate.toLocaleDateString("id-ID", {
          month: "short",
        })} ${currentYear}`,
        year: currentYear,
        month: month,
      });
    }

    // Fetch historical data for each month
    const historicalData = await Promise.all(
      months.map(async (month: MonthStat) => {
        const [userCount, articleCount, cycleCount] = await Promise.all([
          // Users created in this month
          db.user.count({
            where: {
              createdAt: {
                gte: month.startDate,
                lt: month.endDate,
              },
            },
          }),

          // Articles created in this month
          db.article.count({
            where: {
              createdAt: {
                gte: month.startDate,
                lt: month.endDate,
              },
            },
          }),

          // Cycles created in this month
          db.cycle.count({
            where: {
              createdAt: {
                gte: month.startDate,
                lt: month.endDate,
              },
            },
          }),
        ]);

        return {
          month: month.monthName,
          users: userCount,
          articles: articleCount,
          cycles: cycleCount,
        };
      })
    );

    return NextResponse.json({ historicalData });
  } catch (error) {
    console.error("Error fetching historical analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
