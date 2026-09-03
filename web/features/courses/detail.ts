import type { CourseWorkshop } from '../../lib/types/cms';
import { getCoursesData } from './data';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

type StrapiCourseDetailResponse = {
  data: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    type: 'COURSE' | 'WORKSHOP';
    shortDescription: string;
    longDescription?: string;
    startDate: string;
    endDate?: string;
    venue: string;
    totalCapacity: number;
    remainingCapacity: number;
    isFull: boolean;
    price: number;
    instructors?: Array<{
      id: number;
      documentId?: string;
      name: string;
      slug: string;
      title: string;
      avatarColor?: string;
      category?: {
        id: number;
        name: string;
        slug: string;
      };
    }>;
  }>;
};

export async function getCourseBySlug(slug: string): Promise<CourseWorkshop | null> {
  if (!strapiUrl) {
    const courses = await getCoursesData();
    return courses.find((c) => c.slug === slug) || null;
  }

  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `${strapiUrl}/api/course-workshops?filters[slug][$eq]=${encodedSlug}&populate=instructors,instructors.category`;
    // console.log(`[Courses Detail] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`[Courses Detail] Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Courses Detail] Strapi responded with ${response.status}, using fallback`);
      const courses = await getCoursesData();
      return courses.find((c) => c.slug === slug) || null;
    }

    const result = (await response.json()) as StrapiCourseDetailResponse;
    // console.log(`[Courses Detail] Got ${result.data?.length || 0} courses from Strapi`);

    if (!result.data || result.data.length === 0) {
      console.warn(`[Courses Detail] No course found with slug: ${slug}, using fallback`);
      const courses = await getCoursesData();
      return courses.find((c) => c.slug === slug) || null;
    }

    const course = result.data[0];
    // console.log(`[Courses Detail] Found course: ${course.title}`);

    return {
      id: course.documentId,
      title: course.title,
      slug: course.slug,
      type: course.type,
      shortDescription: course.shortDescription,
      instructors: course.instructors?.map((instructor) => ({
        id: instructor.documentId || String(instructor.id),
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
      })) || [
        {
          id: 'unknown',
          name: 'نامشخص',
          slug: 'unknown',
          title: 'مدرس',
          avatarColor: 'brand-navy',
          category: {
            id: 'uncategorized',
            name: 'بدون دسته‌بندی',
            slug: 'uncategorized',
          },
        },
      ],
      startDate: course.startDate,
      venue: course.venue,
      totalCapacity: course.totalCapacity,
      remainingCapacity: course.remainingCapacity,
      isFull: course.isFull,
      price: course.price,
    };
  } catch (error) {
    console.error('[Courses Detail] Error fetching course detail:', error);
    const courses = await getCoursesData();
    return courses.find((c) => c.slug === slug) || null;
  }
}

export async function getCoursesSlugs(): Promise<string[]> {
  const courses = await getCoursesData();
  return courses.map((c) => c.slug);
}
