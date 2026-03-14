'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Linkedin, Twitter, Instagram, Globe, Crown, MapPin } from 'lucide-react';
import type { Member } from '@/lib/types';
import { cn } from '@/lib/utils';

// ── Branch colours ────────────────────────────────────────────────────────────
const BRANCH_ACCENT: Record<string, { gradient: string; badge: string; border: string }> = {
  france:   { gradient: 'from-blue-800 via-blue-600 to-blue-400',   badge: 'bg-blue-100 text-blue-800',   border: 'border-blue-200' },
  uk:       { gradient: 'from-red-800 via-red-600 to-red-400',      badge: 'bg-red-100 text-red-800',     border: 'border-red-200'  },
  belgium:  { gradient: 'from-yellow-700 via-yellow-500 to-yellow-300', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-200' },
  finland:  { gradient: 'from-sky-800 via-sky-600 to-sky-400',      badge: 'bg-sky-100 text-sky-800',     border: 'border-sky-200'  },
  italy:    { gradient: 'from-green-800 via-green-600 to-green-400', badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
  germany:  { gradient: 'from-stone-800 via-stone-600 to-stone-400', badge: 'bg-stone-200 text-stone-800', border: 'border-stone-300' },
};
const DEFAULT_ACCENT = { gradient: 'from-amber-800 via-amber-600 to-amber-400', badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200' };

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleRank(role: string): number {
  const r = role.toLowerCase();
  if (r.includes('president') && !r.includes('vice') && !r.includes('assistant')) return 0;
  if (r.includes('vice president') || r.includes('vice-president')) return 1;
  if (r.includes('secretary general') && !r.includes('assistant')) return 2;
  if (r.includes('assistant secretary')) return 3;
  if (r.includes('financial sec')) return 4;
  if (r.includes('treasurer')) return 5;
  if (r.includes('communication')) return 6;
  if (r.includes('project')) return 7;
  if (r.includes('cultural')) return 8;
  return 9;
}

export function sortExecutives(members: Member[]): Member[] {
  return [...members].sort((a, b) => roleRank(a.role) - roleRank(b.role));
}

// ── Featured (top-president) card ─────────────────────────────────────────────
export function ExecutiveFeaturedCard({ member }: { member: Member }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = BRANCH_ACCENT[member.branchSlug] ?? DEFAULT_ACCENT;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    gsap.to(cardRef.current, { rotateX: y, rotateY: x, scale: 1.015, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 w-full cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image panel */}
        <div className="relative md:w-72 lg:w-80 shrink-0">
          <div className="relative w-full aspect-3/4 md:aspect-auto md:h-full min-h-72">
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=292524&color=fff&size=400`;
              }}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${accent.gradient} opacity-30`} />
            {/* Crown badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-md">
              <Crown className="w-3.5 h-3.5" />
              President
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-between p-7 md:p-9 flex-1">
          <div>
            {/* Branch badge */}
            <span className={cn('inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full capitalize mb-4', accent.badge)}>
              OCA-EU — {member.branchSlug}
            </span>

            <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">{member.name}</h3>
            <p className="text-amber-600 font-semibold text-sm mt-1 uppercase tracking-wide">{member.role}</p>

            <div className="flex items-center gap-1.5 text-stone-400 text-sm mt-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {member.country} · {member.profession}
            </div>

            <p className="mt-5 text-stone-600 text-base leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Social row */}
          <div className={cn('flex items-center gap-4 mt-7 pt-5 border-t', accent.border)}>
            {member.socialLinks.linkedin && (
              <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.socialLinks.twitter && (
              <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-sky-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {member.socialLinks.instagram && (
              <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {member.socialLinks.website && (
              <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-amber-600 transition-colors" aria-label="Website">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Regular executive card ─────────────────────────────────────────────────────
interface ExecutiveCardProps {
  member: Member;
  className?: string;
}

export function ExecutiveCard({ member, className }: ExecutiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = BRANCH_ACCENT[member.branchSlug] ?? DEFAULT_ACCENT;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    gsap.to(cardRef.current, {
      rotateX: y, rotateY: x, scale: 1.02,
      duration: 0.3, ease: 'power2.out', transformPerspective: 900,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.5, ease: 'elastic.out(1, 0.6)',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      data-exec-card
      className={cn(
        'relative bg-white rounded-2xl overflow-hidden shadow-md border border-stone-100 flex flex-col group cursor-default',
        className,
      )}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient accent strip */}
      <div className={`h-2 w-full bg-linear-to-r ${accent.gradient} shrink-0`} />

      {/* Large portrait image */}
      <div className="relative w-full aspect-4/5 bg-stone-100 overflow-hidden">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=292524&color=fff&size=300`;
          }}
        />
        {/* Bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
        {/* Branch badge on image */}
        <span className={cn('absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize', accent.badge)}>
          {member.branchSlug}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-stone-900 text-base leading-snug">{member.name}</h3>
        <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide mt-1">{member.role}</p>
        <p className="text-stone-400 text-xs mt-0.5 mb-3">{member.profession} · {member.country}</p>

        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {member.bio}
        </p>

        {/* Social links */}
        <div className={cn('flex items-center gap-3 mt-4 pt-4 border-t', accent.border)}>
          {member.socialLinks.linkedin && (
            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-stone-300 hover:text-blue-600 transition-colors" aria-label={`${member.name} LinkedIn`}>
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
              className="text-stone-300 hover:text-sky-500 transition-colors" aria-label={`${member.name} Twitter`}>
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.instagram && (
            <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
              className="text-stone-300 hover:text-pink-600 transition-colors" aria-label={`${member.name} Instagram`}>
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.website && (
            <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer"
              className="text-stone-300 hover:text-amber-600 transition-colors" aria-label={`${member.name} website`}>
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
