import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';
import { sendEmail, getPaymentConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const classId = session.metadata?.classId;
    const scheduleId = session.metadata?.scheduleId;
    const paymentId = session.metadata?.paymentId;

    if (!userId || !classId || !scheduleId || !paymentId) {
      console.error('Missing metadata in webhook event');
      return NextResponse.json({ received: true });
    }

    try {
      // Update payment status
      await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          payment_intent_id: session.payment_intent as string,
        })
        .eq('id', paymentId);

      // Create enrollment
      const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          class_id: classId,
          schedule_id: scheduleId,
          payment_id: paymentId,
          status: 'confirmed',
        })
        .select()
        .single();

      if (enrollError) {
        console.error('Failed to create enrollment:', enrollError);
        // Don't fail the webhook, but log the error
      }

      // Get user and class details for email
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      const { data: classData } = await supabase
        .from('classes')
        .select('title, price, meeting_link')
        .eq('id', classId)
        .single();

      const { data: schedule } = await supabase
        .from('class_schedules')
        .select('start_date, start_time, end_time')
        .eq('id', scheduleId)
        .single();

      // Send confirmation email
      if (user && classData && schedule && user.email) {
        const emailHtml = getPaymentConfirmationEmail(
          user.full_name || user.email.split('@')[0],
          classData.title,
          new Date(schedule.start_date).toLocaleDateString(),
          new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          classData.meeting_link,
          parseFloat(classData.price)
        );

        await sendEmail({
          to: user.email,
          subject: `Enrollment Confirmed: ${classData.title}`,
          html: emailHtml,
        });
      }
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      // Return success to Stripe to prevent retries, but log the error
    }
  }

  return NextResponse.json({ received: true });
}

