import type { Instructor } from '../../lib/types/cms';
import { getInstructorsData } from './data';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

type StrapiInstructorDetailResponse = {
  data: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
    title: string;
    bio?: string;
    expertise?: string;
    avatar?: {
      url: string;
    };
    avatarColor?: string;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
};

export async function getInstructorBySlug(slug: string): Promise<Instructor | null> {
  if (!strapiUrl) {
    const instructors = await getInstructorsData();
    return instructors.find((i) => i.slug === slug) || null;
  }

  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `${strapiUrl}/api/instructors?filters[slug][$eq]=${encodedSlug}&populate=category,avatar`;
    // console.log(`[Instructors Detail] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`[Instructors Detail] Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Instructors Detail] Strapi responded with ${response.status}, using fallback`);
      const instructors = await getInstructorsData();
      return instructors.find((i) => i.slug === slug) || null;
    }

    const result = (await response.json()) as StrapiInstructorDetailResponse;
    // console.log(`[Instructors Detail] Got ${result.data?.length || 0} instructors from Strapi`);

    if (!result.data || result.data.length === 0) {
      console.warn(`[Instructors Detail] No instructor found with slug: ${slug}, using fallback`);
      const instructors = await getInstructorsData();
      return instructors.find((i) => i.slug === slug) || null;
    }

    const instructor = result.data[0];
    // console.log(`[Instructors Detail] Found instructor: ${instructor.name}`);

    return {
      id: instructor.documentId,
      name: instructor.name,
      slug: instructor.slug,
      title: instructor.title,
      avatarColor: instructor.avatarColor || 'brand-navy',
      category: instructor.category
        ? {
            id: String(instructor.category.id),
            name: instructor.category.name,
            slug: instructor.category.slug,
          }
        : {
            id: 'uncategorized',
            name: 'بدون دسته‌بندی',
            slug: 'uncategorized',
          },
    };
  } catch (error) {
    console.error('[Instructors Detail] Error fetching instructor detail:', error);
    const instructors = await getInstructorsData();
    return instructors.find((i) => i.slug === slug) || null;
  }
}

export async function getInstructorsSlugs(): Promise<string[]> {
  const instructors = await getInstructorsData();
  return instructors.map((i) => i.slug);
}
