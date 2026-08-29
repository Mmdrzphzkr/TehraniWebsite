import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline-light';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-gold text-brand-navy-dark hover:bg-brand-gold-dark',
  secondary: 'bg-brand-navy text-brand-cream hover:bg-brand-navy-dark',
  ghost: 'bg-transparent text-brand-navy hover:bg-brand-navy/5',
  'outline-light': 'border border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10'
};

export function Button({
  href,
  children,
  variant = 'primary',
  className,
  icon
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors duration-200',
        variantClasses[variant],
        className
      )}
    >
      {children}
      {icon}
    </Link>
  );
}
