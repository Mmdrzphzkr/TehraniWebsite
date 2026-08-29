import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

type Tone = 'red' | 'gold' | 'navy' | 'green' | 'neutral';

const toneClasses: Record<Tone, string> = {
  red: 'bg-brand-red/10 text-brand-red',
  gold: 'bg-brand-gold/15 text-brand-gold-dark',
  navy: 'bg-brand-navy/10 text-brand-navy',
  green: 'bg-brand-green/10 text-brand-green',
  neutral: 'bg-slate-100 text-slate-600'
};

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-bold', toneClasses[tone], className)}>
      {children}
    </span>
  );
}
