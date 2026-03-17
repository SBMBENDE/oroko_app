import type { Project, ProjectCategory, ProjectStatus } from '@/lib/types';

export const projects: Project[] = [
  // ── Education ────────────────────────────────────────────────────────────────
  {
    id: 'proj-scholarship',
    title: 'OROKO Scholarship Fund',
    description:
      'Annual scholarship programme supporting diaspora students in higher education across Europe.',
    longDescription:
      'The OROKO Scholarship Fund awards annual grants to talented students of African heritage pursuing undergraduate and postgraduate studies across European universities. Since 2018, we have supported over 60 students in fields ranging from law and medicine to engineering and the arts. The fund is sustained by member contributions, corporate partnerships, and annual fundraising events.',
    status: 'active',
    category: 'education',
    branchSlugs: ['france', 'uk', 'belgium', 'germany'],
    startDate: '2018-01-01',
    image: '/images/projects/scholarship.jpg',
    tags: ['Education', 'Scholarships', 'Youth'],
    lead: 'Fatou Mensah',
    impactMetric: '60+ students supported',
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
    image: '/images/projects/mentorship.jpg',
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
    image: '/images/projects/oral-history.jpg',
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
    image: '/images/projects/festival.jpg',
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
    image: '/images/projects/startup-hub.jpg',
    tags: ['Entrepreneurship', 'Startups', 'Business'],
    lead: 'Emmanuel Boateng',
    impactMetric: '45 startups supported',
    website: '#',
  },
  // ── Technology ───────────────────────────────────────────────────────────────
  {
    id: 'proj-digital-skills',
    title: 'Digital Skills Bootcamp',
    description:
      'Free intensive coding and digital literacy courses for diaspora youth and job-seekers.',
    longDescription:
      'The OROKO Digital Skills Bootcamp offers free 8-week intensive courses in web development, data literacy, digital marketing, and UX design for diaspora youth (16–30) and career changers. Courses are delivered both in-person and online, with instructors drawn from OROKO member companies and volunteer tech professionals. Graduates receive an OROKO Digital Certificate.',
    status: 'upcoming',
    category: 'technology',
    branchSlugs: ['france', 'uk', 'germany'],
    startDate: '2026-06-01',
    image: '/images/projects/digital-skills.jpg',
    tags: ['Technology', 'Coding', 'Skills', 'Youth'],
    lead: 'Sam Mbende',
    impactMetric: 'Launching September 2026',
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
    image: '/images/projects/health.jpg',
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
  technology: 'bg-blue-100 text-blue-800',
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
