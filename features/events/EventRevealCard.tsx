'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Calendar, MapPin, X, Timer, ExternalLink } from 'lucide-react';
import type { Event } from '@/lib/types';
import { formatDate } from '@/lib/utils';

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string, active: boolean) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  }, [targetDate]);

  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!active) return;
    const init = setTimeout(() => setTime(calc()), 0);
    const id = setInterval(() => setTime(calc()), 1000);
    return () => { clearTimeout(init); clearInterval(id); };
  }, [active, calc]);

  return time;
}

// ─── Category theme maps ──────────────────────────────────────────────────────

const CAT_GRADIENT: Record<string, string> = {
  cultural:    'from-purple-950/95',
  networking:  'from-blue-950/95',
  workshop:    'from-green-950/95',
  conference:  'from-amber-950/95',
  social:      'from-pink-950/95',
  celebration: 'from-orange-950/95',
};

const CAT_BADGE: Record<string, string> = {
  cultural:    'bg-purple-500/20 text-purple-200 border border-purple-400/30',
  networking:  'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  workshop:    'bg-green-500/20 text-green-200 border border-green-400/30',
  conference:  'bg-amber-500/20 text-amber-200 border border-amber-400/30',
  social:      'bg-pink-500/20 text-pink-200 border border-pink-400/30',
  celebration: 'bg-orange-500/20 text-orange-200 border border-orange-400/30',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const detailsRef  = useRef<HTMLDivElement>(null);
  const closeRef    = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const isExpired = new Date(event.date) < new Date();
  const time      = useCountdown(event.date, mounted && !isExpired);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = 'hidden';

    const kids = detailsRef.current ? Array.from(detailsRef.current.children) : [];
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 }
      )
      .fromTo(panelRef.current,
        { opacity: 0, y: 60, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55 },
        '-=0.2'
      )
      .fromTo(closeRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.3 },
        '-=0.35'
      )
      .fromTo(kids,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
        '-=0.25'
      );

    return () => {
      document.body.style.overflow = '';
      tl.kill();
    };
  }, [mounted]);

  const close = useCallback(() => {
    const kids = detailsRef.current ? Array.from(detailsRef.current.children) : [];
    gsap.timeline({ onComplete: onClose, defaults: { ease: 'power3.in' } })
      .to(kids,                { opacity: 0, y: 14, duration: 0.2, stagger: 0.04 })
      .to(panelRef.current,    { opacity: 0, y: 40, scale: 0.94, duration: 0.35 }, '-=0.1')
      .to(backdropRef.current, { opacity: 0, duration: 0.25 }, '-=0.2');
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  if (!mounted) return null;

  const gradient = CAT_GRADIENT[event.category] ?? 'from-zinc-950/95';
  const badgeCls = CAT_BADGE[event.category]    ?? 'bg-zinc-500/20 text-zinc-200 border border-zinc-400/30';

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        className="relative z-10 w-full sm:max-w-xl md:max-w-2xl bg-zinc-900 sm:rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60 max-h-[96vh] flex flex-col"
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image */}
        <div className="relative w-full h-52 sm:h-64 md:h-72 shrink-0 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className={`absolute inset-0 bg-linear-to-t ${gradient} via-black/20 to-transparent`} />
          <div className="absolute bottom-4 left-4">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm ${badgeCls}`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto grow">
          <div ref={detailsRef} className="p-5 sm:p-7 space-y-5">

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {event.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-px" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* Description */}
            <p className="text-zinc-300 text-sm leading-relaxed">{event.description}</p>

            {/* Countdown */}
            {!isExpired && time && (
              <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-4">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" /> Starts in
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: time.days,    unit: 'Days' },
                    { val: time.hours,   unit: 'Hrs'  },
                    { val: time.minutes, unit: 'Mins' },
                    { val: time.seconds, unit: 'Secs' },
                  ].map(({ val, unit }) => (
                    <div key={unit} className="bg-zinc-700/60 rounded-lg py-3 text-center">
                      <span className="block text-2xl font-bold text-white font-mono tabular-nums leading-none">
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className="block text-zinc-500 text-[10px] mt-1 uppercase tracking-wider">
                        {unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {event.registrationLink && !isExpired && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-sm py-3.5 rounded-xl transition-colors"
              >
                Register Now <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface EventRevealCardProps {
  event: Event;
  isPast?: boolean;
}

export function EventRevealCard({ event, isPast = false }: EventRevealCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    gsap.to(imgWrapRef.current, { scale: 1.07, duration: 0.7, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1,  duration: 0.4, ease: 'power2.out' });
    gsap.to(infoRef.current,    { y: -10,       duration: 0.5, ease: 'power3.out' });
    gsap.to(cardRef.current,    {
      y: -5,
      boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(imgWrapRef.current, { scale: 1,      duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0.45,  duration: 0.5, ease: 'power2.out' });
    gsap.to(infoRef.current,    { y: 0,            duration: 0.5, ease: 'power3.out' });
    gsap.to(cardRef.current,    {
      y: 0,
      boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  const day      = new Date(event.date).toLocaleDateString('en-GB', { day:   '2-digit' });
  const mon      = new Date(event.date).toLocaleDateString('en-GB', { month: 'short'   });
  const gradient = CAT_GRADIENT[event.category] ?? 'from-zinc-950/95';
  const badgeCls = CAT_BADGE[event.category]    ?? 'bg-zinc-500/20 text-zinc-200 border border-zinc-400/30';

  return (
    <>
      <div
        ref={cardRef}
        data-event-card
        className="relative rounded-2xl overflow-hidden cursor-pointer select-none bg-zinc-800"
        style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)' }}
        onClick={() => setModalOpen(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        aria-label={`View details for ${event.title}`}
        aria-haspopup="dialog"
      >
        {/* Portrait image fill */}
        <div className="relative aspect-2/3 sm:aspect-3/4 overflow-hidden">

          {/* Image wrapper scaled independently on hover */}
          <div ref={imgWrapRef} className="absolute inset-0">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Gradient overlay */}
          <div
            ref={overlayRef}
            className={`absolute inset-0 bg-linear-to-t ${gradient} via-black/25 to-transparent pointer-events-none`}
            style={{ opacity: 0.45 }}
          />

          {/* Date chip */}
          <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 text-center min-w-11">
            <span className="block text-white font-black text-lg leading-none tabular-nums">{day}</span>
            <span className="block text-amber-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{mon}</span>
          </div>

          {/* Past badge */}
          {isPast && (
            <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 border border-zinc-700/50">
              Past
            </div>
          )}

          {/* Bottom info panel slides up on hover */}
          <div
            ref={infoRef}
            className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/95 via-black/55 to-transparent"
          >
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm ${badgeCls}`}>
              {event.category}
            </span>

            <h3 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 mb-1.5">
              {event.title}
            </h3>

            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2.5">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <p className="text-zinc-600 text-[10px] flex items-center gap-1.5">
              <span className="w-4 h-px bg-zinc-600 inline-block" />
              Tap to view details
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <EventModal event={event} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
