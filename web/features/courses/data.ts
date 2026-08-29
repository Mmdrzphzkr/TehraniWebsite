import type { CourseWorkshop } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

type StrapiCourseResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    type: 'COURSE' | 'WORKSHOP';
    shortDescription: string;
    startDate: string;
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

const fallbackCourses: CourseWorkshop[] = [
  {
    id: 'course-1',
    title: 'دوره مقدماتی بازیگری سینما و تلویزیون',
    slug: 'beginner-acting-course',
    type: 'COURSE',
    shortDescription: 'آشنایی با اصول بازیگری، تکنیک‌های کار مقابل دوربین و تمرین‌های عملی.',
    instructors: [
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
    ],
    startDate: '۱۴۰۵/۰۶/۰۱',
    venue: 'سالن ۱',
    totalCapacity: 20,
    remainingCapacity: 5,
    isFull: false,
    price: 2500000,
  },
  {
    id: 'course-2',
    title: 'کارگاه تمرین صحنه',
    slug: 'scene-practice-workshop',
    type: 'WORKSHOP',
    shortDescription: 'تمرین عملی صحنه‌های مختلف در محیطی تئاتری و سینمایی.',
    instructors: [
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
    ],
    startDate: '۱۴۰۵/۰۶/۱۵',
    venue: 'استودیو',
    totalCapacity: 15,
    remainingCapacity: 0,
    isFull: true,
    price: 1800000,
  },
];

async function fetchCoursesFromStrapi(): Promise<CourseWorkshop[]> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackCourses;
  }

  try {
    // console.log(`Server  Fetching courses from Strapi at ${strapiUrl}...`);
    // console.log(`Server  Using Strapi token: ${strapiToken ? '✅ Present' : '❌ Missing'}`);

    const url = `${strapiUrl}/api/course-workshops?populate=instructors,instructors.category&pagination[pageSize]=100`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch courses from Strapi, using fallback content`);
      return fallbackCourses;
    }

    const result = (await response.json()) as StrapiCourseResponse;
    // console.log(`✅ Fetched ${result.data?.length || 0} courses from Strapi`);

    if (!result.data || result.data.length === 0) {
      return fallbackCourses;
    }

    return result.data.map((course) => ({
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
    }));
  } catch (error) {
    console.error('Error fetching courses from Strapi:', error);
    return fallbackCourses;
  }
}

export async function getCoursesData(): Promise<CourseWorkshop[]> {
  return fetchCoursesFromStrapi();
}

export async function getCoursesPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<PaginatedResponse<CourseWorkshop>> {
  if (!strapiUrl) {
    const allCourses = fallbackCourses;
    const totalPages = Math.ceil(allCourses.length / pageSize);
    return {
      data: allCourses.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allCourses.length,
      },
    };
  }

  try {
    const url = `${strapiUrl}/api/course-workshops?populate=instructors,instructors.category&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const allCourses = fallbackCourses;
      const totalPages = Math.ceil(allCourses.length / pageSize);
      return {
        data: allCourses.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allCourses.length,
        },
      };
    }

    const result = (await response.json()) as StrapiCourseResponse;

    if (!result.data || result.data.length === 0) {
      const allCourses = fallbackCourses;
      const totalPages = Math.ceil(allCourses.length / pageSize);
      return {
        data: allCourses.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allCourses.length,
        },
      };
    }

    const courses = result.data.map((course) => ({
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
    }));

    return {
      data: courses,
      pagination: {
        page: result.meta?.pagination?.page || page,
        pageSize: result.meta?.pagination?.pageSize || pageSize,
        pageCount: result.meta?.pagination?.pageCount || 1,
        total: result.meta?.pagination?.total || courses.length,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated courses from Strapi:', error);
    const allCourses = fallbackCourses;
    const totalPages = Math.ceil(allCourses.length / pageSize);
    return {
      data: allCourses.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allCourses.length,
      },
    };
  }
}
