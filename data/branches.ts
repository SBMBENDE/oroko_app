import type { Branch } from '@/lib/types';

export const branches: Branch[] = [
  // ── France (1) ──────────────────────────────────────────────────────────────
  {
    id: 'branch-fr',
    name: 'OCA France',
    country: 'France',
    slug: 'france',
    city: 'Paris',
    flag: '🇫🇷',
    founded: '2015',
    shortDescription: 'Our founding chapter, based in the heart of Paris.',
    description:
      'OCA France is the founding chapter of OCA-EU, established in Paris in 2015. We bring together members from across the Oroko diaspora living in France, hosting monthly cultural events, professional networking sessions, and community support programmes.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500874/eu-france_logo_w95txo.jpg',
    coverImage: '/images/branches/france/cover.jpg',
    contactEmail: 'france@oca-eu.org',
    leadership: {
      president: 'Amara Diallo',
      vicePresident: 'Fatou Mensah',
      secretary: 'Kwame Asante',
      treasurer: 'Ines Bakayoko',
    },
    socialLinks: {
      facebook: 'https://facebook.com/ocaFrance',
      instagram: 'https://instagram.com/ocaFrance',
    },
    members: [],
    events: [],
    gallery: [],
  },

  // ── Belgium (2) ─────────────────────────────────────────────────────────────
  {
    id: 'branch-be-brussels',
    name: 'OCA Belgium – Brussels',
    country: 'Belgium',
    slug: 'belgium-brussels',
    city: 'Brussels',
    flag: '🇧🇪',
    founded: '2017',
    shortDescription: 'Based in Brussels, the heart of Europe.',
    description:
      'OCA Belgium Brussels operates in the capital and serves as a bridge between the Oroko diaspora community and European institutions. Our chapter is active in advocacy, cultural exchange, and educational initiatives.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500888/eu-OCA_Belgium_dchwvi.jpg',
    coverImage: '/images/branches/belgium/cover.jpg',
    contactEmail: 'belgium@oca-eu.org',
    leadership: {
      president: 'Celestine Nkosi',
      vicePresident: 'Bernard Osei',
      secretary: 'Miriam Djokoto',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/company/ocaBelgium',
      instagram: 'https://instagram.com/ocaBelgium',
    },
    members: [],
    events: [],
    gallery: [],
  },
  {
    id: 'branch-be-liege',
    name: 'OCA Belgium – Liège',
    country: 'Belgium',
    slug: 'belgium-liege',
    city: 'Liège',
    flag: '🇧🇪',
    founded: '2021',
    shortDescription: 'A vibrant community in the Wallonia region.',
    description:
      'OCA Belgium Liège is our second Belgian chapter, serving members across the Wallonia region. The branch focuses on cultural preservation, youth engagement, and integration support for newly arrived diaspora members.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500888/eu-OCA_Belgium_dchwvi.jpg',
    coverImage: '/images/branches/belgium/cover.jpg',
    contactEmail: 'belgium-liege@oca-eu.org',
    leadership: {
      president: 'Sylvain Mbida',
      secretary: 'Carine Fotso',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaBelgiumLiege',
    },
    members: [],
    events: [],
    gallery: [],
  },

  // ── United Kingdom (2) ──────────────────────────────────────────────────────
  {
    id: 'branch-uk-london',
    name: 'OCA UK Motto Mokor',
    country: 'United Kingdom',
    slug: 'uk-london',
    city: 'London',
    flag: '🇬🇧',
    founded: '2016',
    shortDescription: 'Our flagship UK chapter based in London.',
    description:
      'OCA UK Motto Mokor is one of our most active chapters, running entrepreneurship programmes, mentoring schemes, and vibrant cultural celebrations throughout the year. London serves as a hub for the wider UK network.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500889/EU-UK_mgw0qz.jpg',
    coverImage: '/images/branches/uk/cover.jpg',
    contactEmail: 'uk-london@oca-eu.org',
    leadership: {
      president: 'Mildred Motoko',
      vicePresident: 'Naomi Adeyemi',
      secretary: 'Samuel Owusu',
      treasurer: 'Grace Abiodun',
    },
    socialLinks: {
      twitter: 'https://twitter.com/ocaUKLondon',
      instagram: 'https://instagram.com/ocaUKLondon',
      facebook: 'https://facebook.com/ocaUKLondon',
    },
    members: [],
    events: [],
    gallery: [],
  },
  {
    id: 'branch-uk-manchester',
    name: 'OCA UK Teteri',
    country: 'United Kingdom',
    slug: 'uk-manchester',
    city: 'Coventry',
    flag: '🇬🇧',
    founded: '2019',
    shortDescription: 'Connecting the Oroko diaspora across the UK.',
    description:
      'OCA UK Teteri serves members across the United Kingdom, championing cultural education, entrepreneurship, and community welfare within the Oroko diaspora.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500889/EU-UK_mgw0qz.jpg',
    coverImage: '/images/branches/uk/cover.jpg',
    contactEmail: 'uk-teteri@oca-eu.org',
    leadership: {
      president: 'Ayamba Charles',
      secretary: 'Blessing Asante',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaUKManchester',
      facebook: 'https://facebook.com/ocaUKManchester',
    },
    members: [],
    events: [],
    gallery: [],
  },

  // ── Finland (1) ─────────────────────────────────────────────────────────────
  {
    id: 'branch-fi',
    name: 'OCA Finland',
    country: 'Finland',
    slug: 'finland',
    city: 'Helsinki',
    flag: '🇫🇮',
    founded: '2019',
    shortDescription: 'A growing community in the Nordic region.',
    description:
      'OCA Finland is our Nordic chapter based in Helsinki. Though one of our newer branches, it has grown rapidly and is known for its focus on integration, education, and Nordic–African cultural dialogue.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500800/EU-FINLAND_hbu11n.jpg',
    coverImage: '/images/branches/finland/cover.jpg',
    contactEmail: 'finland@oca-eu.org',
    leadership: {
      president: 'Adwoa Sarkodie',
      secretary: 'Pekka Mensah',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaFinland',
    },
    members: [],
    events: [],
    gallery: [],
  },

  // ── Ireland (1) ─────────────────────────────────────────────────────────────
  {
    id: 'branch-ie',
    name: 'OCA Ireland',
    country: 'Ireland',
    slug: 'ireland',
    city: 'Dublin',
    flag: '🇮🇪',
    founded: '2022',
    shortDescription: 'A thriving new chapter in Dublin.',
    description:
      'OCA Ireland is our Dublin-based chapter, one of our most recently established branches. It brings together Oroko community members across Ireland, focused on cultural connectivity, diaspora welfare, and integration support.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500875/EU-IRELAND_svrrme.jpg',
    coverImage: '/images/branches/ireland/cover.jpg',
    contactEmail: 'ireland@oca-eu.org',
    leadership: {
      president: 'Ngozi Eze',
      secretary: 'Patrick Mensah',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaIreland',
      facebook: 'https://facebook.com/ocaIreland',
    },
    members: [],
    events: [],
    gallery: [],
  },

  // ── Germany (3) ─────────────────────────────────────────────────────────────
  {
    id: 'branch-de-berlin',
    name: 'OCA Germany – Berlin',
    country: 'Germany',
    slug: 'germany-berlin',
    city: 'Berlin',
    flag: '🇩🇪',
    founded: '2020',
    shortDescription: 'Our flagship German chapter in the capital.',
    description:
      'OCA Germany Berlin is our flagship German chapter. We focus on professional development, business networking, and intercultural exchange, with a strong creative and entrepreneurial community across the city.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500874/EU-GERMANY_svmhnp.jpg',
    coverImage: '/images/branches/germany/cover.jpg',
    contactEmail: 'germany-berlin@oca-eu.org',
    leadership: {
      president: 'Emmanuel Boateng',
      vicePresident: 'Abena Frimpong',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/company/ocaGermanyBerlin',
      instagram: 'https://instagram.com/ocaGermanyBerlin',
    },
    members: [],
    events: [],
    gallery: [],
  },
  {
    id: 'branch-de-hamburg',
    name: 'OCA Germany – Hamburg',
    country: 'Germany',
    slug: 'germany-hamburg',
    city: 'Hamburg',
    flag: '🇩🇪',
    founded: '2021',
    shortDescription: 'Connecting the diaspora in Northern Germany.',
    description:
      "OCA Germany Hamburg serves Oroko diaspora members across Northern Germany. The chapter is active in cultural events, trade, and community support, reflecting Hamburg's role as a vibrant port city and multicultural hub.",
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500877/eu-NRW_paypbe.jpg',
    coverImage: '/images/branches/germany/cover.jpg',
    contactEmail: 'germany-hamburg@oca-eu.org',
    leadership: {
      president: 'David Tabi',
      secretary: 'Sandra Njoku',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaGermanyHamburg',
    },
    members: [],
    events: [],
    gallery: [],
  },
  {
    id: 'branch-de-munich',
    name: 'OCA Germany – Munich',
    country: 'Germany',
    slug: 'germany-munich',
    city: 'Munich',
    flag: '🇩🇪',
    founded: '2022',
    shortDescription: 'A growing presence in Southern Germany.',
    description:
      'OCA Germany Munich is our Southern Germany chapter, bringing together Oroko community members in Bavaria. The branch focuses on cultural celebration, professional networking, and support for students and families.',
    logo: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773500874/EU-BW_yvil0b.jpg',
    coverImage: '/images/branches/germany/cover.jpg',
    contactEmail: 'germany-munich@oca-eu.org',
    leadership: {
      president: 'Christiane Bello',
      secretary: 'Felix Nkeng',
    },
    socialLinks: {
      instagram: 'https://instagram.com/ocaGermanyMunich',
    },
    members: [],
    events: [],
    gallery: [],
  },
];

/**
 * Find a branch by its slug.
 */
export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

/**
 * Get all branch slugs — used for generateStaticParams.
 */
export function getAllBranchSlugs(): string[] {
  return branches.map((b) => b.slug);
}
