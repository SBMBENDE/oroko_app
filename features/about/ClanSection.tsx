'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const clans = [
  'Batanga',   
  'Bakoko',
  'Balue',
  'Balondo Ba Nanga',  
  'Balondo Ba Diko',
  'Bima',
  'Ekombe',
  'Mbonge',
  'Ngolo',
  'Bakundu',
];

export function ClanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
          }
        );
      }

      if (pillsRef.current) {
        const pills = pillsRef.current.querySelectorAll<HTMLElement>('[data-clan]');
        gsap.fromTo(
          pills,
          { opacity: 0, y: 30, scale: 0.88 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.4)',
            stagger: 0.16,
            scrollTrigger: { trigger: pillsRef.current, start: 'top 82%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full bg-stone-950 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section title */}
        <div ref={titleRef} className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Identity &amp; Heritage
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            The Ten Oroko Clans
          </h2>
          <p className="text-stone-400 text-base leading-relaxed max-w-xl mx-auto">
            Each clan carries its own dialect, traditions, and territory —
            bound together by a shared Oroko identity that spans generations.
          </p>
        </div>

        {/* Clan pills */}
        <div
          ref={pillsRef}
          className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto"
        >
          {clans.map((clan) => (
            <span
              key={clan}
              data-clan
              className="inline-flex items-center px-6 py-3 rounded-full text-sm md:text-base font-bold text-white shadow-lg cursor-default select-none
                         hover:scale-105 hover:shadow-amber-700/30 hover:shadow-xl transition-transform duration-200"
              style={{
                background: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #92400e 100%)',
              }}
            >
              {clan}
            </span>
          ))}
        </div>

        {/* Decorative footnote */}
        <p className="text-center text-stone-600 text-xs mt-10 tracking-wide">
          Southwest Region, Cameroon · Meme &amp; Ndian Divisions
        </p>
      </div>
    </div>
  );
}
