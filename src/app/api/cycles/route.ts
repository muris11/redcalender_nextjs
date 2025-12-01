import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const cycles = await db.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 12 // Last 12 cycles
    });

    return NextResponse.json({ cycles });

  } catch (error) {
    console.error('Error fetching cycles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cycles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, startDate, endDate } = await request.json();

    if (!userId || !startDate) {
      return NextResponse.json(
        { error: 'User ID and start date are required' },
        { status: 400 }
      );
    }

    // Create new cycle
    const cycle = await db.cycle.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    // Update user's average cycle length if we have previous cycles
    const allCycles = await db.cycle.findMany({
      where: { userId, endDate: { not: null } }
    });

    if (allCycles.length > 1) {
      const cycleLengths = allCycles.map(c => {
        const start = new Date(c.startDate);
        const prevCycle = allCycles.find(prev => 
          new Date(prev.startDate) < start && prev.id !== c.id
        );
        if (prevCycle) {
          return Math.floor((start.getTime() - new Date(prevCycle.startDate).getTime()) / (1000 * 60 * 60 * 24));
        }
        return 0;
      }).filter(length => length > 0);

      if (cycleLengths.length > 0) {
        const avgLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
        await db.user.update({
          where: { id: userId },
          data: { avgCycleLength: avgLength }
        });
      }
    }

    return NextResponse.json({
      message: 'Cycle created successfully',
      cycle
    });

  } catch (error) {
    console.error('Error creating cycle:', error);
    return NextResponse.json(
      { error: 'Failed to create cycle' },
      { status: 500 }
    );
  }
}