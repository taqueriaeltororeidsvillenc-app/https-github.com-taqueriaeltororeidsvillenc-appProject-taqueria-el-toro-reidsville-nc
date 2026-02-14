import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error processing webhook', { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const sessionId = paymentIntent.id;

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      stripe_payment_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_session_id', sessionId);

  if (error) {
    console.error('Error updating order:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentId = charge.payment_intent as string;

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_id', paymentId);

  if (error) {
    console.error('Error updating refund:', error);
  }
}
