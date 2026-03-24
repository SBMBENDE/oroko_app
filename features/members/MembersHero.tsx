'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Users } from 'lucide-react';

export function MembersHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-tag', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('.hero-heading', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
        .fromTo('.hero-stat', { opacity: 0, scale: 0.88, y: 10 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1,
        }, '-=0.2');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-stone-950 text-white pt-20">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <p className="hero-tag text-amber-400 text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2" style={{ opacity: 0 }}>
          <Users className="w-4 h-4" /> Our People
        </p>
        <h1 className="hero-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-2xl" style={{ opacity: 0 }}>
          OCA-EU <span className="text-amber-400">Members</span>
        </h1>
        <p className="hero-sub text-stone-300 text-lg leading-relaxed max-w-xl mb-10" style={{ opacity: 0 }}>
          An extraordinary community of professionals, entrepreneurs, and
          changemakers united by culture and ambition across Europe.
        </p>
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {[
            { value: '500+', label: 'Active members' },
            { value: '10',   label: 'Branches across Europe' },
            { value: '6+',   label: 'European countries' },
          ].map(({ value, label }) => (
            <div key={label} className="hero-stat flex items-center gap-3" style={{ opacity: 0 }}>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{value}</p>
                <p className="text-xs text-stone-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
