import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUserAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

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

    let whereClause: any = { userId };

    if (date) {
      whereClause.date = new Date(date);
    }

    const dailyLogs = await db.dailyLog.findMany({
      where: whereClause,
      include: {
        logSymptoms: {
          include: {
            symptom: true
          }
        },
        logMoods: {
          include: {
            mood: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ dailyLogs });

  } catch (error) {
    console.error('Error fetching daily logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      date,
      weight,
      temperature,
      waterIntake,
      sleepHours,
      sexualActivity,
      libido,
      orgasm,
      cervixMucus,
      cervixPosition,
      ovulationTestResult,
      pregnancyTestResult,
      sadariResult,
      notes,
      symptoms,
      moods
    } = await request.json();

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      );
    }

    // Verify user can only create their own logs
    const auth = await requireUserAccess(userId);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Create or update daily log
    const dailyLog = await db.dailyLog.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date)
        }
      },
      update: {
        weight: weight ? parseFloat(weight) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        waterIntake: waterIntake ? parseInt(waterIntake) : null,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        sexualActivity,
        libido,
        orgasm,
        cervixMucus,
        cervixPosition,
        ovulationTestResult,
        pregnancyTestResult,
        sadariResult,
        notes
      },
      create: {
        userId,
        date: new Date(date),
        weight: weight ? parseFloat(weight) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        waterIntake: waterIntake ? parseInt(waterIntake) : null,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        sexualActivity,
        libido,
        orgasm,
        cervixMucus,
        cervixPosition,
        ovulationTestResult,
        pregnancyTestResult,
        sadariResult,
        notes
      }
    });

    // Handle symptoms (many-to-many relationship)
    if (symptoms && symptoms.length > 0) {
      // Delete existing symptoms for this log
      await db.logSymptom.deleteMany({
        where: { dailyLogId: dailyLog.id }
      });

      // Add new symptoms
      for (const symptomName of symptoms) {
        // Find or create symptom
        let symptom = await db.masterSymptom.findUnique({
          where: { name: symptomName }
        });

        if (!symptom) {
          symptom = await db.masterSymptom.create({
            data: {
              name: symptomName,
              category: 'user_input'
            }
          });
        }

        // Create relationship
        await db.logSymptom.create({
          data: {
            dailyLogId: dailyLog.id,
            symptomId: symptom.id
          }
        });
      }
    }

    // Handle moods (many-to-many relationship)
    if (moods && moods.length > 0) {
      // Delete existing moods for this log
      await db.logMood.deleteMany({
        where: { dailyLogId: dailyLog.id }
      });

      // Add new moods
      for (const moodName of moods) {
        // Find or create mood
        let mood = await db.masterMood.findUnique({
          where: { name: moodName }
        });

        if (!mood) {
          mood = await db.masterMood.create({
            data: {
              name: moodName
            }
          });
        }

        // Create relationship
        await db.logMood.create({
          data: {
            dailyLogId: dailyLog.id,
            moodId: mood.id
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Daily log saved successfully',
      dailyLog
    });

  } catch (error) {
    console.error('Error saving daily log:', error);
    return NextResponse.json(
      { error: 'Failed to save daily log' },
      { status: 500 }
    );
  }
}