'use client';

import ToPersianDigits from '@/lib/utils/toFarsiDigits';
import { useCountUp } from '@/lib/utils/useCountUp';

interface StatCounterProps {
  value: number | string;
}

/**
 * Component that displays a stat value with a smooth count-up animation.
 * The value animates from 0 to the target value over 2.5 seconds when mounted.
 */
export function StatCounter({ value }: StatCounterProps) {
  const animatedCount = useCountUp(value);

  return <>{ToPersianDigits(animatedCount)}</>;
}
