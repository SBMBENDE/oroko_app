'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Linkedin, Twitter, Instagram, Globe, RotateCcw, MapPin, Briefcase, ShieldCheck } from 'lucide-react';
import type { Member } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlipMemberCardProps {
  member: Member;
}

export function FlipMemberCard({ member }: FlipMemberCardProps) {
  const [flipped, setFlipped] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const flip = useCallback(() => {
    const next = !flipped;
    gsap.to(innerRef.current, {
      rotateY: next ? 180 : 0,
      duration: 0.5,
      ease: 'power3.inOut',
    });
    setFlipped(next);
  }, [flipped]);

  const handleHoverIn = useCallback((el: HTMLDivElement | null) => {
    if (!el || flipped) return;
    gsap.to(el, { y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)', duration: 0.3, ease: 'power2.out' });
  }, [flipped]);

  const handleHoverOut = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', duration: 0.4, ease: 'power2.out' });
  }, []);

  return (
    <div
      data-member-card
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={flip}
      onMouseEnter={(e) => handleHoverIn(e.currentTarget)}
      onMouseLeave={(e) => handleHoverOut(e.currentTarget)}
      role="button"
      aria-label={`${member.name} — tap for details`}
    >
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-white border border-stone-100 flex flex-col items-center justify-center p-5 text-center shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Officer badge */}
          {member.isLeader && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Officer
            </div>
          )}

          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-100 mb-3 ring-2 ring-amber-100 shadow">
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=78716c&color=fff&size=64`;
              }}
            />
          </div>
          <h3 className="font-bold text-stone-900 text-sm leading-tight">{member.name}</h3>
          <p className="text-amber-700 text-xs font-medium mt-0.5">{member.profession}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-stone-400">
            <MapPin className="w-3 h-3 shrink-0" />
            {member.country}
          </div>
          <p className={cn(
            'mt-2 text-xs text-stone-300 flex items-center gap-1',
            'select-none pointer-events-none'
          )}>
            tap for bio
          </p>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-stone-900 text-white flex flex-col p-5 shadow-sm"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-700 shrink-0">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=78716c&color=fff&size=40`;
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate">{member.name}</h3>
              <p className="text-amber-400 text-xs mt-0.5">{member.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
            <Briefcase className="w-3 h-3 shrink-0 text-amber-500" />
            {member.profession}
          </div>

          <p className="text-stone-300 text-xs leading-relaxed line-clamp-3 flex-1">{member.bio}</p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-700">
            <div className="flex items-center gap-2">
              {member.socialLinks.linkedin && (
                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-stone-500 hover:text-blue-400 transition-colors" onClick={(e) => e.stopPropagation()}
                  aria-label="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {member.socialLinks.twitter && (
                <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-stone-500 hover:text-sky-400 transition-colors" onClick={(e) => e.stopPropagation()}
                  aria-label="Twitter">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {member.socialLinks.instagram && (
                <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-stone-500 hover:text-pink-400 transition-colors" onClick={(e) => e.stopPropagation()}
                  aria-label="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {member.socialLinks.website && (
                <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer"
                  className="text-stone-500 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}
                  aria-label="Website">
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <button
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 transition-colors"
              onClick={(e) => { e.stopPropagation(); flip(); }}
            >
              <RotateCcw className="w-3 h-3" /> flip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
