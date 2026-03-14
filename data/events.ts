import type { Event } from '@/lib/types';

export const events: Event[] = [
  {
    id: 'evt-uk-gala-2026',
    title: 'OROKO UK Fundraising Gala',
    description:
      'A spectacular fundraising gala raising scholarships for underprivileged IDPs and orphans in the Ndian and Meme Divisions of Cameroon. Featuring live performance by artist Phillbil, DJ Takeaway, MC Don Lary & MC Dialle. Tickets: Single £60 / Double £100.',
    date: '2026-05-09',
    location: 'White Diamond Hall, 141-143 Foleshill Road, Coventry, UK',
    branchSlug: 'uk-london',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773493765/Screenshot_2026-03-13_at_20.26.27_m20q0w.png',
    category: 'celebration',
    registrationLink: '#',
    featured: true,
  },
  {
    id: 'evt-fr-1',
    title: 'OROKO-EU Annual Convention',
    description:
      'Our flagship annual convention celebrates the achievements of OCA-EU members across Europe with an evening of music, art, and recognition awards.',
    date: '2026-08-15',
    location: 'Palais Brongniart, Paris, France',
    branchSlug: 'france',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    category: 'celebration',
    registrationLink: '#',
    featured: true,
  },
  {
    id: 'evt-fr-2',
    title: 'African Entrepreneurship Forum',
    description:
      'A day-long forum connecting African diaspora entrepreneurs with investors, mentors, and business leaders across Europe.',
    date: '2026-05-12',
    location: 'Station F, Paris, France',
    branchSlug: 'france',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1772305307/qa3qliyrnotvpzjcusrs.png',
    category: 'conference',
    registrationLink: '#',
  },
  // {
  //   id: 'evt-uk-1',
  //   title: 'London Cultural Identity Summit',
  //   description:
  //     'A cross-generational summit exploring identity, belonging, and the African diaspora experience in modern Britain.',
  //   date: '2026-03-28',
  //   location: 'Southbank Centre, London, UK',
  //   branchSlug: 'uk',
  //   image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  //   category: 'cultural',
  //   registrationLink: '#',
  // },
  // {
  //   id: 'evt-uk-2',
  //   title: 'UK Youth Mentorship Launch',
  //   description:
  //     'Launching our new structured mentorship programme pairing young professionals with experienced industry leaders.',
  //   date: '2026-04-05',
  //   location: 'WeWork Moorgate, London, UK',
  //   branchSlug: 'uk',
  //   image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
  //   category: 'networking',
  // },
  // {
  //   id: 'evt-be-1',
  //   title: 'Brussels Policy Roundtable',
  //   description:
  //     'An intimate roundtable with EU policymakers discussing African diaspora contributions to European society.',
  //   date: '2026-04-22',
  //   location: 'European Parliament Quarter, Brussels, Belgium',
  //   branchSlug: 'belgium',
  //   image: '/images/events/brussels-roundtable.jpg',
  //   category: 'conference',
  //   registrationLink: '#',
  // },
  // {
  //   id: 'evt-fi-1',
  //   title: 'Nordic Integration Workshop',
  //   description:
  //     'A practical workshop series on navigating Finnish society, from employment to building community networks.',
  //   date: '2026-04-10',
  //   location: 'Helsinki, Finland',
  //   branchSlug: 'finland',
  //   image: '/images/events/nordic-workshop.jpg',
  //   category: 'workshop',
  // },
  // {
  //   id: 'evt-de-1',
  //   title: 'Berlin Diaspora Business Mixer',
  //   description:
  //     'An evening networking event for African diaspora professionals and entrepreneurs in Berlin.',
  //   date: '2026-03-20',
  //   location: 'Soho House Berlin, Germany',
  //   branchSlug: 'germany',
  //   image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  //   category: 'networking',
  //   registrationLink: '#',
  // },
];

export function getEventsByBranch(branchSlug: string): Event[] {
  return events.filter((e) => e.branchSlug === branchSlug);
}

export function getUpcomingEvents(limit?: number): Event[] {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getAllEvents(): Event[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}
