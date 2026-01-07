import { db } from '@/lib/db';
import { requireUserAccess } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

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

    // Verify user can only access their own data
    const auth = await requireUserAccess(userId);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
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

    // Verify user can only create their own cycles
    const auth = await requireUserAccess(userId);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Create new cycle
    const cycle = await db.cycle.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    // Update user's status - now menstruating
    await db.user.update({
      where: { id: userId },
      data: { 
        currentlyMenstruating: 'yes',
        lastPeriodDate: new Date(startDate)
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

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { endDate } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user can only update their own cycles
    const auth = await requireUserAccess(userId);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Find the latest cycle without an end date
    const latestCycle = await db.cycle.findFirst({
      where: { 
        userId,
        endDate: null 
      },
      orderBy: { startDate: 'desc' }
    });

    if (!latestCycle) {
      return NextResponse.json(
        { error: 'No active period found' },
        { status: 404 }
      );
    }

    // Update the cycle with end date
    const updatedCycle = await db.cycle.update({
      where: { id: latestCycle.id },
      data: { endDate: new Date(endDate) }
    });

    // Update user's average period length and status
    const cyclesWithEnd = await db.cycle.findMany({
      where: { userId, endDate: { not: null } }
    });

    if (cyclesWithEnd.length > 0) {
      const periodLengths = cyclesWithEnd.map(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate!);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      });
      
      const avgPeriodLength = Math.round(
        periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length
      );
      
      await db.user.update({
        where: { id: userId },
        data: { 
          avgPeriodLength,
          currentlyMenstruating: 'no',
          lastPeriodEndDate: new Date(endDate)
        }
      });
    } else {
      // Just update the status if no cycles with end date yet
      await db.user.update({
        where: { id: userId },
        data: { 
          currentlyMenstruating: 'no',
          lastPeriodEndDate: new Date(endDate)
        }
      });
    }

    return NextResponse.json({
      message: 'Period end date updated successfully',
      cycle: updatedCycle
    });

  } catch (error) {
    console.error('Error updating cycle:', error);
    return NextResponse.json(
      { error: 'Failed to update cycle' },
      { status: 500 }
    );
  }
}