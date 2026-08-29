import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

const toneGradients: Record<string, string> = {
  'brand-red': 'from-brand-red via-brand-red-dark to-brand-navy-dark',
  'brand-gold': 'from-brand-gold via-brand-gold-dark to-brand-navy-dark',
  'brand-navy': 'from-brand-navy via-brand-navy-dark to-black',
  'brand-green': 'from-brand-green via-brand-green-dark to-brand-navy-dark'
};

/**
 * Stand-in for real photography/video until CMS media assets are wired.
 * Renders a brand-colored gradient block with an optional icon/overlay so
 * layouts read correctly without depending on external image files.
 */
export function PlaceholderMedia({
  tone = 'brand-navy',
  className,
  children
}: {
  tone?: keyof typeof toneGradients;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        toneGradients[tone],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 18px)'
        }}
      />
      {children}
    </div>
  );
}
