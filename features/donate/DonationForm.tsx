'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Heart, CreditCard, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PRESET_AMOUNTS = [10, 25, 50, 100];

const BRANCHES = [
  { slug: '', label: 'General Fund (all branches)' },
  { slug: 'france', label: '🇫🇷 OCA France – Paris' },
  { slug: 'belgium-brussels', label: '🇧🇪 OCA Belgium – Brussels' },
  { slug: 'belgium-liege', label: '🇧🇪 OCA Belgium – Liège' },
  { slug: 'uk-london', label: '🇬🇧 OCA UK – London' },
  { slug: 'uk-manchester', label: '🇬🇧 OCA UK – Manchester' },
  { slug: 'finland', label: '🇫🇮 OCA Finland – Helsinki' },
  { slug: 'ireland', label: '🇮🇪 OCA Ireland – Dublin' },
  { slug: 'germany-berlin', label: '🇩🇪 OCA Germany – Berlin' },
  { slug: 'germany-hamburg', label: '🇩🇪 OCA Germany – Hamburg' },
  { slug: 'germany-munich', label: '🇩🇪 OCA Germany – Munich' },
];

// ── Stripe checkout sub-form ──────────────────────────────────────────────────
function StripeCheckoutForm({
  onSuccess,
  amount,
}: {
  onSuccess: () => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Payment failed.');
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.');
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className="w-4 h-4 fill-current" />
        )}
        {loading ? 'Processing…' : `Donate €${amount}`}
      </button>
    </form>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export function DonationForm() {
  const searchParams = useSearchParams();
  const defaultBranch = searchParams.get('branch') ?? '';

  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [provider, setProvider] = useState<'stripe' | 'paypal'>('stripe');
  const [step, setStep] = useState<'amount' | 'details' | 'payment'>('amount');
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    branch: defaultBranch,
    message: '',
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const amountRowRef = useRef<HTMLDivElement>(null);

  // Animate card in
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' }
    );
  }, []);

  // Animate amount buttons in
  useEffect(() => {
    if (!amountRowRef.current) return;
    const btns = amountRowRef.current.querySelectorAll('[data-amount-btn]');
    gsap.fromTo(
      btns,
      { opacity: 0, scale: 0.85, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.5)' }
    );
  }, []);

  const donationAmount = isCustom
    ? Math.round(parseFloat(customAmount) * 100) || 0
    : (selectedAmount ?? 0) * 100;

  const amountEuros = donationAmount / 100;

  const handleAmountSelect = useCallback(
    (amount: number, btn: HTMLButtonElement) => {
      setIsCustom(false);
      setSelectedAmount(amount);
      gsap.fromTo(
        btn,
        { scale: 0.9 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      );
    },
    []
  );

  const handleNextToDetails = useCallback(() => {
    if (donationAmount < 100) return;
    gsap.to(cardRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setStep('details');
        gsap.fromTo(
          cardRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
  }, [donationAmount]);

  const handleNextToPayment = useCallback(async () => {
    if (!form.name || !form.email) return;
    setLoadingIntent(true);
    setIntentError('');
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          name: form.name,
          email: form.email,
          branch: form.branch,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Server error');
      setClientSecret(data.clientSecret);
      gsap.to(cardRef.current, {
        x: -20, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          setStep('payment');
          gsap.fromTo(cardRef.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
        },
      });
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoadingIntent(false);
    }
  }, [form, donationAmount]);

  const handleBack = useCallback(() => {
    gsap.to(cardRef.current, {
      x: 20, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setStep((s) => (s === 'payment' ? 'details' : 'amount'));
        gsap.fromTo(cardRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      },
    });
  }, []);

  return (
    <div ref={cardRef} className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-stone-100">
        <div
          className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-500"
          style={{ width: step === 'amount' ? '33%' : step === 'details' ? '66%' : '100%' }}
        />
      </div>

      <div className="p-6 sm:p-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {(['amount', 'details', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  step === s
                    ? 'bg-amber-600 text-white'
                    : i < ['amount', 'details', 'payment'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-stone-100 text-stone-400'
                )}
              >
                {i < ['amount', 'details', 'payment'].indexOf(step) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={cn('text-xs font-medium capitalize hidden sm:block',
                step === s ? 'text-stone-900' : 'text-stone-400'
              )}>
                {s}
              </span>
              {i < 2 && <ChevronRight className="w-3 h-3 text-stone-300" />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Choose amount ── */}
        {step === 'amount' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Choose an amount</h2>
              <p className="text-stone-500 text-sm">Your donation supports OCA-EU&apos;s programmes across Europe.</p>
            </div>

            <div ref={amountRowRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  data-amount-btn
                  onClick={(e) => handleAmountSelect(amount, e.currentTarget)}
                  className={cn(
                    'rounded-2xl py-4 font-bold text-lg border-2 transition-all duration-200',
                    !isCustom && selectedAmount === amount
                      ? 'bg-amber-600 border-amber-600 text-white shadow-lg scale-105'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-amber-400 hover:text-amber-700'
                  )}
                >
                  €{amount}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all duration-200',
                isCustom ? 'border-amber-500 bg-amber-50' : 'border-stone-200'
              )}
              onClick={() => setIsCustom(true)}
            >
              <span className="text-stone-400 font-semibold text-lg">€</span>
              <input
                type="number"
                min="1"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setIsCustom(true);
                  setSelectedAmount(null);
                }}
                className="flex-1 bg-transparent outline-none text-stone-900 font-semibold text-lg placeholder:text-stone-300 placeholder:font-normal"
              />
            </div>

            {donationAmount > 0 && (
              <p className="text-sm text-stone-500 text-center">
                You&apos;re donating <span className="font-bold text-amber-700">€{amountEuros.toFixed(2)}</span>
              </p>
            )}

            <button
              onClick={handleNextToPayment === handleNextToDetails ? undefined : handleNextToDetails}
              disabled={donationAmount < 100}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors"
              aria-label="Continue to donor details"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step 2: Donor details ── */}
        {step === 'details' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Your details</h2>
              <p className="text-stone-500 text-sm">Donating <span className="font-semibold text-amber-700">€{amountEuros.toFixed(2)}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jean-Pierre Mbeki"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="France"
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Branch to Support
                </label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition bg-white"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Message <span className="text-stone-300 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="A note for the OCA-EU team…"
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none"
                />
              </div>
            </div>

            {/* Payment provider selector */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Pay with</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('stripe')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border-2 py-3 font-semibold text-sm transition-all',
                    provider === 'stripe'
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  )}
                >
                  <CreditCard className="w-4 h-4" />
                  Card / Stripe
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('paypal')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border-2 py-3 font-semibold text-sm transition-all',
                    provider === 'paypal'
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  )}
                >
                  <svg className="w-16 h-4" viewBox="0 0 100 24" fill="none" aria-label="PayPal">
                    <text y="18" fontSize="18" fontWeight="bold" fill="#003087">Pay</text>
                    <text x="34" y="18" fontSize="18" fontWeight="bold" fill="#009cde">Pal</text>
                  </svg>
                </button>
              </div>
            </div>

            {intentError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {intentError}
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={handleBack} className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                Back
              </button>
              <button
                onClick={provider === 'stripe' ? handleNextToPayment : () => setStep('payment')}
                disabled={!form.name || !form.email || loadingIntent}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
              >
                {loadingIntent ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loadingIntent ? 'Preparing…' : 'Continue to Payment'}
                {!loadingIntent && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Payment ── */}
        {step === 'payment' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Pay securely</h2>
              <p className="text-stone-500 text-sm">
                Donating <span className="font-semibold text-amber-700">€{amountEuros.toFixed(2)}</span>
                {form.branch ? ` to OROKO ${form.branch.charAt(0).toUpperCase() + form.branch.slice(1)}` : ' to the General Fund'}
              </p>
            </div>

            {provider === 'stripe' && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#d97706',
                      borderRadius: '12px',
                      fontFamily: 'inherit',
                    },
                  },
                }}
              >
                <StripeCheckoutForm
                  amount={amountEuros}
                  onSuccess={() => {
                    window.location.href = '/donate/success';
                  }}
                />
              </Elements>
            )}

            {provider === 'paypal' && (
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: 'EUR',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'pill', label: 'donate' }}
                  createOrder={(_data, actions) =>
                    actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: { value: amountEuros.toFixed(2), currency_code: 'EUR' },
                          description: `OCA-EU donation${form.branch ? ` — ${form.branch}` : ''}`,
                        },
                      ],
                    })
                  }
                  onApprove={async (_data, actions) => {
                    await actions.order?.capture();
                    window.location.href = '/donate/success';
                  }}
                />
              </PayPalScriptProvider>
            )}

            <button onClick={handleBack} className="w-full rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-stone-500 hover:bg-stone-50 transition-colors">
              ← Back
            </button>

            <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Payments are encrypted and processed securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
