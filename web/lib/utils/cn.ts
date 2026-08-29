/**
 * Tiny class-name combiner. Filters falsy values and joins with a space.
 * Kept dependency-free (no clsx/tailwind-merge) since the need here is minimal.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
