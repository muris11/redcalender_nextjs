import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Seed symptoms
    const symptoms = [
      { name: 'Sakit punggung', category: 'pain' },
      { name: 'Sakit kepala', category: 'pain' },
      { name: 'Kram otot', category: 'pain' },
      { name: 'Nyeri panggul', category: 'pain' },
      { name: 'Sensitif payudara', category: 'pain' },
      { name: 'Jerawatan', category: 'skin' },
      { name: 'Kelelahan', category: 'physical' },
      { name: 'Bercak darah', category: 'physical' }
    ];

    for (const symptom of symptoms) {
      await db.masterSymptom.upsert({
        where: { name: symptom.name },
        update: {},
        create: symptom
      });
    }

    // Seed moods
    const moods = [
      { name: 'Riang' },
      { name: 'Jatuh cinta' },
      { name: 'Pemarah' },
      { name: 'Lelah' },
      { name: 'Berduka' },
      { name: 'Depresi' },
      { name: 'Emosional' },
      { name: 'Cemas' }
    ];

    for (const mood of moods) {
      await db.masterMood.upsert({
        where: { name: mood.name },
        update: {},
        create: mood
      });
    }

    return NextResponse.json({
      message: 'Seed data created successfully',
      symptoms: symptoms.length,
      moods: moods.length
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}