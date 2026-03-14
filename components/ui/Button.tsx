import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from '@/lib/types';
import { type ButtonHTMLAttributes } from 'react';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500',
  secondary:
    'bg-stone-900 text-white hover:bg-stone-800 focus-visible:ring-stone-500',
  outline:
    'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white focus-visible:ring-stone-500',
  ghost:
    'text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  asChild: _asChild, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
