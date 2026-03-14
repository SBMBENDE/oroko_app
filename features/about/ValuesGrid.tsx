'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

type Cta = { label: string; href: string };
type CardData = {
  title: string;
  description: string;
  image: string;
  cta?: Cta;
};

function FlipCard({ card, cardHeight = 280 }: { card: CardData; cardHeight?: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={`${card.title} — tap to ${flipped ? 'hide' : 'show'} details`}
    >
      <div
        className="relative w-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          height: `${cardHeight}px`,
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center sm:text-left">
            <h3 className="text-white font-bold text-lg sm:text-xl leading-snug drop-shadow">
              {card.title}
            </h3>
            <span className="inline-flex items-center justify-center sm:justify-start gap-1 mt-1.5 text-amber-300 text-xs font-medium">
              Tap to learn more
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-3 text-center sm:text-left">{card.title}</h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed text-center sm:text-left">
              {card.description}
            </p>
          </div>
          {card.cta && (
            <Link
              href={card.cta.href}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
            >
              {card.cta.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ValuesGrid({ cards, cardHeight }: { cards: CardData[]; cardHeight?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
      {cards.map((card) => (
        <FlipCard key={card.title} card={card} cardHeight={cardHeight} />
      ))}
    </div>
  );
}
