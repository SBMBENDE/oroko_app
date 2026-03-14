'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ExecutiveCard, ExecutiveFeaturedCard, sortExecutives } from './ExecutiveCard';
import type { Member } from '@/lib/types';

interface ExecutivesSectionProps {
  members: Member[];
}

export function ExecutivesSection({ members }: ExecutivesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Sort: President → VP → Secretary General → Financial Sec → Secretary → Treasurer
  const sorted = sortExecutives(members);
  const [featured, ...rest] = sorted;

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 },
      );

      // Featured card slides in from left
      const featuredEl = sectionRef.current!.querySelector('[data-exec-featured]');
      if (featuredEl) {
        gsap.set(featuredEl, { opacity: 0, x: -40 });
        gsap.to(featuredEl, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 });
      }

      // Grid cards stagger up
      const cards = sectionRef.current!.querySelectorAll('[data-exec-card]');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 44, scale: 0.93 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, stagger: 0.09, ease: 'power3.out', delay: 0.4,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Heading */}
      <div ref={headingRef} className="mb-10" style={{ opacity: 0 }}>
        <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">Leadership</p>
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Executive Board</h2>
        <p className="mt-2 text-stone-500 text-lg max-w-xl">
          The elected officials of the OCA-EU mother association — the central governing body of all European chapters.
        </p>
      </div>

      {/* Featured president */}
      {featured && (
        <div data-exec-featured className="mb-10">
          <ExecutiveFeaturedCard member={featured} />
        </div>
      )}

      {/* Divider label */}
      {rest.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">
            Vice Presidents &amp; Officers
          </span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>
      )}

      {/* Rest of the board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rest.map((member) => (
          <ExecutiveCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
