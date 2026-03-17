import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { ArrowRight, MapPin, Users, Globe } from 'lucide-react';
import { ClanSection } from '@/features/about/ClanSection';
import { ValuesGrid } from '@/features/about/ValuesGrid';

export const metadata: Metadata = {
  title: 'About OCA-EU',
  description:
    'Learn about OCA-EU, our mission, values, and the communities we serve across Europe.',
};

const values = [
  {
    title: 'Culture & Identity',
    description:
      'We celebrate the diversity of the Oroko community while finding strength in shared heritage and collective identity.',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458758/WhatsApp_Image_2026-03-13_at_20.53.02_5_cqbkxr.jpg',
  },
  {
    title: 'Our Constitution',
    description:
      'Our constitution is the supreme governing document of OCA-EU — defining our structure, rights, responsibilities, and the principles that bind every member and branch across Europe.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    cta: { label: 'Read the Constitution', href: '/constitution' },
  },
  {
    title: 'Excellence & Ambition',
    description:
      'We champion professional development, education, and entrepreneurship as pathways to self-determination.',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458706/WhatsApp_Image_2026-03-13_at_20.48.23_fvy31z.jpg',
  },
  {
    title: 'Solidarity & Mutual Aid',
    description:
      'We stand united in supporting our members through challenging times, fostering collective care and welfare initiatives while building trusted networks that transcend borders.',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458707/WhatsApp_Image_2026-03-13_at_20.52.59_7_kytdou.jpg',
  },
];

const missionRootsCards = [
  {
    title: 'Our Mission',
    description:
      'To empower, promote, and preserve Oroko culture, language and development in Europe and the Oroko regions in Cameroon. As a non-profit and apolitical organisation, we unite our communities through shared values, mutual aid, and a commitment to lasting impact.',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458758/WhatsApp_Image_2026-03-13_at_20.53.02_4_kjrmag.jpg',
  },
  {
    title: 'Our Roots',
    description:
      'Found in the SouthWest Region of Cameroon across the Meme and Ndian divisions, the Oroko people — historically known as the Balondos — adopted the name "Oroko", meaning "welcome". Made up of 10 distinct clans, they are the largest tribe in the South West Region, now thriving across Europe.',
    image: 'https://res.cloudinary.com/dkd3k6eau/image/upload/v1773458744/WhatsApp_Image_2026-03-13_at_20.53.01_6_tzsjhc.jpg',
  },
];

const stats = [
  { icon: Globe, value: '6+', label: 'European countries' },
  { icon: Users, value: '800+', label: 'Active members' },
  { icon: MapPin, value: '10', label: 'Branches across Europe' },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-stone-950 text-white overflow-hidden">
        {/* Ambient gradient blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-800/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:py-24 md:py-32">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Who We Are
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-4 sm:mb-6 max-w-3xl">
            Connecting the{' '}
            <span className="text-amber-400">Oroko Community</span>{' '}
            Across Europe
          </h1>

          {/* Description */}
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-7 sm:mb-10">
            OCA-EU is a{' '}
            <span className="text-white font-medium">non-profit and apolitical organization</span>{' '}
            promoting the socio-cultural and economic development of the Oroko culture in Europe
            and in Oroko areas in Cameroon while protecting and catering for the interests of its
            members across all European branches.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 sm:gap-10">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white leading-none">{value}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── Mission + Roots side by side ─────────────────────────────── */}
      <Section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <ValuesGrid cards={missionRootsCards} cardHeight={360} />
        </div>
      </Section>

      {/* ── Ten Oroko Clans ──────────────────────────────────────────── */}
      <ClanSection />

      {/* ── Values ───────────────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <span className="inline-block text-amber-600 text-xs font-semibold uppercase tracking-widest mb-3">
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4">
            Our Guiding Principles
          </h2>
          <p className="text-stone-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            The core values that unite us, shape our community, and drive our actions across Europe and beyond.
          </p>
        </div>

        <ValuesGrid cards={values} />
      </Section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="bg-stone-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Be part of the story
          </h2>
          <p className="text-stone-400 text-base mb-8 max-w-xl mx-auto">
            Join hundreds of Oroko members building community, preserving culture, and creating
            real impact across at home & abroad.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/members"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-colors"
            >
              Meet Our Members
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
