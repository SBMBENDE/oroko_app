import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { BranchCard } from '@/features/branches/BranchCard';
import { EventCard } from '@/features/events/EventCard';
import { branches } from '@/data/branches';
import { getUpcomingEvents } from '@/data/events';

export const metadata: Metadata = {
  title: 'OCA-EU — United by Culture, Rooted in Africa',
  description:
    'OCA-EU is an international cultural association connecting the African diaspora across Europe through culture, community, and shared ambition.',
};

export default function HomePage() {
  const featuredSlugs = ['france', 'uk-london', 'belgium-brussels'];
  const featuredBranches = featuredSlugs.map((slug) => branches.find((b) => b.slug === slug)!).filter(Boolean);
  const upcomingEvents = getUpcomingEvents(3);

  return (
    <main>
      <HeroSection />

      {/* Branches preview */}
      <Section>
        <SectionHeading
          title="Our Branches Across Europe"
          subtitle="From Paris to Helsinki, OCA-EU chapters thrive in cities across the continent."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" size="sm" className="w-full sm:w-auto sm:text-base! sm:px-7! sm:py-3.5!" asChild>
            <Link href="/branches" className="flex items-center justify-center gap-2">
              View all branches <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Upcoming events preview */}
      {upcomingEvents.length > 0 && (
        <Section className="bg-stone-50">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Stay connected with what's happening across our European network."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="sm" className="w-full sm:w-auto sm:text-base! sm:px-7! sm:py-3.5!" asChild>
              <Link href="/events" className="flex items-center justify-center gap-2">
                All events <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Mission CTA */}
      <Section className="bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of Something Bigger</h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-8">
            Join thousands of members across Europe who are building stronger communities,
            celebrating shared heritage, and creating real impact through OCA-EU.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" asChild>
              <Link href="/contact">Join OCA-EU</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/about">Our Mission</Link>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}


