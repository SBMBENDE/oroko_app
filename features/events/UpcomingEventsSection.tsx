'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/features/events/EventCard';
import type { Event } from '@/lib/types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function UpcomingEventsSection({ events }: { events: Event[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    ).fromTo(
      cardsRef.current ? Array.from(cardsRef.current.children) : [],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.12 },
      '-=0.4'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-zinc-950" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headingRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
              Upcoming Events
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Discover Upcoming Okoro Events
            </h2>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-zinc-700! text-zinc-300! hover:bg-zinc-800! hover:text-white! shrink-0 self-start sm:self-auto"
          >
            <Link href="/events" className="flex items-center gap-2">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
