
'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import { animateHero } from '@/animations';

const TRUST_INITIALS = ['II', 'AA', 'ER', 'TI', 'EA'];

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headlineRef.current && subtitleRef.current && ctaRef.current) {
      animateHero(headlineRef.current, subtitleRef.current, ctaRef.current);
    }
  }, []);

  return (
    <section className="relative isolate overflow-hidden min-h-150">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458728/WhatsApp_Image_2026-03-13_at_20.53.00_1_xwpfzr.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          filter: 'brightness(0.7) saturate(1.1)',
          pointerEvents: 'none',
        }}
      />
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Glows */}
      <div className="absolute bottom-0 right-0 w-125 h-125 rounded-full bg-amber-600/10 blur-3xl pointer-events-none z-20" />
      <div className="absolute top-0 left-0 w-100 h-100 rounded-full bg-amber-900/15 blur-3xl pointer-events-none z-20" />

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
              className={cn(
                "font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 sm:mb-10 md:mb-12",
                "leading-tight sm:leading-tight md:leading-tight",
                "[text-shadow:0_2px_16px_rgba(0,0,0,0.18)]",
                "flex flex-col justify-center items-center text-center sm:text-left sm:items-start sm:justify-start sm:flex-none"
              )}
            >
              {/* Mobile: stacked, perfectly centered */}
              <span className="block sm:hidden">
                <span className="flex flex-col items-start justify-start">
                  <span className="text-left">OROKO</span>
                  <span className="text-left text-amber-400">CULTURAL</span>
                  <span className="text-left">ASSOCIATION</span>
                  <span className="text-left text-amber-400">EUROPE</span>
                </span>
              </span>
              {/* Desktop: premium two-line look */}
              <span className="hidden sm:inline">
                <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  OROKO&nbsp;<span className="text-amber-400">CULTURAL</span>
                </span><br />
                <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  ASSOCIATION&nbsp;<span className="text-amber-400">EUROPE</span>
                </span>
              </span>
            </h1>

            {/* Our Mission link above subtitle on all screens */}
            <div className="mb-3 w-full">
              <Link href="/about" className="text-amber-400 font-semibold text-base hover:underline focus:underline transition-all">
                Our Mission
              </Link>
            </div>


            <p
              ref={subtitleRef}
              className="text-zinc-400 text-sm sm:text-lg max-w-xs sm:max-w-xl leading-snug sm:leading-relaxed mb-2 sm:mb-8 whitespace-nowrap sm:whitespace-normal"
            >
              Connecting Oroko communities across Europe.
            </p>


            {/* CTA buttons - spacing tweaked for premium look */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-8 sm:mb-10 w-full md:w-auto">
              <Button size="lg" variant="primary" asChild>
                <Link href="/branches" className="flex items-center gap-2">
                  Explore Branches <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
              {/* Outlined Donate button on mobile only */}
              <Button
                size="sm"
                variant="outline"
                asChild
                className="sm:hidden border-amber-400 text-amber-400 font-semibold mt-1"
              >
                <Link href="/donate">Donate</Link>
              </Button>
              {/* Removed old Donate text link on mobile */}
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
                <p className="text-white font-semibold text-sm">500+ Active Members</p>
                <p className="text-zinc-500 text-xs">Across 6 European countries</p>
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
