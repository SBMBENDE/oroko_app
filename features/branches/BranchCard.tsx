import Link from 'next/link';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import type { Branch } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Link href={`/branches/${branch.slug}`} className="block group">
      <Card
        className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1"
        data-card
      >
        {/* Cover / Flag gradient */}
        <div className="relative h-40 bg-linear-to-br from-stone-800 to-stone-900 flex items-center justify-center overflow-hidden">
          <span className="text-5xl">{branch.flag}</span>
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-xs font-medium text-white/70 uppercase tracking-widest">
              Founded {branch.founded}
            </span>
          </div>
        </div>

        <CardContent>
          <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors">
            {branch.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 mb-3 text-sm text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>{branch.city}, {branch.country}</span>
          </div>

          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
            {branch.shortDescription}
          </p>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Users className="w-3.5 h-3.5" />
              <span>Active chapter</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
