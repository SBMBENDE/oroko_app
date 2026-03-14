'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Calendar, MapPin, ArrowRight, Timer } from 'lucide-react';
import type { Event } from '@/lib/types';
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
  const { days, hours, minutes, seconds } = useCountdown(date);
  return (
    <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
      <Timer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span className="text-xs text-amber-700 font-medium">Starts in</span>
      <div className="flex items-center gap-1 ml-auto font-mono text-xs font-bold text-stone-800">
        <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(days).padStart(2,'0')}d</span>
        <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(hours).padStart(2,'0')}h</span>
        <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(minutes).padStart(2,'0')}m</span>
        <span className="bg-white border border-stone-200 rounded px-1.5 py-0.5">{String(seconds).padStart(2,'0')}s</span>
      </div>
    </div>
  );
}

const CATEGORY_ACCENT: Record<string, string> = {
  cultural: 'from-purple-600 to-purple-400',
  networking: 'from-blue-600 to-blue-400',
  workshop: 'from-green-600 to-green-400',
  conference: 'from-yellow-600 to-yellow-400',
  social: 'from-pink-600 to-pink-400',
  celebration: 'from-orange-600 to-orange-400',
};

interface EventRevealCardProps {
  event: Event;
  isPast?: boolean;
}

export function EventRevealCard({ event, isPast = false }: EventRevealCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const eventDate = new Date(event.date);
  const day = eventDate.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  const accent = CATEGORY_ACCENT[event.category] ?? 'from-stone-600 to-stone-400';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 900,
    });

    // Move spotlight glow
    gsap.to(glowRef.current, {
      x: x - 80,
      y: y - 80,
      opacity: 0.18,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || !glowRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
    });
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.4,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      data-event-card
      className="relative rounded-2xl overflow-hidden bg-white shadow-md border border-stone-100 flex flex-col h-full cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight glow (follows cursor) */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-40 h-40 rounded-full bg-amber-400 blur-2xl opacity-0 z-10"
      />

      {/* Past overlay */}
      {isPast && (
        <div className="absolute inset-0 bg-white/60 z-20 backdrop-grayscale" />
      )}
      {isPast && (
        <span className="absolute top-3 right-3 z-30 text-xs font-semibold uppercase tracking-widest bg-stone-200 text-stone-500 rounded-full px-2.5 py-0.5">
          Past
        </span>
      )}

      {/* Image */}
      <div className="relative h-40 bg-stone-100 overflow-hidden shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          onError={(e) => {
            const parent = (e.target as HTMLElement).parentElement;
            if (parent) parent.classList.add('bg-linear-to-br', 'from-amber-100', 'to-stone-200');
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Accent bar */}
      <div className={`h-1.5 w-full bg-linear-to-r ${accent} shrink-0`} />

      <div className="flex gap-0 flex-1">
        {/* Date block */}
        <div className="flex flex-col items-center justify-center bg-stone-950 text-white px-4 py-5 shrink-0 min-w-16">
          <span className="text-3xl font-black leading-none tabular-nums">{day}</span>
          <span className={`text-xs font-bold tracking-widest mt-1 bg-linear-to-b ${accent} bg-clip-text text-transparent`}>
            {month}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 min-w-0">
          {/* Category + countdown */}
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${CATEGORY_COLORS[event.category] ?? 'bg-stone-100 text-stone-700'}`}
            >
              {event.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 mb-2">
            {event.title}
          </h3>

          {/* Meta */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 flex-1">
            {event.description}
          </p>

          {!isPast && <CountdownBadge date={event.date} />}

          {/* CTA */}
          {event.registrationLink && !isPast && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors group/link"
            >
              Register now
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
