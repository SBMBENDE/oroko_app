import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EventGrid } from '@/features/events/EventGrid';
import { EventsHero } from '@/features/events/EventsHero';
import { getAllEvents } from '@/data/events';

export const metadata: Metadata = {
  title: 'Events — OCA-EU',
  description:
    'Browse OCA-EU events across Europe — conferences, cultural celebrations, workshops, and networking.',
};

export default function EventsPage() {
  const allEvents = getAllEvents();
  const today = new Date().toISOString().split('T')[0];
  const upcoming = allEvents.filter((e) => e.date >= today);
  const past = allEvents.filter((e) => e.date < today);

  return (
    <main>
      {/* Header */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <EventsHero />
      </Section>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <Section>
          <SectionHeading
            title="Upcoming Events"
            subtitle={`${upcoming.length} events coming up across our European network.`}
            centered
          />
          <EventGrid events={upcoming} />
        </Section>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <Section className="bg-stone-50">
          <SectionHeading title="Past Events" centered />
          <EventGrid events={past} isPast />
        </Section>
      )}
    </main>
  );
}
