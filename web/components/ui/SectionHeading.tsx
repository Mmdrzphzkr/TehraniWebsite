import Link from 'next/link';
import { IconArrow } from './icons';
import { cn } from '../../lib/utils/cn';

export function SectionHeading({
  eyebrow,
  heading,
  description,
  viewAllHref,
  viewAllLabel = 'مشاهده همه',
  tone = 'dark'
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  tone?: 'dark' | 'light';
}) {
  const isLight = tone === 'light';
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide',
            isLight ? 'bg-brand-cream/10 text-brand-gold' : 'bg-brand-red/10 text-brand-red'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {eyebrow}
        </span>
        <h2
          className={cn(
            'mt-3 text-2xl font-extrabold sm:text-3xl',
            isLight ? 'text-brand-cream' : 'text-brand-navy-dark'
          )}
        >
          {heading}
        </h2>
        {description ? (
          <p className={cn('mt-3 text-base leading-relaxed', isLight ? 'text-brand-cream/70' : 'text-slate-600')}>
            {description}
          </p>
        ) : null}
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-bold sm:self-auto',
            isLight ? 'text-brand-gold hover:text-brand-gold-light' : 'text-brand-navy hover:text-brand-red'
          )}
        >
          {viewAllLabel}
          <IconArrow className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}
