'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DonateButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  branchSlug?: string;
  label?: string;
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2',
};

const variants = {
  solid: 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-600',
  outline: 'border border-amber-400 text-amber-300 hover:bg-amber-600 hover:text-white hover:border-amber-600',
  ghost: 'text-amber-400 hover:text-amber-300 hover:bg-amber-600/10',
};

export function DonateButton({
  className,
  size = 'md',
  variant = 'solid',
  branchSlug,
  label = 'Donate',
}: DonateButtonProps) {
  const href = branchSlug ? `/donate?branch=${branchSlug}` : '/donate';

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
        sizes[size],
        variants[variant],
        className
      )}
    >
      <Heart className={cn('shrink-0 fill-current', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      {label}
    </Link>
  );
}
