'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animateCounter, animateOnScroll } from '@/animations';
import { membersApi, chaptersApi } from '@/lib/api/members.api';

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [stats, setStats] = useState([
    { label: 'Country Branches', value: 0, suffix: '+' },
    { label: 'Active Members', value: 0, suffix: '+' },
    { label: 'Events Per Year', value: 60, suffix: '+' },
    { label: 'Years Active', value: 11, suffix: '' },
  ]);

  // Fetch actual member count
  const { data: membersData } = useQuery({
    queryKey: ['members-count'],
    queryFn: () => membersApi.getDirectory({ limit: '1' }),
    select: (r) => r.data,
  });

  // Fetch actual chapter count
  const { data: chaptersData } = useQuery({
    queryKey: ['chapters-count'],
    queryFn: () => chaptersApi.getAll(),
    select: (r) => r.data.data as { _id: string }[],
  });

  // Update stats when data loads
  useEffect(() => {
    const branchCount = chaptersData?.length ?? 0;
    const memberCount = membersData?.pagination?.total ?? 0;

    setStats([
      { label: 'Country Branches', value: branchCount, suffix: '+' },
      { label: 'Active Members', value: memberCount, suffix: '+' },
      { label: 'Events Per Year', value: 60, suffix: '+' },
      { label: 'Years Active', value: 11, suffix: '' },
    ]);
  }, [membersData, chaptersData]);

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
      if (el && stats[i]) animateCounter(el, stats[i].value, 2);
    });
  }, [stats]);

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
