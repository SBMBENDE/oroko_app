import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Gallery — OCA-EU',
  description:
    'A visual journey through OCA-EU events, community gatherings, and cultural celebrations.',
};

// Placeholder gallery items — connect to CMS/Cloudinary in production
const galleryItems = [
  { id: 'g1', label: 'Paris Annual Gala 2025', branch: 'France' },
  { id: 'g2', label: 'London Cultural Summit', branch: 'UK' },
  { id: 'g3', label: 'Brussels Policy Forum', branch: 'Belgium' },
  { id: 'g4', label: 'Rome Arts Exhibition', branch: 'Italy' },
  { id: 'g5', label: 'Helsinki Integration Workshop', branch: 'Finland' },
  { id: 'g6', label: 'Berlin Business Mixer', branch: 'Germany' },
  { id: 'g7', label: 'UK Youth Programme Launch', branch: 'UK' },
  { id: 'g8', label: 'Pan-European Leadership Summit', branch: 'All Branches' },
];

const gradients = [
  'from-amber-400 to-orange-600',
  'from-stone-700 to-stone-900',
  'from-blue-400 to-indigo-600',
  'from-green-400 to-emerald-600',
  'from-pink-400 to-rose-600',
  'from-purple-400 to-violet-600',
  'from-yellow-400 to-amber-600',
  'from-teal-400 to-cyan-600',
];

export default function GalleryPage() {
  return (
    <main>
      {/* Header */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-2xl py-12">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
            Visual Stories
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            A window into the vibrant life of OCA-EU — from intimate branch
            gatherings to large-scale cultural celebrations.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Photo Gallery" subtitle="Highlights from our events across Europe." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`relative aspect-square rounded-2xl bg-linear-to-br ${gradients[i % gradients.length]} flex flex-col items-center justify-center p-4 text-white overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <Badge variant="outline" className="border-white/40 text-white mb-2 text-xs">
                {item.branch}
              </Badge>
              <p className="text-center text-sm font-medium leading-snug relative z-10">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-stone-400 text-sm mt-8">
          Full photo gallery with high-resolution images coming soon. Connect your CMS or Cloudinary for rich media management.
        </p>
      </Section>
    </main>
  );
}
