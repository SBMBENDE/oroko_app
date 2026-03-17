'use client';

import { cn } from '@/lib/utils';

const BRANCH_FLAGS: Record<string, string> = {
  france: '🇫🇷',
  uk: '🇬🇧',
  belgium: '🇧🇪',
  finland: '🇫🇮',
  ireland: '🇮🇹',
  germany: '🇩🇪',
};

interface BranchFilterProps {
  branches: string[];
  selected: string;
  onChange: (branch: string) => void;
  counts: Record<string, number>;
}

export function BranchFilter({ branches, selected, onChange, counts }: BranchFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
          selected === 'all'
            ? 'bg-stone-900 text-white shadow-sm'
            : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-800'
        )}
      >
        All Members
        <span className={cn(
          'text-xs rounded-full px-1.5 py-0.5 font-semibold tabular-nums',
          selected === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
        )}>
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {branches.map((branch) => (
        <button
          key={branch}
          onClick={() => onChange(branch)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
            selected === branch
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-800'
          )}
        >
          <span>{BRANCH_FLAGS[branch]}</span>
          <span className="capitalize">{branch}</span>
          {counts[branch] !== undefined && (
            <span className={cn(
              'text-xs rounded-full px-1.5 py-0.5 font-semibold tabular-nums',
              selected === branch ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            )}>
              {counts[branch]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
