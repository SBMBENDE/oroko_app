import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Mail, Calendar } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { MemberCard } from '@/features/members/MemberCard';
import { EventCard } from '@/features/events/EventCard';
import { GalleryGrid } from '@/features/gallery/GalleryGrid';
import { getBranchBySlug, getAllBranchSlugs } from '@/data/branches';
import { getMembersByBranch } from '@/data/members';
import { getEventsByBranch } from '@/data/events';
import { Badge } from '@/components/ui/Badge';
import { DonateButton } from '@/components/ui/DonateButton';

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBranchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) return { title: 'Branch not found' };
  return {
    title: `${branch.name} — OCA-EU`,
    description: branch.shortDescription,
  };
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  const members = getMembersByBranch(slug);
  const events = getEventsByBranch(slug);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-stone-950 to-stone-900 text-white py-20 pt-36 md:pt-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
            <span className="text-7xl shrink-0">{branch.flag}</span>
            <div>
              <Badge className="mb-3">Branch</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{branch.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-stone-300 text-sm mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {branch.city}, {branch.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Founded {branch.founded}
                </span>
                <a
                  href={`mailto:${branch.contactEmail}`}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  {branch.contactEmail}
                </a>
              </div>
              <p className="text-stone-300 max-w-2xl leading-relaxed">{branch.description}</p>
              <div className="mt-6 flex justify-center md:justify-start">
                <DonateButton
                  size="md"
                  variant="outline"
                  branchSlug={branch.slug}
                  label={`Donate to ${branch.name}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {branch.leadership && (
        <Section tight className="bg-stone-50">
          <SectionHeading title="Branch Leadership" centered />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(branch.leadership).map(([role, name]) => (
              <div key={role} className="bg-white rounded-xl p-4 border border-stone-100 text-center">
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
                  {role.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-semibold text-stone-900 text-sm">{name}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Members */}
      {members.length > 0 && (
        <Section>
          <SectionHeading
            title="Members"
            subtitle={`Meet the ${members.length} members driving ${branch.name} forward.`}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </Section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <Section className="bg-stone-50">
          <SectionHeading
            title="Events"
            subtitle={`Upcoming and recent events from ${branch.country}.`}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>
      )}

      {/* Gallery */}
      {branch.gallery.length > 0 && (
        <Section>
          <SectionHeading title="Gallery" />
          <GalleryGrid items={branch.gallery} />
        </Section>
      )}
    </main>
  );
}
