import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'eur', name, email, branch, message } = body;

    // Validate amount: must be a positive integer (cents), min €1
    const amountInt = Math.round(Number(amount));
    if (!amountInt || amountInt < 100) {
      return NextResponse.json(
        { error: 'Minimum donation amount is €1.00' },
        { status: 400 }
      );
    }
    if (amountInt > 1_000_000_00) {
      return NextResponse.json(
        { error: 'Donation amount exceeds the maximum allowed.' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInt,
      currency,
      receipt_email: email || undefined,
      metadata: {
        donor_name: name || 'Anonymous',
        donor_email: email || '',
        branch: branch || 'general',
        message: message || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Unable to create payment. Please try again.' },
      { status: 500 }
    );
  }
}
