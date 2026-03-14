import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { FlipProjectCard } from '@/features/projects/FlipProjectCard';
import {
  projects,
  getProjectsByStatus,
  PROJECT_CATEGORY_COLORS,
} from '@/data/projects';
import { Lightbulb, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects — OCA-EU',
  description:
    'Discover OCA-EU initiatives and projects — from scholarships and mentorship to cultural festivals and policy advocacy.',
};

const categories = [
  ...new Set(projects.map((p) => p.category)),
] as string[];

const activeProjects = getProjectsByStatus('active');
const upcomingProjects = getProjectsByStatus('upcoming');
const completedProjects = getProjectsByStatus('completed');

const stats = [
  { label: 'Active Projects', value: activeProjects.length, icon: Lightbulb, color: 'text-green-600' },
  { label: 'Upcoming', value: upcomingProjects.length, icon: Clock, color: 'text-blue-600' },
  { label: 'Completed', value: completedProjects.length, icon: CheckCircle, color: 'text-stone-500' },
];

export default function ProjectsPage() {
  return (
    <main>
      {/* Hero */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-2xl py-12">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
            Our Impact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects & Initiatives</h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            From scholarship funds to cultural festivals, OCA-EU runs impactful
            programmes that create lasting change across our European network.
          </p>
        </div>
      </Section>

      {/* Stats bar */}
      <div className="bg-amber-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-amber-500">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4 text-white">
                <Icon className="w-5 h-5 text-amber-100 shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-amber-100 uppercase tracking-widest">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories filter row */}
      <div className="border-b border-stone-100 bg-white sticky top-16 md:top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            <span className="text-xs text-stone-400 uppercase tracking-widest shrink-0 mr-1">Filter:</span>
            {categories.map((cat) => (
              <span
                key={cat}
                className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide cursor-default ${PROJECT_CATEGORY_COLORS[cat]}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Active projects */}
      {activeProjects.length > 0 && (
        <Section>
          <SectionHeading
            title="Active Projects"
            subtitle={`${activeProjects.length} programmes running across our European chapters right now.`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProjects.map((project) => (
              <FlipProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      )}

      {/* Upcoming projects */}
      {upcomingProjects.length > 0 && (
        <Section className="bg-blue-50/50">
          <SectionHeading
            title="Upcoming Programmes"
            subtitle="New initiatives launching soon — stay tuned for registration details."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingProjects.map((project) => (
              <FlipProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      )}

      {/* Completed projects */}
      {completedProjects.length > 0 && (
        <Section className="bg-stone-50">
          <SectionHeading
            title="Completed Projects"
            subtitle="Programmes we have delivered — their impact lives on in our communities."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {completedProjects.map((project) => (
              <FlipProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      )}

      {/* CTA — propose a project */}
      <Section className="bg-stone-950 text-white" tight>
        <div className="max-w-2xl mx-auto text-center py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Have a Project Idea?</h2>
          <p className="text-stone-300 leading-relaxed mb-6">
            OCA-EU members can propose new initiatives for any branch. Submit your
            idea to the board and help shape the future of our community.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 font-medium transition-colors"
          >
            Propose a Project
          </a>
          <a
            href="/donate"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400 text-amber-300 hover:bg-amber-600 hover:text-white hover:border-amber-600 px-6 py-3 font-medium transition-colors"
          >
            ❤ Donate to Support Projects
          </a>
        </div>
      </Section>
    </main>
  );
}
