'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DonateButton } from '@/components/ui/DonateButton';
import { animateHero } from '@/animations';

const TRUST_INITIALS = ['II', 'AA', 'ER', 'TI', 'EA'];

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headlineRef.current || !subtitleRef.current || !ctaRef.current) return;
    const tl = animateHero(headlineRef.current, subtitleRef.current, ctaRef.current);
    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative bg-zinc-950 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Glows */}
      <div className="absolute bottom-0 right-0 w-125 h-125 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-100 h-100 rounded-full bg-amber-900/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32">
        <div className="grid md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_460px] gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="flex flex-col items-start text-left">
            {/* Badge — desktop only (above headline) */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-600/20 border border-amber-600/30 px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider whitespace-nowrap">
                United by Culture · Rooted in Africa · Thriving in Europe
              </span>
            </div>

            <h1
              ref={headlineRef}
              className="text-[2.6rem] sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-4 sm:mb-6"
            >
              OROKO<br />
              <span className="text-amber-400">CULTURAL</span><br />
              <span className="whitespace-nowrap">ASSOCIATION<span className="text-amber-400"> -</span></span>{' '}
              <span className="text-amber-400 whitespace-nowrap">EUROPE</span>
            </h1>

            {/* Badge — mobile only (below headline) */}
            <div className="inline-flex sm:hidden items-center gap-1.5 rounded-full bg-amber-600/20 border border-amber-600/30 px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-[8px] text-amber-300 font-semibold uppercase tracking-wider whitespace-nowrap">
                United by Culture · Rooted in Africa · Thriving in Europe
              </span>
            </div>

            <p
              ref={subtitleRef}
              className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8"
            >
              OCA-EU connects the Oroko diaspora across Europe through culture, community, and shared ambition.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mb-10 w-full md:w-auto">
              <Button size="lg" variant="primary" asChild>
                <Link href="/branches" className="flex items-center gap-2">
                  Explore Branches <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-white! bg-white/10 hover:bg-white/20!" asChild>
                <Link href="/about">Our Mission</Link>
              </Button>
              <DonateButton size="lg" variant="outline" label="Donate" className="sm:hidden" />
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-start gap-4">
              <div className="flex -space-x-2">
                {TRUST_INITIALS.map((initials, i) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full bg-amber-700 border-2 border-zinc-950 flex items-center justify-center text-white text-xs font-bold"
                    style={{ zIndex: 10 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">800+ Active Members</p>
                <p className="text-zinc-500 text-xs">Across 6 European countries</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Floating stat + quote card ── */}
          <div className="hidden md:block">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              {/* Stats 2×2 grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { value: '800+', label: 'Members' },
                  { value: '10',   label: 'Chapters' },
                  { value: '6+',   label: 'Countries' },
                  { value: '15+',  label: 'Events/yr' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-zinc-800/70 rounded-xl p-4 text-center">
                    <span className="text-2xl font-bold text-amber-400 block leading-none">{value}</span>
                    <span className="text-zinc-500 text-xs mt-1.5 uppercase tracking-widest block">{label}</span>
                  </div>
                ))}
              </div>

              {/* President portrait (desktop only) */}
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm">Iya Iye</p>
                    <p className="text-zinc-500 text-xs">President, OCA-EU</p>
                  </div>
                  <span className="text-xs text-amber-400/80 uppercase tracking-widest">Leadership</span>
                </div>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-zinc-700/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/dkd3k6eau/image/upload/v1774338277/copy_of_iya-iye_xiqrap_820f2c.jpg"
                    alt="Iya Iye – President, OCA-EU"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* President portrait (mobile only, after stats) */}
          <div className="block md:hidden mt-8">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">Iya Iye</p>
                  <p className="text-zinc-500 text-xs">President, OCA-EU</p>
                </div>
                <span className="text-xs text-amber-400/80 uppercase tracking-widest">Leadership</span>
              </div>
              <div className="w-full h-72 rounded-xl overflow-hidden border border-zinc-700/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dkd3k6eau/image/upload/v1774338277/copy_of_iya-iye_xiqrap_820f2c.jpg"
                  alt="Iya Iye – President, OCA-EU"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
