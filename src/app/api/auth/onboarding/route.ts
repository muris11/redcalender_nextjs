import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      birthDate,
      menstrualStatus,
      lastPeriodDate,
      periodDuration,
      cycleLength,
      commonSymptoms,
      severity,
      exerciseFrequency,
      stressLevel,
      sleepQuality,
      diet
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user with onboarding data
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        birthDate: birthDate ? new Date(birthDate) : null,
        menstrualStatus,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : null,
        avgPeriodLength: periodDuration ? parseInt(periodDuration) : 6,
        avgCycleLength: cycleLength ? parseInt(cycleLength) : 28,
        isOnboarded: true,
        updatedAt: new Date()
      }
    });

    // Create initial cycle if last period date is provided
    if (lastPeriodDate && periodDuration) {
      const startDate = new Date(lastPeriodDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(periodDuration));

      // Check if cycle already exists for this period
      const existingCycle = await db.cycle.findFirst({
        where: {
          userId,
          startDate: {
            gte: new Date(startDate.getFullYear(), startDate.getMonth(), 1)
          }
        }
      });

      if (!existingCycle) {
        await db.cycle.create({
          data: {
            userId,
            startDate,
            endDate,
            isAbnormal: menstrualStatus === 'irregular' || menstrualStatus === 'pms'
          }
        });
      }
    }

    // Store onboarding data for analysis (you might want to create a separate table for this)
    // For now, we'll just acknowledge the data was received

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}