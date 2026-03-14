import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Section } from '@/components/ui/Section';
import { DonationForm } from '@/features/donate/DonationForm';
import { Heart, Shield, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Donate — OCA-EU',
  description:
    'Support OCA-EU and help fund scholarships, cultural programmes, and community initiatives across Europe.',
};

const impactItems = [
  { icon: Users, label: '€25', desc: 'Funds a youth workshop' },
  { icon: Heart, label: '€50', desc: 'Supports one mentee for a month' },
  { icon: Globe, label: '€100', desc: 'Co-funds a cultural event' },
];

export default function DonatePage() {
  return (
    <main className="pt-20 min-h-screen bg-stone-950">
      {/* Hero */}
      <Section tight className="text-white">
        <div className="max-w-2xl py-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-600/20 border border-amber-500/30 px-4 py-1.5 mb-5">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="text-sm text-amber-300 font-medium">Support OCA-EU</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Fuel the Future of Our{' '}
            <span className="text-amber-400">Community</span>
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Every donation — large or small — helps us run scholarships, cultural
            festivals, mentorship programmes, and advocacy work across Europe. Thank you.
          </p>
        </div>
      </Section>

      {/* Impact row */}
      <div className="bg-amber-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-amber-500">
            {impactItems.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center justify-center gap-2 py-5 px-4 text-white text-center sm:text-left">
                <Icon className="w-5 h-5 text-amber-100 shrink-0" />
                <div>
                  <p className="font-bold text-lg leading-none">{label}</p>
                  <p className="text-xs text-amber-100 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + trust signals */}
      <div className="bg-stone-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Form (takes 2 cols) */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div className="h-96 rounded-3xl bg-white animate-pulse" />}>
                <DonationForm />
              </Suspense>
            </div>

            {/* Trust sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-stone-900 text-sm">Secure & Trusted</h3>
                </div>
                <ul className="space-y-2 text-sm text-stone-500">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    Payments via Stripe or PayPal — never stored on our servers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    GDPR-compliant data handling
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <h3 className="font-bold text-stone-900 text-sm mb-2">Where does it go?</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Education & Scholarships', pct: 35 },
                    { label: 'Cultural Programmes', pct: 25 },
                    { label: 'Mentorship & Careers', pct: 20 },
                    { label: 'Advocacy & Welfare', pct: 20 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-stone-500 mb-1">
                        <span>{label}</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-900 rounded-2xl p-5 text-white">
                <p className="text-sm leading-relaxed text-stone-300 italic">
                  &quot;The OROKO scholarship changed everything for my daughter. We are
                  forever grateful to everyone who gives.&quot;
                </p>
                <p className="mt-3 text-xs font-semibold text-amber-400">— Sylvie K., OROKO France member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
