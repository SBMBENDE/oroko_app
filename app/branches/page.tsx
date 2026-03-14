import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { BranchLogoGrid } from '@/features/branches/BranchLogoGrid';
import { branches } from '@/data/branches';

export const metadata: Metadata = {
  title: 'Branches — OCA-EU',
  description:
    'Discover OCA-EU chapters across Europe — France, Belgium, UK, Finland, Ireland, and Germany.',  
};

export default function BranchesPage() {
  return (
    <main>
      {/* Header */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-2xl py-12">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
            Our Network
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Branches Across Europe
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Each branch is an independent entity of the Orokos in the country, rooted
            in its local context and connected to the OCA-EU movement.
          </p>
        </div>
      </Section>

      {/* Grid */}
      <Section>
        <SectionHeading
          title={`${branches.length} Active Chapters`}
          subtitle="Click on a branch to meet its members, see upcoming events, and explore the gallery."
        />
        <BranchLogoGrid branches={branches} />
      </Section>
    </main>
  );
}
