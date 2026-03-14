'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type TocEntry = {
  number: string;
  title: string;
  sub: string[];
};

export function TocAccordion({ tocData }: { tocData: TocEntry[] }) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (number: string) =>
    setOpen((prev) => (prev === number ? null : number));

  return (
    <div className="divide-y divide-stone-100">
      {tocData.map((a) => {
        const isOpen = open === a.number;
        const hasSub = a.sub.length > 0;

        return (
          <div key={a.number}>
            <div className="flex items-center gap-2 py-2.5">
              {/* Article link */}
              <a
                href={`#article-${a.number}`}
                className="flex-1 flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors group"
              >
                <span className="text-stone-400 tabular-nums shrink-0 text-xs">
                  Art.&nbsp;{a.number}
                </span>
                {a.title}
              </a>

              {/* Expand toggle — only shown when there are sub-items */}
              {hasSub && (
                <button
                  onClick={() => toggle(a.number)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} Article ${a.number}`}
                  className="p-1 rounded-md text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors shrink-0"
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>
              )}
            </div>

            {/* Sub-items */}
            {hasSub && isOpen && (
              <ul className="pl-4 pb-2 space-y-0.5">
                {a.sub.map((item) => {
                  const dots = (item.match(/\./g) || []).length;
                  const indent = dots <= 1 ? '' : dots === 2 ? 'pl-4' : 'pl-8';
                  const weight =
                    dots <= 1 ? 'font-medium text-stone-600' : 'text-stone-400';
                  return (
                    <li key={item} className={`text-xs py-0.5 ${indent} ${weight}`}>
                      {item}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
