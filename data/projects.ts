import type { Project, ProjectCategory, ProjectStatus } from '@/lib/types';

export const projects: Project[] = [
  // ── Education ────────────────────────────────────────────────────────────────
  {
    id: 'proj-scholarship',
    title: 'OROKO Scholarship Fund',
    description:
      'A scholarship programme supporting Oroko students back home.',
    longDescription:
      'The OROKO Scholarship Fund awards grants to talented students of Oroko heritage pursuing studies in Cameroon. This year 2026, we have supported over 100 students in the Ndian region. The fund is sustained by member contributions, corporate partnerships, and annual fundraising events.',
    status: 'active',
    category: 'education',
    branchSlugs: ['cameroon'],
    startDate: '2026-08-01',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1774305110/annie-spratt-WwSX_X4GrAA-unsplash_trh4j3.jpg',
    tags: ['Education', 'Scholarships', 'Youth'],
    lead: 'Isele Philip',
    impactMetric: '100+ students supported',
    website: '#',
  },
  {
    id: 'proj-mentorship',
    title: 'Oroko Girl Child Mentorship Programme',
    description:
      'A structured 6-month mentoring scheme pairing emerging femaleprofessionals with senior leaders.',
    longDescription:
      'Our Mentorship Programme connects young professionals (20–25) from the African diaspora with established industry leaders and executives across Europe. Each cohort runs for six months, featuring one-on-one mentoring sessions, group masterclasses, and a final showcase. The programme covers sectors including finance, technology, law, healthcare, and the creative industries.',
    status: 'active',
    category: 'entrepreneurship',
    branchSlugs: ['uk', 'france', 'germany'],
    startDate: '2020-03-01',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1774304601/oyemike-princewill-JnFKGfAyIUE-unsplash_cvti9v.jpg',
    tags: ['Mentorship', 'Career', 'Leadership'],
    lead: 'Kofi Amponsah',
    impactMetric: '120 mentor-mentee pairs',
    website: '#',
  },
  // ── Culture ──────────────────────────────────────────────────────────────────
  {
    id: 'proj-oral-history',
    title: 'Oroko History Archive',
    description:
      'A digital archive preserving first-person stories and narratives of the Oroko land.',
    longDescription:
      "In partnership with two European universities, we are building a publicly accessible digital archive of oral histories from Oroko diaspora community members across six countries. Interviews are conducted in multiple languages and cover topics including migration journeys, cultural identity, professional life, and community building. The archive will launch publicly in late 2026.",
    status: 'active',
    category: 'culture',
    branchSlugs: ['france', 'belgium', 'uk', 'ireland', 'finland', 'germany'],
    startDate: '2024-09-01',
    endDate: '2026-12-31',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458745/WhatsApp_Image_2026-03-13_at_20.53.02_1_aseri6.jpg',
    tags: ['Heritage', 'Digital Archive', 'Research'],
    lead: 'Chioma Okafor',
    impactMetric: '200+ stories collected',
  },
  {
    id: 'proj-cultural-festival',
    title: 'OROKO Cultural Festival',
    description:
      'An annual multi-city festival celebrating Oroko arts, music, cuisine, and cultural heritage.',
    longDescription:
      'The OROKO Cultural Festival is our flagship annual cultural event, held  across multiple European cities. The festival features live music, traditional dance performances, contemporary art exhibitions, food markets, panel discussions, and children\'s programming. Each edition draws thousands of visitors and is broadcast online to an international audience.',
    status: 'active',
    category: 'culture',
    branchSlugs: ['france', 'uk', 'belgium', 'ireland', 'germany', 'finland'],
    startDate: '2016-07-01',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773662784/Screenshot_2026-03-15_at_16.17.46_es5gga.png',
    tags: ['Culture', 'Arts', 'Music', 'Festival'],
    lead: 'Amara Diallo',
    impactMetric: '5,000+ attendees annually',
    website: '#',
  },
  // ── Advocacy ─────────────────────────────────────────────────────────────────
  // {
  //   id: 'proj-policy-voice',
  //   title: 'Diaspora Policy Voice Initiative',
  //   description:
  //     'Advocacy work engaging European institutions on diaspora rights, representation, and policies.',
  //   longDescription:
  //     'The Diaspora Policy Voice Initiative is OCA-EU\'s advocacy arm, working directly with European Parliament representatives, national governments, and EU agencies to amplify the voice of the African diaspora in policy discussions. We publish policy briefs, host roundtable meetings with officials, and coordinate joint campaigns with other diaspora organisations across Europe.',
  //   status: 'active',
  //   category: 'advocacy',
  //   branchSlugs: ['belgium', 'france', 'uk'],
  //   startDate: '2019-01-01',
  //   image: '/images/projects/policy.jpg',
  //   tags: ['Advocacy', 'Policy', 'EU', 'Rights'],
  //   lead: 'Celestine Nkosi',
  //   impactMetric: '12 policy briefs published',
  //   website: '#',
  // },
  // ── Entrepreneurship ─────────────────────────────────────────────────────────
  {
    id: 'proj-startup-hub',
    title: 'OROKO Startup Hub',
    description:
      'A business incubator and accelerator programme for Oroko diaspora entrepreneurs.',
    longDescription:
      'The OROKO Startup Hub is a 12-week accelerator programme for Oroko diaspora entrepreneurs launching or scaling businesses within Europe. Participants receive business coaching, legal and financial advisory sessions, pitch practice, and access to our investor network. The programme runs twice per year in partnership with co-working spaces in Paris, London, and Berlin.',
    status: 'active',
    category: 'entrepreneurship',
    branchSlugs: ['france', 'uk', 'germany'],
    startDate: '2022-01-01',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773726894/sam-portfolio_aivstv.jpg',
    tags: ['Entrepreneurship', 'Startups', 'Business'],
    lead: 'Emmanuel Boateng',
    impactMetric: '45 startups supported',
    website: '#',
  },
  // ── Technology ───────────────────────────────────────────────────────────────
  {
    id: 'proj-digital-skills',
    title: 'Borehole',
    description:
      'Free intensive coding and digital literacy courses for diaspora youth and job-seekers.',
    longDescription:
      'The OROKO Digital Skills Bootcamp offers free 8-week intensive courses in web development, data literacy, digital marketing, and UX design for diaspora youth (16–30) and career changers. Courses are delivered both in-person and online, with instructors drawn from OROKO member companies and volunteer tech professionals. Graduates receive an OROKO Digital Certificate.',
    status: 'upcoming',
    category: 'development',
    branchSlugs: ['france', 'uk', 'germany'],
    startDate: '2026-06-01',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1774305434/andrew-itaga-e0N0tpl26EU-unsplash_cukr9j.jpg',
    tags: ['Technology', 'Coding', 'Skills', 'Youth'],
    lead: 'Sam Mbende',
    impactMetric: 'Launching September 2027',
  },
  // ── Completed ────────────────────────────────────────────────────────────────
  {
    id: 'proj-health-campaign',
    title: 'Oroko Diaspora Health Awareness Campaign',
    description:
      'A community health initiative addressing health literacy and access for the Oroko diaspora.',
    longDescription:
      'Delivered in partnership with healthcare professionals and NGOs, this campaign ran across five countries and focused on preventive health, mental health awareness, and navigating European healthcare systems. The campaign included free health screening days, multilingual health guides, and online webinars with medical professionals.',
    status: 'completed',
    category: 'health',
    branchSlugs: ['france', 'uk', 'belgium', 'italy', 'finland'],
    startDate: '2023-01-01',
    endDate: '2024-06-30',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773666892/samples/zoom.avif',
    tags: ['Health', 'Wellbeing', 'Community'],
    lead: 'Dr. Naomi Basake',
    impactMetric: '2,000+ people reached',
  },
];

export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  upcoming: 'Upcoming',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-stone-100 text-stone-600',
  upcoming: 'bg-blue-100 text-blue-800',
};

export const PROJECT_CATEGORY_COLORS: Record<string, string> = {
  education: 'bg-purple-100 text-purple-800',
  entrepreneurship: 'bg-amber-100 text-amber-800',
  culture: 'bg-pink-100 text-pink-800',
  advocacy: 'bg-red-100 text-red-800',
  health: 'bg-teal-100 text-teal-800',
  development: 'bg-blue-100 text-blue-800',
};

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getProjectsByBranch(branchSlug: string): Project[] {
  return projects.filter((p) => p.branchSlugs.includes(branchSlug));
}
