'use client';

import { useEffect, useRef } from 'react';
import { animateCounter, animateOnScroll } from '@/animations';

const stats = [
  { label: 'Country Branches', value: 12, suffix: '+' },
  { label: 'Active Members', value: 800, suffix: '+' },
  { label: 'Events Per Year', value: 60, suffix: '+' },
  { label: 'Years Active', value: 11, suffix: '' },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate heading
    const heading = sectionRef.current.querySelector('h2');
    if (heading) animateOnScroll(heading as HTMLElement);

    // Animate stat cards
    const cards = sectionRef.current.querySelectorAll<HTMLElement>('[data-stat]');
    if (cards.length) animateOnScroll(Array.from(cards), { stagger: 0.12 });

    // Animate counters
    counterRefs.current.forEach((el, i) => {
      if (el) animateCounter(el, stats[i].value, 2);
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-amber-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12" style={{ opacity: 0 }}>
          OCA-EU in Numbers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-stat
              className="text-center"
              style={{ opacity: 0 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                {stat.suffix}
              </div>
              <p className="text-amber-100 text-sm font-medium uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
