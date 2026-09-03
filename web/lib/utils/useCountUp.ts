import { useState, useEffect } from 'react';
import NormalizeNumber from '@/lib/utils/normalizeNumber';
/**
 * Hook for animating a number count-up from 0 to a target value.
 * Starts animation when component mounts and completes over a specified duration.
 *
 * @param targetValue - The final value to count up to
 * @param duration - Duration in milliseconds (default 2500ms)
 * @returns The current animated value (0 to targetValue)
 */
export function useCountUp(targetValue: number | string, duration = 2500): number {
  const target = typeof targetValue === 'string' ? NormalizeNumber(targetValue) : targetValue;
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Non-numeric values should display as-is
    if (isNaN(target)) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count;
}
