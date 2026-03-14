import type { Metadata } from 'next';
import { members } from '@/data/members';
import { MembersHero } from '@/features/members/MembersHero';
import { ExecutivesSection } from '@/features/members/ExecutivesSection';
import { DonateButton } from '@/components/ui/DonateButton';

export const metadata: Metadata = {
  title: 'Members — OCA-EU',
  description:
    'Meet the members and leaders of OCA-EU chapters across Europe.',
};

const branchPresidents = [
  { branch: 'Oroko Badenwurtenburg', president: 'Ekue Roland',         flag: '🇩🇪' },
  { branch: 'OCA NRW Germany',        president: 'Iya Iye',             flag: '🇩🇪' },
  { branch: 'OCA Belgium',            president: 'Tata Enyanga Bato',   flag: '🇧🇪' },
  { branch: 'OCA France',             president: 'Isele Philip',        flag: '🇫🇷' },
  { branch: 'OCA Berlin',             president: 'Beloe',               flag: '🇩🇪' },
  { branch: 'OCA UK',                 president: 'Mildred Motoko',      flag: '🇬🇧' },
  { branch: 'OCA UK (Teteri)',         president: 'Ayamba Charles',      flag: '🇬🇧' },
  { branch: 'OCA Belgium',            president: 'Dieudonne',           flag: '🇧🇪' },
  { branch: 'OCA Ireland',            president: 'Makia',               flag: '🇮🇪' },
  { branch: 'Oroko Finland',          president: 'Okie Epah Alphonse',  flag: '🇫🇮' },
];

export default function MembersPage() {
  const orokoEUExecs = members.filter((m) => m.branchSlug === 'oroko-eu');

  return (
    <main>
      <MembersHero />

      {/* OCA-EU Central Executive Board */}
      <section className="bg-white border-b border-stone-100">
        <ExecutivesSection members={orokoEUExecs} />
      </section>

      {/* Branch Presidents */}
      <section className="bg-stone-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-1">Chapters</p>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Branch Presidents</h2>
              <p className="text-stone-500 mt-1 text-sm">
                The elected presidents leading each of our {branchPresidents.length} European chapters.
              </p>
            </div>
            <DonateButton size="sm" label="Support Our Community" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchPresidents.map(({ branch, president, flag }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-4xl shrink-0">{flag}</span>
                <div className="min-w-0">
                  <p className="text-xs text-stone-400 uppercase tracking-widest truncate">{branch}</p>
                  <p className="font-semibold text-stone-900 text-base mt-0.5 truncate">{president}</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">President</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
