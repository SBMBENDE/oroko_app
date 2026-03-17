import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Music, Users, Globe, Star, Heart } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { Button } from '@/components/ui/Button';
import { DonateButton } from '@/components/ui/DonateButton';
// ...existing code...
import { UpcomingEventsSection } from '@/features/events/UpcomingEventsSection';
import { ImpactSection } from '@/features/about/ImpactSection';
import { branches } from '@/data/branches';
import { members } from '@/data/members';
import { getUpcomingEvents } from '@/data/events';

export const metadata: Metadata = {
  title: 'OCA-EU — United by Culture, Rooted in Africa',
  description:
    'OCA-EU is an international cultural association connecting the African diaspora across Europe through culture, community, and shared ambition.',
};

const principles = [
  {
    icon: Music,
    title: 'Cultural Heritage',
    description: 'Preserving and celebrating Oroko cultural traditions across the diaspora.',
  },
  {
    icon: Users,
    title: 'Community Unity',
    description: 'Building strong bonds between communities spread across European nations.',
  },
  {
    icon: Heart,
    title: 'Diaspora Support',
    description: 'Providing resources, guidance, and a network of solidarity for members.',
  },
  {
    icon: Star,
    title: 'Youth Development',
    description: 'Empowering the next generation to lead with purpose and cultural pride.',
  },
];

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents(3);
  const executives = members.filter((m) => m.isLeader).slice(0, 5);

  return (
    <main className="bg-zinc-950">
      <HeroSection />

      {/* ── ABOUT OCA-EU ── */}
      <section className="py-16 md:py-24 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
                About OCA-EU
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                We connect, we build and we preserve
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-4">
                The Oroko Cultural Association-Europe is an international cultural body connecting Oroko
                communities across Germany, France, Belgium, the United Kingdom, Finland, Ireland, and beyond.
              </p>
              <p className="text-zinc-500 text-base leading-relaxed mb-8">
                We champion cultural preservation, diaspora solidarity, and the advancement of our communities
                through structured governance, events, and youth engagement.
              </p>
              <Button asChild variant="primary" size="lg">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Principles grid */}
            <div className="grid grid-cols-2 gap-4">
              {principles.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-amber-600/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1.5">{title}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR IMPACT ── */}
      <ImpactSection />

      {/* ── UPCOMING EVENTS ── */}
      {upcomingEvents.length > 0 && (
        <UpcomingEventsSection events={upcomingEvents} />
      )}

      {/* ── OUR CHAPTERS ── */}
      <section className="py-16 md:py-24 bg-zinc-900 border-t border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
            {/* Numbered list */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
                Our Chapters
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Active chapters spread across 6 countries
              </h2>
              <div className="divide-y divide-zinc-800">
                {branches.slice(0, 8).map((branch, i) => (
                  <Link
                    key={branch.slug}
                    href={`/branches/${branch.slug}`}
                    className="flex items-center gap-4 py-4 group hover:bg-zinc-800/40 -mx-3 px-3 rounded-xl transition-colors"
                  >
                    <span className="text-zinc-600 font-mono text-sm shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}/
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors">
                        {branch.name}
                      </h4>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {branch.city}, {branch.country} {branch.flag}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="border-zinc-700! text-zinc-300! hover:bg-zinc-800! hover:text-white!"
                >
                  <Link href="/branches" className="flex items-center gap-2">
                    View All Chapters <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quote + network card */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="bg-amber-600/10 border border-amber-600/20 rounded-2xl p-7 flex-1">
                <div className="text-amber-400 text-5xl font-serif leading-none mb-4">&quot;</div>
                <p className="text-zinc-300 text-base leading-relaxed mb-6">
                  OCA-EU brings together the vibrant Oroko diaspora from across Europe, creating a unified
                  voice that honours our heritage while building a better future for our communities.
                </p>
                <div className="flex items-center gap-3 border-t border-amber-600/20 pt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-amber-600/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://res.cloudinary.com/dkd3k6eau/image/upload/v1766575377/kix9kd3i4kd6vq7wxc32.jpg" alt="Iya Iye" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Iya Iye</p>
                    <p className="text-amber-400/70 text-xs">President, OCA-EU</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5 flex items-center gap-4">
                <Globe className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm">Pan-European Network</p>
                  <p className="text-zinc-400 text-xs">Germany · France · Belgium · UK · Ireland · Finland</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE BOARD ── */}
      <section className="py-16 md:py-24 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Meet our executive board
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700! text-zinc-300! hover:bg-zinc-800! hover:text-white! shrink-0 self-start sm:self-auto"
            >
              <Link href="/members" className="flex items-center gap-2">
                Meet All Members <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {executives.map((member) => (
              <div
                key={member.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center hover:border-amber-600/40 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-zinc-700 group-hover:border-amber-600/50 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-semibold text-sm leading-snug mb-1">{member.name}</h4>
                <p className="text-zinc-500 text-xs leading-snug">
                  {member.role.split('–')[0].trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-amber-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-100/70 mb-4 block">
            Build Your Future Better
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Be Part of Something Bigger
          </h2>
          <p className="text-amber-100 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Join thousands of members across Europe who are building stronger communities, celebrating
            shared heritage, and creating real impact through OCA-EU.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white! text-amber-700! hover:bg-amber-50! w-full sm:w-auto"
            >
              <Link href="/contact">Join OCA-EU</Link>
            </Button>
            <DonateButton
              size="lg"
              variant="outline"
              label="Support Us"
              className="border-white! text-white! hover:bg-white/10! w-full sm:w-auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

