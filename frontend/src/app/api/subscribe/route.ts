import { NextResponse } from 'next/server';

// Stripe integration for monthly subscriptions
// Requires STRIPE_SECRET_KEY and STRIPE_PRICE_ID env vars

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || ''; // Monthly PRO plan price ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SubscribeRequest {
  email: string;
  plan?: 'monthly' | 'annual';
}

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, plan = 'monthly' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY env var.' }, { status: 503 });
    }

    // Create Stripe Checkout Session
    const sessionRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'customer_email': email,
        'line_items[0][price]': STRIPE_PRICE_ID,
        'line_items[0][quantity]': '1',
        'success_url': `${APP_URL}/dashboard?subscription=success`,
        'cancel_url': `${APP_URL}/pricing?subscription=cancelled`,
        'metadata[plan]': plan,
        'metadata[source]': '100xMoney',
        'allow_promotion_codes': 'true',
        'billing_address_collection': 'auto',
        'subscription_data[trial_period_days]': '7',
      }),
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.json();
      console.error('Stripe error:', err);
      return NextResponse.json(
        { error: 'Failed to create checkout session', detail: err.error?.message },
        { status: 500 }
      );
    }

    const session = await sessionRes.json();
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Check subscription status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
    });
    const session = await res.json();
    return NextResponse.json({
      status: session.status,
      customerEmail: session.customer_email,
      subscriptionId: session.subscription,
      plan: session.metadata?.plan || 'monthly',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
