'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { useCardGridAnimation } from '@/hooks/useGsapAnimation';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const ref = useCardGridAnimation<HTMLDivElement>();

  if (!items.length) {
    return (
      <p className="text-center text-stone-400 py-12">No gallery items yet.</p>
    );
  }

  return (
    <>
      <div
        ref={ref}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {items.map((item) => (
          <button
            key={item.id}
            data-card
            className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            onClick={() => setSelected(item)}
            aria-label={item.alt}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setSelected(null)}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selected.src} alt={selected.alt} fill className="object-contain" />
            {selected.caption && (
              <p className="absolute bottom-0 inset-x-0 text-center text-white text-sm bg-black/50 py-2 px-4">
                {selected.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
