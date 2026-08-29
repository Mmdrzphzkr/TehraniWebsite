/**
 * Shared content-model types for the public frontend.
 *
 * These mirror the Strapi v5 content types defined in `cms/src/api/**` and the
 * domain model documented in DESIGN.md (sections 10-16). Keeping them here lets
 * `features/*` service functions return strongly-typed data whether it comes
 * from mock fixtures (current state) or a real Strapi fetch (future state).
 */

export type PublicationStatus = 'DRAFT' | 'PUBLISHED';

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface InstructorCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Instructor {
  id: string;
  name: string;
  slug: string;
  title: string;
  category: InstructorCategory;
  avatarColor: string; // temporary placeholder swatch until real media is wired
}

export type CourseWorkshopType = 'COURSE' | 'WORKSHOP';

export interface CourseWorkshop {
  id: string;
  title: string;
  slug: string;
  type: CourseWorkshopType;
  shortDescription: string;
  instructors: Instructor[];
  startDate: string;
  venue: string;
  totalCapacity: number;
  remainingCapacity: number;
  isFull: boolean;
  price: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  date: string;
  time: string;
  venue: string;
  isFull: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  publicationDate: string;
  readMinutes: number;
}

export type MediaType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'INTERVIEW' | 'EDUCATIONAL' | 'OTHER';

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  mediaType: MediaType;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  highlight: string;
  supportingCopy: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: Array<{ label: string; value: string }>;
}

export interface FounderContent {
  name: string;
  role: string;
  bio: string;
  cta: { label: string; href: string };
}

export interface RentalContent {
  intro: string;
  features: Array<{ title: string; description: string }>;
  cta: { label: string; href: string };
}

export interface ContactContent {
  headline: string;
  supportingCopy: string;
  phone: string;
  address: string;
  cta: { label: string; href: string };
}

export interface HomepageContent {
  hero: HeroContent;
  introduction: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: { label: string; href: string };
    stats: Array<{ label: string; value: string }>;
  };
  courses: CourseWorkshop[];
  events: EventItem[];
  instructors: Instructor[];
  founder: FounderContent;
  articles: Article[];
  mediaItems: MediaItem[];
  rental: RentalContent;
  contact: ContactContent;
}
