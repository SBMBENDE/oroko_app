import Link from 'next/link';
import { ExternalLink, Users, Calendar } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
// ...existing code...
import { formatDate } from '@/lib/utils';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PROJECT_CATEGORY_COLORS,
} from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card data-card className="h-full flex flex-col group">
      {/* Category colour bar */}
      <div
        className={`h-1.5 ${PROJECT_CATEGORY_COLORS[project.category].split(' ')[0].replace('text', 'bg').replace('-800', '-400').replace('-100', '-500')}`}
      />

      <CardContent className="flex flex-col flex-1 pt-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${STATUS_COLORS[project.status]}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                project.status === 'active'
                  ? 'bg-green-500'
                  : project.status === 'upcoming'
                  ? 'bg-blue-500'
                  : 'bg-stone-400'
              }`}
            />
            {STATUS_LABELS[project.status]}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${PROJECT_CATEGORY_COLORS[project.category]}`}
          >
            {project.category}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-bold text-stone-900 text-base leading-snug mb-2 group-hover:text-amber-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>

        {/* Impact */}
        {project.impactMetric && (
          <div className="mb-4 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs font-semibold text-amber-800">{project.impactMetric}</p>
          </div>
        )}

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Led by {project.lead}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Since {formatDate(project.startDate)}
              {project.endDate ? ` → ${formatDate(project.endDate)}` : ''}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Branch chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.branchSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/branches/${slug}`}
              className="text-xs bg-stone-900 text-white rounded-full px-2 py-0.5 hover:bg-amber-700 transition-colors capitalize"
            >
              {slug}
            </Link>
          ))}
        </div>

        {/* Website link */}
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors mt-auto group/link"
          >
            Learn more
            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
