import type { Metadata } from 'next';
import { GalleryGrid } from '@/features/gallery/GalleryGrid';
import { galleryItems, galleryCategories } from '@/data/gallery';

export const metadata: Metadata = {
  title: 'Gallery — OCA-EU',
  description:
    'A visual journey through OCA-EU events, community gatherings, and cultural celebrations.',
};

export default function GalleryPage() {
  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-14 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="container mx-auto max-w-4xl">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            Visual Stories
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Our Gallery
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Capturing moments that define OCA-EU — community, culture, and connection across Europe.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <GalleryGrid items={galleryItems} categories={galleryCategories} />
        </div>
      </section>
    </main>
  );
}

