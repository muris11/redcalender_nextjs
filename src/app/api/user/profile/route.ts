import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      phone, 
      birthDate, 
      avgCycleLength, 
      avgPeriodLength, 
      theme 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name,
        phone,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        avgCycleLength: avgCycleLength ? parseInt(avgCycleLength) : undefined,
        avgPeriodLength: avgPeriodLength ? parseInt(avgPeriodLength) : undefined,
        theme
      }
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
