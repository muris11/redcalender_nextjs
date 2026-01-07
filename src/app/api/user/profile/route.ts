import { db } from '@/lib/db';
import { requireUserAccess, refreshSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch user profile from database
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

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
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
      theme,
      currentlyMenstruating,
      menstrualStatus
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user can only update their own data
    const auth = await requireUserAccess(id);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Build update data object - only include fields that are provided
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    
    // Handle numeric fields - parse string to int
    if (avgCycleLength !== undefined && avgCycleLength !== "") {
      updateData.avgCycleLength = typeof avgCycleLength === 'string' ? parseInt(avgCycleLength) : avgCycleLength;
    }
    if (avgPeriodLength !== undefined && avgPeriodLength !== "") {
      updateData.avgPeriodLength = typeof avgPeriodLength === 'string' ? parseInt(avgPeriodLength) : avgPeriodLength;
    }
    
    // Handle string fields - only update if value is provided
    if (theme !== undefined && theme !== "") updateData.theme = theme;
    if (currentlyMenstruating !== undefined && currentlyMenstruating !== "") updateData.currentlyMenstruating = currentlyMenstruating;
    if (menstrualStatus !== undefined && menstrualStatus !== "") updateData.menstrualStatus = menstrualStatus;

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

