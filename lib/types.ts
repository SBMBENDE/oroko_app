// ─── Core Entity Types ────────────────────────────────────────────────────────

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  profession: string;
  country: string;
  branchSlug: string;
  avatar: string;
  socialLinks: SocialLinks;
  isLeader?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  branchSlug: string;
  image: string;
  category: EventCategory;
  registrationLink?: string;
  featured?: boolean;
}

export type EventCategory =
  | 'cultural'
  | 'networking'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'celebration';

export type ProjectStatus = 'active' | 'completed' | 'upcoming';
export type ProjectCategory =
  | 'education'
  | 'entrepreneurship'
  | 'culture'
  | 'advocacy'
  | 'health'
  | 'technology';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  status: ProjectStatus;
  category: ProjectCategory;
  branchSlugs: string[];
  startDate: string;
  endDate?: string;
  image: string;
  tags: string[];
  lead: string;
  impactMetric?: string;
  website?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  branchSlug: string;
  date: string;
}

export interface Leadership {
  president: string;
  vicePresident?: string;
  secretary?: string;
  treasurer?: string;
}

export interface Branch {
  id: string;
  name: string;
  country: string;
  slug: string;
  description: string;
  shortDescription: string;
  logo: string;
  coverImage: string;
  flag: string;
  founded: string;
  city: string;
  leadership: Leadership;
  members: Member[];
  events: Event[];
  gallery: GalleryItem[];
  contactEmail: string;
  socialLinks: SocialLinks;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
}
