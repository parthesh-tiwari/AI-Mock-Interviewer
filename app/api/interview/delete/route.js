import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { MockInterview, userAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request) {
  try {
    const { mockId, userEmail } = await request.json();

    if (!mockId || !userEmail) {
      return NextResponse.json(
        { error: 'Mock ID and user email are required' },
        { status: 400 }
      );
    }

    // First, verify that the interview belongs to the user
    const interview = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, mockId))
      .limit(1);

    if (!interview || interview.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    if (interview[0].createdBy !== userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this interview' },
        { status: 403 }
      );
    }

    // Delete related user answers first (foreign key constraint)
    await db.delete(userAnswer)
      .where(eq(userAnswer.mockIdRef, mockId));

    // Delete the mock interview
    await db.delete(MockInterview)
      .where(eq(MockInterview.mockId, mockId));

    return NextResponse.json(
      { message: 'Interview deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 