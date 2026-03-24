import type { NavItem } from './types';

export const SITE_NAME = 'OCA-EU';
export const SITE_DESCRIPTION =
  'Connecting the Oroko Diaspora across Europe.';
export const SITE_URL = 'https://oca-eu.org';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Branches', href: '/branches' },
  { label: 'Members', href: '/members' },
  { label: 'Events', href: '/events' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const EVENT_CATEGORIES = [
  'cultural',
  'networking',
  'workshop',
  'conference',
  'social',
  'celebration',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  cultural: 'bg-purple-100 text-purple-800',
  networking: 'bg-blue-100 text-blue-800',
  workshop: 'bg-green-100 text-green-800',
  conference: 'bg-yellow-100 text-yellow-800',
  social: 'bg-pink-100 text-pink-800',
  celebration: 'bg-orange-100 text-orange-800',
};
