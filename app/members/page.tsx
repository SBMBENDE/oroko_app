'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { MembersHero } from '@/features/members/MembersHero';
import { ExecutivesSection } from '@/features/members/ExecutivesSection';
import { DonateButton } from '@/components/ui/DonateButton';
import { executivesApi, membersApi, chaptersApi } from '@/lib/api/members.api';
import type { Member } from '@/lib/types';

// Map API executive shape → existing Member type so ExecutivesSection works unchanged
interface ApiExec {
  _id: string; firstName: string; lastName: string; profilePhoto?: string;
  executivePosition?: string; country: string; profession?: string; bio?: string;
  chapter?: { name: string; slug: string }; linkedin?: string; instagram?: string;
  facebook?: string; website?: string;
}

function mapExecToMember(e: ApiExec): Member {
  return {
    id: e._id,
    name: `${e.firstName} ${e.lastName}`,
    role: e.executivePosition ?? 'Member',
    bio: e.bio ?? '',
    profession: e.profession ?? '',
    country: e.country,
    branchSlug: e.chapter?.slug ?? 'oroko-eu',
    avatar: e.profilePhoto ?? '',
    socialLinks: {
      linkedin: e.linkedin, instagram: e.instagram,
      facebook: e.facebook, website: e.website,
    },
    isLeader: true,
  };
}

interface ApiMember {
  _id: string; firstName: string; lastName: string; profilePhoto?: string;
  country: string; profession?: string; chapter?: { name: string; slug: string };
  role: string; executivePosition?: string; canMessage?: boolean;
}

const COUNTRY_FLAG: Record<string, string> = {
  France: '🇫🇷', Belgium: '🇧🇪', 'United Kingdom': '🇬🇧', Finland: '🇫🇮',
  Italy: '🇮🇹', Germany: '🇩🇪', Ireland: '🇮🇪', Cameroon: '🇨🇲',
};

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  // Live data
  const { data: execData } = useQuery({
    queryKey: ['executives'],
    queryFn: () => executivesApi.getAll(),
    select: (r) => (r.data.data as ApiExec[]).map(mapExecToMember),
  });

  const { data: membersData } = useQuery({
    queryKey: ['members', search, country],
    queryFn: () => membersApi.getDirectory({
      ...(search && { search }),
      ...(country && { country }),
      limit: '48',
    }),
    select: (r) => r.data,
  });

  const { data: chaptersData } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => chaptersApi.getAll(),
    select: (r) => r.data.data as { _id: string; name: string; slug: string; country: string }[],
  });

  const executives = execData ?? [];
  const members: ApiMember[] = membersData?.data ?? [];
  const totalActive: number = membersData?.pagination?.total ?? 0;
  const chapters = chaptersData ?? [];

  // Branch presidents: executives whose position includes "President"
  const presidents = executives.filter((e) =>
    e.role.toLowerCase().includes('president')
  );

  return (
    <main>
      <MembersHero activeCount={totalActive || undefined} chapterCount={chapters.length || undefined} />

      {/* Executive Board — live from API */}
      {executives.length > 0 && (
        <section className="bg-white border-b border-stone-100">
          <ExecutivesSection members={executives} />
        </section>
      )}

      {/* Branch Presidents — from executives with President role */}
      {presidents.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-1">Chapters</p>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Branch Presidents</h2>
                <p className="text-stone-500 mt-1 text-sm">
                  The elected presidents leading each of our {presidents.length} European chapters.
                </p>
              </div>
              <DonateButton size="sm" label="Support Our Community" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {presidents.map((p) => (
                <div key={p.id} className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-4xl shrink-0">{COUNTRY_FLAG[p.country] ?? '🌍'}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-stone-400 uppercase tracking-widest truncate">{p.branchSlug.replace(/-/g, ' ').toUpperCase()}</p>
                    <p className="font-semibold text-stone-900 text-base mt-0.5 truncate">{p.name}</p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Member Directory */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-1">Community</p>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Our Members</h2>
              <p className="text-stone-500 mt-1 text-sm">{totalActive} active members across Europe</p>
            </div>
            <DonateButton size="sm" label="Donate" />
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, profession, skill…"
                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-400 transition-colors" />
            </div>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-amber-400">
              <option value="">All Countries</option>
              {chapters.map((ch) => (
                <option key={ch._id} value={ch.country}>{ch.country}</option>
              ))}
            </select>
          </div>

          {/* Member grid */}
          {members.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              {search || country ? 'No members found for this search.' : 'No approved members yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {members.map((m) => (
                <div key={m._id} className="flex flex-col items-center text-center bg-stone-50 rounded-2xl p-4 hover:bg-amber-50 hover:shadow-md transition-all group">
                  {m.profilePhoto ? (
                    <Image src={m.profilePhoto} alt={m.firstName} width={64} height={64}
                      className="w-16 h-16 rounded-2xl object-cover mb-3" unoptimized />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg mb-3">
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-stone-900 leading-tight">{m.firstName} {m.lastName}</p>
                  {m.profession && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{m.profession}</p>}
                  <p className="text-xs text-amber-600 mt-1">{m.chapter?.name ?? m.country}</p>
                  {m.role === 'EXECUTIVE' && m.executivePosition && (
                    <span className="mt-1.5 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                      {m.executivePosition}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Login CTA for non-members */}
          <div className="mt-12 bg-stone-900 rounded-2xl px-8 py-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Want to connect with members?</h3>
            <p className="text-stone-400 text-sm mb-6">Log in or apply for membership to access full profiles, direct messaging, and networking features.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/login" className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
