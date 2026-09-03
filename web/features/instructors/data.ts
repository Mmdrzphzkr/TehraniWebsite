import type { Instructor } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

type StrapiInstructorResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
    title: string;
    avatarColor?: string;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
  }> | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

const fallbackInstructors: Instructor[] = [
  {
    id: 'instructor-1',
    name: 'علی اسلامی',
    slug: 'ali-eslami',
    title: 'مدرس و کارگردان',
    avatarColor: 'brand-red',
    category: {
      id: 'cat-1',
      name: 'بازیگری',
      slug: 'acting',
    },
  },
  {
    id: 'instructor-2',
    name: 'حسن رضایی',
    slug: 'hassan-rezaei',
    title: 'کارگردان و بازیگر',
    avatarColor: 'brand-navy',
    category: {
      id: 'cat-1',
      name: 'بازیگری',
      slug: 'acting',
    },
  },
  {
    id: 'instructor-3',
    name: 'فاطمه احمدی',
    slug: 'fateme-ahmadi',
    title: 'تئوری‌پرداز سینما',
    avatarColor: 'brand-teal',
    category: {
      id: 'cat-2',
      name: 'تئوری سینما',
      slug: 'cinema-theory',
    },
  },
];

async function fetchInstructorsFromStrapi(): Promise<Instructor[]> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackInstructors;
  }

  try {
    // console.log(`Server  Fetching instructors from Strapi at ${strapiUrl}...`);

    const url = `${strapiUrl}/api/instructors?populate=category&pagination[pageSize]=100`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch instructors from Strapi, using fallback content`);
      return fallbackInstructors;
    }

    const result = (await response.json()) as StrapiInstructorResponse;
    // console.log(`✅ Fetched ${result.data?.length || 0} instructors from Strapi`);

    if (!result.data || result.data.length === 0) {
      return fallbackInstructors;
    }

    return result.data.map((instructor) => ({
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
    }));
  } catch (error) {
    console.error('Error fetching instructors from Strapi:', error);
    return fallbackInstructors;
  }
}

export async function getInstructorsData(): Promise<Instructor[]> {
  return fetchInstructorsFromStrapi();
}

export async function getInstructorsPaginated(
  page: number = 1,
  pageSize: number = 8
): Promise<PaginatedResponse<Instructor>> {
  if (!strapiUrl) {
    const allInstructors = fallbackInstructors;
    const totalPages = Math.ceil(allInstructors.length / pageSize);
    return {
      data: allInstructors.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allInstructors.length,
      },
    };
  }

  try {
    const url = `${strapiUrl}/api/instructors?populate=category&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const allInstructors = fallbackInstructors;
      const totalPages = Math.ceil(allInstructors.length / pageSize);
      return {
        data: allInstructors.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allInstructors.length,
        },
      };
    }

    const result = (await response.json()) as StrapiInstructorResponse;

    if (!result.data || result.data.length === 0) {
      const allInstructors = fallbackInstructors;
      const totalPages = Math.ceil(allInstructors.length / pageSize);
      return {
        data: allInstructors.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allInstructors.length,
        },
      };
    }

    const instructors = result.data.map((instructor) => ({
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
    }));

    return {
      data: instructors,
      pagination: {
        page: result.meta?.pagination?.page || page,
        pageSize: result.meta?.pagination?.pageSize || pageSize,
        pageCount: result.meta?.pagination?.pageCount || 1,
        total: result.meta?.pagination?.total || instructors.length,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated instructors from Strapi:', error);
    const allInstructors = fallbackInstructors;
    const totalPages = Math.ceil(allInstructors.length / pageSize);
    return {
      data: allInstructors.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allInstructors.length,
      },
    };
  }
}
