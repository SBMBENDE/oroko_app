import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}

export function Section({ children, className, id, tight }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('w-full', tight ? 'py-8 md:py-16' : 'py-10 md:py-24', className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ title, subtitle, centered, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-6 md:mb-12', centered && 'text-center', className)}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base md:text-lg text-stone-500 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
