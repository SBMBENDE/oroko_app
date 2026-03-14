'use client';

import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Calendar, Users, ExternalLink, RotateCcw } from 'lucide-react';
import type { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  PROJECT_CATEGORY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '@/data/projects';

const CATEGORY_GRADIENT: Record<string, string> = {
  education: 'from-blue-900 to-blue-700',
  entrepreneurship: 'from-amber-900 to-amber-700',
  culture: 'from-purple-900 to-purple-700',
  advocacy: 'from-red-900 to-red-700',
  health: 'from-green-900 to-green-700',
  technology: 'from-cyan-900 to-cyan-700',
};

interface FlipProjectCardProps {
  project: Project;
}

export function FlipProjectCard({ project }: FlipProjectCardProps) {
  const [flipped, setFlipped] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const flip = useCallback(() => {
    if (!innerRef.current) return;
    const next = !flipped;
    gsap.to(innerRef.current, {
      rotateY: next ? 180 : 0,
      duration: 0.55,
      ease: 'power3.inOut',
    });
    setFlipped(next);
  }, [flipped]);

  // Subtle image parallax on mouse move (front face only)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (flipped || !bgRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
      gsap.to(bgRef.current, {
        x,
        y,
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    [flipped]
  );

  const handleMouseLeave = useCallback(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  const gradient = CATEGORY_GRADIENT[project.category] ?? 'from-stone-900 to-stone-700';

  return (
    <div
      className="relative h-72 cursor-pointer select-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl rounded-2xl"
      style={{ perspective: '1200px' }}
      onClick={flip}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={`${project.title} — click to see details`}
    >
      {/* Inner rotating wrapper */}
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Gradient background with parallax travel room (oversized) */}
          <div
            ref={bgRef}
            className={`absolute inset-[-10%] bg-linear-to-br ${gradient}`}
          />
          {/* Dark vignette for text legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            {/* Top row: status + hint */}
            <div className="flex justify-between items-start">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide shadow-sm ${STATUS_COLORS[project.status]}`}
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
              <span className="text-white/50 text-xs font-medium tracking-wide">
                tap to flip
              </span>
            </div>

            {/* Bottom: category + title */}
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide mb-2 ${PROJECT_CATEGORY_COLORS[project.category]}`}
              >
                {project.category}
              </span>
              <h3 className="text-white font-bold text-lg leading-snug drop-shadow-sm">
                {project.title}
              </h3>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md shadow-xl p-5 flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Category accent bar */}
          <div className={`h-1 rounded-full mb-3 bg-linear-to-r ${gradient}`} />

          {/* Description */}
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-3 flex-1">
            {project.description}
          </p>

          {/* Impact metric */}
          {project.impactMetric && (
            <div className="mb-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs font-semibold text-amber-800">
                {project.impactMetric}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Led by {project.lead}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                {formatDate(project.startDate)}
                {project.endDate ? ` → ${formatDate(project.endDate)}` : ''}
              </span>
            </div>
          </div>

          {/* Branch chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.branchSlugs.slice(0, 4).map((slug) => (
              <span
                key={slug}
                className="text-xs bg-stone-900 text-white rounded-full px-2 py-0.5 capitalize"
              >
                {slug}
              </span>
            ))}
            {project.branchSlugs.length > 4 && (
              <span className="text-xs bg-stone-100 text-stone-400 rounded-full px-2 py-0.5">
                +{project.branchSlugs.length - 4}
              </span>
            )}
          </div>

          {/* Footer: CTA + flip back */}
          <div className="flex items-center">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View details
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                flip();
              }}
            >
              <RotateCcw className="w-3 h-3" />
              flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
