'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

type Clause = string | { id: string; text: string; sub?: string[] };
type Article = { number: string; title: string; content: Clause[] };

export function ArticlesAccordion({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (number: string) =>
    setOpen((prev) => (prev === number ? null : number));

  return (
    <div className="space-y-3">
      {articles.map((article) => {
        const isOpen = open === article.number;
        return (
        <div
          key={article.number}
          id={`article-${article.number}`}
          className="scroll-mt-24"
        >
            <Card className="overflow-hidden">
            {/* Header — always visible, acts as toggle */}
            <button
              onClick={() => toggle(article.number)}
              aria-expanded={isOpen}
              className="w-full text-left"
            >
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {article.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">
                    Article {article.number}
                  </p>
                  <h2 className="text-base font-bold text-stone-900 leading-snug">
                    {article.title}
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Content — revealed on open */}
            {isOpen && (
              <CardContent className="pt-0 pb-6 border-t border-stone-100">
                <ol className="space-y-3 pl-2 pt-4">
                  {article.content.map((clause, i) => {
                    if (typeof clause === 'string') {
                      return (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-stone-600 leading-relaxed"
                        >
                          <span className="font-semibold text-stone-400 tabular-nums shrink-0">
                            {article.number}.{i + 1}
                          </span>
                          {clause}
                        </li>
                      );
                    }
                    return (
                      <li key={i} className="text-sm text-stone-600 leading-relaxed">
                        <div className="flex gap-3">
                          <span className="font-semibold text-stone-400 tabular-nums shrink-0">
                            {clause.id}
                          </span>
                          <span>{clause.text}</span>
                        </div>
                        {clause.sub && (
                          <ul className="pl-10 mt-1.5 space-y-1.5">
                            {clause.sub.map((s) => (
                              <li key={s} className="text-xs text-stone-500 leading-relaxed">
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            )}
          </Card>
          </div>
        );
      })}
    </div>
  );
}
