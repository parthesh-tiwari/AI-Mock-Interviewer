import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { PaidUser } from '@/utils/schema';
import moment from 'moment';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { userEmail, paymentId, amount } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Check if user is already marked as paid
    const existingPayment = await db.select()
      .from(PaidUser)
      .where(eq(PaidUser.userEmail, userEmail))
      .limit(1);

    if (existingPayment && existingPayment.length > 0) {
      return NextResponse.json(
        { message: 'User already marked as paid' },
        { status: 200 }
      );
    }

    // Insert new paid user record
    await db.insert(PaidUser).values({
      userEmail: userEmail,
      paidAt: moment().format('DD-MM-yyyy HH:mm:ss')
    });

    return NextResponse.json(
      { message: 'Payment recorded successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
