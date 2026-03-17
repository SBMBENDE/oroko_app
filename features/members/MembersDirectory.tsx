'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck } from 'lucide-react';
import type { Member } from '@/lib/types';
import { BranchFilter } from './BranchFilter';
import { FlipMemberCard } from './FlipMemberCard';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const BRANCH_FLAGS: Record<string, string> = {
  france: '🇫🇷',
  uk: '🇬🇧',
  belgium: '🇧🇪',
  finland: '🇫🇮',
  ireland: '🇮🇪',
  germany: '🇩🇪',
};

interface MembersDirectoryProps {
  members: Member[]; // ALL branch members (officers + general)
}

// Sort so officers (isLeader) appear before regular members within a group
function sortBranchMembers(list: Member[]): Member[] {
  return [...list].sort((a, b) => {
    if (a.isLeader && !b.isLeader) return -1;
    if (!a.isLeader && b.isLeader) return 1;
    return 0;
  });
}

export function MembersDirectory({ members }: MembersDirectoryProps) {
  const allBranches = [...new Set(members.map((m) => m.branchSlug))];
  const [selected, setSelected] = useState<string>('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const counts = allBranches.reduce<Record<string, number>>((acc, b) => {
    acc[b] = members.filter((m) => m.branchSlug === b).length;
    return acc;
  }, {});

  const filtered = selected === 'all'
    ? members
    : sortBranchMembers(members.filter((m) => m.branchSlug === selected));

  // Group by branch for sectioned view
  const grouped: Record<string, Member[]> = {};
  if (selected === 'all') {
    allBranches.forEach((b) => {
      grouped[b] = sortBranchMembers(members.filter((m) => m.branchSlug === b));
    });
  }

  const animateCards = useCallback(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>('[data-member-card]');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
    );
  }, []);

  useEffect(() => {
    animateCards();
  }, [selected, animateCards]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-member-card]', {
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, y: 32, scale: 0.95 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out',
          }),
        start: 'top 88%',
        once: true,
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-stone-50 border-b border-stone-100 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BranchFilter
            branches={allBranches}
            selected={selected}
            onChange={setSelected}
            counts={counts}
          />
        </div>
      </div>

      <div ref={gridRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {selected === 'all' ? (
          // ── Sectioned by branch ──────────────────────────────────────────────
          allBranches.map((branch) => {
            const officers = grouped[branch].filter((m) => m.isLeader);
            const general  = grouped[branch].filter((m) => !m.isLeader);
            return (
              <div key={branch}>
                {/* Branch header */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">{BRANCH_FLAGS[branch]}</span>
                  <h2 className="text-xl font-bold text-stone-900">
                    OROKO {branch.charAt(0).toUpperCase() + branch.slice(1)}
                  </h2>
                  <span className="text-xs font-semibold bg-stone-100 text-stone-400 rounded-full px-2.5 py-0.5 tabular-nums">
                    {grouped[branch].length}
                  </span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                {/* Branch officers sub-section */}
                {officers.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Branch Officers</span>
                      <div className="flex-1 h-px bg-amber-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {officers.map((m) => <FlipMemberCard key={m.id} member={m} />)}
                    </div>
                  </div>
                )}

                {/* General members sub-section */}
                {general.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Community Members</span>
                      <div className="flex-1 h-px bg-stone-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {general.map((m) => <FlipMemberCard key={m.id} member={m} />)}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // ── Single branch filtered view ──────────────────────────────────────
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">{BRANCH_FLAGS[selected]}</span>
              <h2 className="text-xl font-bold text-stone-900">
                OROKO {selected.charAt(0).toUpperCase() + selected.slice(1)}
              </h2>
              <span className="text-xs font-semibold bg-stone-100 text-stone-400 rounded-full px-2.5 py-0.5">
                {filtered.length} members
              </span>
            </div>

            {/* Officers */}
            {filtered.filter((m) => m.isLeader).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Branch Officers</span>
                  <div className="flex-1 h-px bg-amber-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.filter((m) => m.isLeader).map((m) => (
                    <FlipMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )}

            {/* General members */}
            {filtered.filter((m) => !m.isLeader).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Community Members</span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.filter((m) => !m.isLeader).map((m) => (
                    <FlipMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


