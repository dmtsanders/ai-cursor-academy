import { NextRequest, NextResponse } from 'next/server';
import { stripe, getStripePublishableKey } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { classId, scheduleId, userId } = body;

    if (!classId || !scheduleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get class details
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        class_id: classId,
        amount: classData.price,
        currency: 'USD',
        payment_method: 'stripe',
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: classData.title,
              description: classData.description,
            },
            unit_amount: Math.round(classData.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/classes`,
      metadata: {
        userId,
        classId,
        scheduleId,
        paymentId: payment.id,
      },
    });

    // Update payment with session ID
    await supabase
      .from('payments')
      .update({ payment_intent_id: session.id })
      .eq('id', payment.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}

