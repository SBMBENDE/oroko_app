'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Mail, MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { SITE_NAME, SITE_DESCRIPTION, NAV_ITEMS } from '@/lib/constants';
import { branches } from '@/data/branches';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  return submitted ? (
    <div className="flex items-center gap-3 text-green-400 text-sm font-medium">
      <CheckCircle className="w-5 h-5 shrink-0" />
      You&apos;re subscribed! Welcome to the OCA-EU community.
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm rounded-xl transition disabled:opacity-60 whitespace-nowrap cursor-pointer"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-stone-900/40 border-t-stone-900 rounded-full animate-spin" />
        ) : (
          <><ArrowRight className="w-4 h-4" /> Subscribe</>
        )}
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300">

      {/* ── Main footer body — brand + 3 centred columns ─────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Brand row */}
        <div className="mb-10 pb-8 border-b border-stone-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-stone-300 font-medium leading-snug">Oroko Cultural Association-Europe</p>
            <p className="text-sm text-stone-400 leading-relaxed mt-1">{SITE_DESCRIPTION}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-stone-400">
            <a href="mailto:contact@oca-eu.org" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              contact@oca-eu.org
            </a>
            <a href="tel:+33123456789" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              +33 1 23 45 67 89
            </a>
          </div>
        </div>

        {/* 3-column centred grid — Nav+Branches side-by-side on mobile, all 3 on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 text-center">

          {/* Column 1 — Navigation */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-px bg-amber-500 inline-block" />
              Pages
              <span className="w-5 h-px bg-amber-500 inline-block" />
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Branches */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-px bg-amber-500 inline-block" />
              Branches
              <span className="w-5 h-px bg-amber-500 inline-block" />
            </h3>
            <ul className="space-y-3">
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link
                    href={`/branches/${branch.slug}`}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-base leading-none">{branch.flag}</span>
                    <span>{branch.country}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Headquarters */}
          <div className="flex flex-col items-center col-span-2 sm:col-span-1">
            <h3 className="text-white font-bold mb-5 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-px bg-amber-500 inline-block" />
              Headquarters
              <span className="w-5 h-px bg-amber-500 inline-block" />
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-stone-400 mb-5">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed text-left">
                OCA-EU<br />
                75 Rue de la Paix<br />
                75002 Paris, France
              </address>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-stone-400">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href="mailto:secretary@oca-eu.org" className="hover:text-white transition-colors">
                secretary@oca-eu.org
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Newsletter band ─────────────────────────────────────────────────── */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-sm">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">Stay Connected</p>
              <h3 className="text-white text-xl md:text-2xl font-bold leading-snug">
                Get OCA-EU updates in your inbox
              </h3>
              <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                Events, news, and community stories from all six European chapters — straight to you.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <NewsletterForm />
              <p className="text-stone-600 text-xs mt-2.5">
                No spam. Unsubscribe any time. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────────── */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} OCA-EU. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/constitution" className="hover:text-white transition-colors">Our Constitution</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

