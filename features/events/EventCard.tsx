'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Timer } from 'lucide-react';
import type { Event } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);
  return time;
}

function CountdownBadge({ date }: { date: string }) {
  const [mounted, setMounted] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(date);
  useEffect(() => { Promise.resolve().then(() => setMounted(true)); }, []);
  return (
    <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
      <Timer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span className="text-xs text-amber-700 font-medium">Starts in</span>
      <div className="flex items-center gap-1 ml-auto font-mono text-xs font-bold text-stone-800">
        {mounted ? (
          <>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(days).padStart(2,'0')}d</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(hours).padStart(2,'0')}h</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(minutes).padStart(2,'0')}m</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(seconds).padStart(2,'0')}s</span>
          </>
        ) : (
          <>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">--d</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">--h</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">--m</span>
            <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">--s</span>
          </>
        )}
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card data-card className="h-full group">
      {/* Image */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const parent = (e.target as HTMLElement).parentElement;
            if (parent) parent.classList.add('bg-gradient-to-br', 'from-amber-100', 'to-stone-200');
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${CATEGORY_COLORS[event.category] ?? 'bg-stone-100 text-stone-700'}`}
          >
            {event.category}
          </span>
        </div>
      </div>

      <CardContent>
        <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-start gap-1.5 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-stone-500 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {<CountdownBadge date={event.date} />}

        {event.registrationLink && (
          <a
            href={event.registrationLink}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors group/link"
          >
            Register now
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
