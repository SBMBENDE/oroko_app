'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DonateButton } from '@/components/ui/DonateButton';
import { animateHero } from '@/animations';

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-stone-950 via-stone-900 to-amber-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-0 pb-24 sm:pb-0">
        {/* Overline */}
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-600/20 border border-amber-600/30 px-4 py-1.5 mb-5 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm text-amber-300 font-medium">Oroko Cultural Association-Europe</span>
        </div>

        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6"
          style={{ opacity: 0 }}
        >
          United by Culture.{' '}
          <span className="text-amber-400">Rooted in Africa.</span>
          <br />
          Thriving in Europe.
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed mb-7 sm:mb-10"
          style={{ opacity: 0 }}
        >
          OCA-EU connects the African diaspora across Europe — from Paris to
          Helsinki — through culture, community, and shared ambition.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{ opacity: 0 }}
        >
          <Button size="sm" variant="primary" className="w-full sm:w-auto sm:text-base! sm:px-6! sm:py-3!" asChild>
            <Link href="/branches" className="flex items-center justify-center gap-2">
              Explore Branches <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="w-full sm:w-auto sm:text-base! sm:px-6! sm:py-3! text-white bg-white/10 hover:bg-white/20" asChild>
            <Link href="/about">Learn more about OCA-EU</Link>
          </Button>
          <DonateButton size="sm" variant="outline" label="Donate" className="w-full sm:w-auto sm:text-base! sm:px-6! sm:py-3!" />
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 max-w-sm sm:max-w-none sm:w-fit mx-auto">
          {[
            { value: '800+', label: 'Members' },
            { value: '10', label: 'Branches' },
            { value: '6+', label: 'Countries' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center py-4 px-5 bg-white/5 backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 leading-none">{value}</span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
