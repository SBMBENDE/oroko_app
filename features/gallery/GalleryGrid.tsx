'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

// ─── Branch → display label ───────────────────────────────────────────────────
const BRANCH_LABELS: Record<string, string> = {
  france:       'France',
  'uk-london':  'UK · London',
  'uk-coventry':'UK · Coventry',
  belgium:      'Belgium',
  finland:      'Finland',
  italy:        'Italy',
  germany:      'Germany',
  all:          'Pan-European',
};

// ─── Lightbox modal ───────────────────────────────────────────────────────────

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  originRect: DOMRect | null;
  onClose: () => void;
  onNav: (i: number) => void;
}

function Lightbox({ items, index, originRect, onClose, onNav }: LightboxProps) {
  const backdropRef  = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLDivElement>(null);
  const captionRef   = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const slideDir     = useRef<1 | -1>(1);
  const [mounted, setMounted] = useState(false);

  const item = items[index];

  // Mount flag for portal
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Open animation
  useLayoutEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      // Backdrop
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power3.out' }
      );

      // Image panel: fly from card rect → center
      if (originRect && panelRef.current) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetW = Math.min(vw * 0.9, 960);
        const targetH = Math.min(vh * 0.82, 680);
        const targetX = (vw - targetW) / 2;
        const targetY = (vh - targetH) / 2;

        gsap.fromTo(panelRef.current, {
          x:      originRect.left,
          y:      originRect.top,
          width:  originRect.width,
          height: originRect.height,
          borderRadius: 16,
          opacity: 0.7,
        }, {
          x: targetX,
          y: targetY,
          width:  targetW,
          height: targetH,
          borderRadius: 20,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
        });
      } else {
        gsap.fromTo(panelRef.current,
          { opacity: 0, scale: 0.92, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' }
        );
      }

      // Caption + nav slide up
      gsap.fromTo([captionRef.current, navRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08, delay: 0.45 }
      );
    });

    return () => { ctx.revert(); document.body.style.overflow = ''; };
  }, [mounted, originRect]);

  // Close with reverse animation
  const close = useCallback(() => {
    gsap.timeline({ onComplete: onClose })
      .to([captionRef.current, navRef.current], { opacity: 0, y: 10, duration: 0.2, stagger: 0.04 })
      .to(panelRef.current,    { opacity: 0, scale: 0.9, y: 30, duration: 0.35, ease: 'power3.in' }, '-=0.15')
      .to(backdropRef.current, { opacity: 0, duration: 0.25 }, '-=0.2');
  }, [onClose]);

  // Navigate between images with slide
  const navigate = useCallback((dir: 1 | -1) => {
    const next = (index + dir + items.length) % items.length;
    slideDir.current = dir;

    gsap.to(imgRef.current, {
      x: dir * -60,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        onNav(next);
        gsap.fromTo(imgRef.current,
          { x: dir * 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
  }, [index, items.length, onNav]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowRight')  navigate(1);
      if (e.key === 'ArrowLeft')   navigate(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close, navigate]);

  if (!mounted) return null;

  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return createPortal(
    <div className="fixed inset-0 overflow-hidden z-9999" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/90 backdrop-blur-lg"
        onClick={close}
      />

      {/* Floating panel — positioned absolutely via GSAP */}
      <div
        ref={panelRef}
        className="absolute overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-700/40"
        style={{ willChange: 'transform, opacity, width, height' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div ref={imgRef} className="w-full h-full relative">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 960px"
            priority
          />
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/90 to-transparent pointer-events-none" />

          {/* Close */}
          <button
            onClick={close}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs text-white/70 font-mono">
            {index + 1} / {items.length}
          </div>

          {/* Caption */}
          <div ref={captionRef} className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">
              {BRANCH_LABELS[item.branchSlug] ?? item.branchSlug}
            </p>
            <p className="text-white font-semibold text-sm sm:text-base leading-snug">
              {item.alt}
            </p>
            {item.caption && (
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div ref={navRef} className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-3 sm:px-6 pointer-events-none z-10">
        <button
          onClick={() => navigate(-1)}
          disabled={!hasPrev}
          aria-label="Previous image"
          className={`pointer-events-auto w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-200
            ${hasPrev ? 'hover:bg-white/10 hover:scale-110 active:scale-95' : 'opacity-20 cursor-default'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate(1)}
          disabled={!hasNext}
          aria-label="Next image"
          className={`pointer-events-auto w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-200
            ${hasNext ? 'hover:bg-white/10 hover:scale-110 active:scale-95' : 'opacity-20 cursor-default'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>,
    document.body
  );
}

// ─── GalleryCard ──────────────────────────────────────────────────────────────

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: (rect: DOMRect) => void;
}

function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  const cardRef    = useRef<HTMLButtonElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const zoomRef    = useRef<HTMLDivElement>(null);

  // Scroll-reveal — staggered from parent grid (index-based delay)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 36 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: (index % 4) * 0.08,
        });
      },
    });
    return () => st.kill();
  }, [index]);

  const onMouseEnter = useCallback(() => {
    gsap.to(imgRef.current,     { scale: 1.08, duration: 0.7, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1,  duration: 0.4, ease: 'power2.out' });
    gsap.to(infoRef.current,    { y: -8,        duration: 0.45, ease: 'power3.out' });
    gsap.to(zoomRef.current,    { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(imgRef.current,     { scale: 1,   duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.45, ease: 'power2.out' });
    gsap.to(infoRef.current,    { y: 0,        duration: 0.45, ease: 'power3.out' });
    gsap.to(zoomRef.current,    { opacity: 0, scale: 0.8, duration: 0.25 });
  }, []);

  const handleClick = useCallback(() => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) onClick(rect);
  }, [onClick]);

  const label = BRANCH_LABELS[item.branchSlug] ?? item.branchSlug;

  return (
    <button
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden bg-zinc-800 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 group"
      style={{ boxShadow: '0 4px 24px -6px rgba(0,0,0,0.5)' }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`View ${item.alt}`}
      aria-haspopup="dialog"
    >
      {/* Flexible aspect: portrait on mobile, landscape squares on grid */}
      <div className="relative aspect-square overflow-hidden">

        {/* Scaleable image layer */}
        <div ref={imgRef} className="absolute inset-0">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Hover overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Zoom icon center */}
        <div
          ref={zoomRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0, scale: 0.8 } as React.CSSProperties}
        >
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Bottom info */}
        <div ref={infoRef} className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <span className="block text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
            {label}
          </span>
          <p className="text-white font-semibold text-xs sm:text-sm leading-snug line-clamp-2">
            {item.alt}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── GalleryGrid ──────────────────────────────────────────────────────────────

interface GalleryGridProps {
  items: GalleryItem[];
  categories?: { slug: string; label: string }[];
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [originRect,    setOriginRect]    = useState<DOMRect | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === 'all'
    ? items
    : items.filter((i) => i.branchSlug === activeFilter);

  // Filter bar slide-in
  useEffect(() => {
    if (!filterBarRef.current) return;
    gsap.fromTo(filterBarRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  const openLightbox = useCallback((idx: number, rect: DOMRect) => {
    setOriginRect(rect);
    setLightboxIndex(idx);
  }, []);

  if (!items.length) {
    return <p className="text-center text-zinc-400 py-12">No gallery items yet.</p>;
  }

  return (
    <>
      {/* Filter pills */}
      {categories && categories.length > 1 && (
        <div ref={filterBarRef} className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveFilter(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200
                ${activeFilter === cat.slug
                  ? 'bg-amber-500 border-amber-500 text-zinc-950'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-style responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={i}
            onClick={(rect) => openLightbox(i, rect)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 py-12 text-sm">
          No photos for this branch yet.
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          originRect={originRect}
          onClose={() => { setLightboxIndex(null); setOriginRect(null); }}
          onNav={setLightboxIndex}
        />
      )}
    </>
  );
}
