import type { EventItem } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

type StrapiEventResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    shortDescription: string;
    date: string;
    time: string;
    venue: string;
    isFull: boolean;
    category?: {
      id: number;
      name: string;
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

const fallbackEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'نمایش فیلم: زمستان روسی',
    slug: 'film-screening-russian-winter',
    category: 'نمایش فیلم',
    shortDescription: 'نمایش فیلم کلاسیک روسی با بحث و گفتگو',
    date: '۱۴۰۵/۰۶/۰۵',
    time: '۲۰:۰۰',
    venue: 'سالن اصلی',
    isFull: false,
  },
  {
    id: 'event-2',
    title: 'گردهمایی بازیگران',
    slug: 'actors-gathering',
    category: 'رویداد',
    shortDescription: 'جلسه گردهمایی و تبادل تجارب برای بازیگران فعال',
    date: '۱۴۰۵/۰۶/۱۲',
    time: '۱۹:۰۰',
    venue: 'کافه مؤسسه',
    isFull: true,
  },
  {
    id: 'event-3',
    title: 'کارگاه درس‌های سینما',
    slug: 'cinema-lessons-workshop',
    category: 'کارگاه',
    shortDescription: 'کارگاه تخصصی درباره تاریخ و نظریه‌های سینما',
    date: '۱۴۰۵/۰۶/۲۰',
    time: '۱۸:۰۰',
    venue: 'سالن ۱',
    isFull: false,
  },
];

async function fetchEventsFromStrapi(): Promise<EventItem[]> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackEvents;
  }

  try {
    // console.log(`Server  Fetching events from Strapi at ${strapiUrl}...`);

    const url = `${strapiUrl}/api/events?populate=category&pagination[pageSize]=100`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch events from Strapi, using fallback content`);
      return fallbackEvents;
    }

    const result = (await response.json()) as StrapiEventResponse;
    // console.log(`✅ Fetched ${result.data?.length || 0} events from Strapi`);

    if (!result.data || result.data.length === 0) {
      return fallbackEvents;
    }

    return result.data.map((event) => ({
      id: event.documentId,
      title: event.title,
      slug: event.slug,
      category: event.category?.name || 'رویداد',
      shortDescription: event.shortDescription,
      date: event.date,
      time: event.time,
      venue: event.venue,
      isFull: event.isFull,
    }));
  } catch (error) {
    console.error('Error fetching events from Strapi:', error);
    return fallbackEvents;
  }
}

export async function getEventsData(): Promise<EventItem[]> {
  return fetchEventsFromStrapi();
}

export async function getEventsPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<PaginatedResponse<EventItem>> {
  if (!strapiUrl) {
    const allEvents = fallbackEvents;
    const totalPages = Math.ceil(allEvents.length / pageSize);
    return {
      data: allEvents.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allEvents.length,
      },
    };
  }

  try {
    const url = `${strapiUrl}/api/events?populate=category&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const allEvents = fallbackEvents;
      const totalPages = Math.ceil(allEvents.length / pageSize);
      return {
        data: allEvents.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allEvents.length,
        },
      };
    }

    const result = (await response.json()) as StrapiEventResponse;

    if (!result.data || result.data.length === 0) {
      const allEvents = fallbackEvents;
      const totalPages = Math.ceil(allEvents.length / pageSize);
      return {
        data: allEvents.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allEvents.length,
        },
      };
    }

    const events = result.data.map((event) => ({
      id: event.documentId,
      title: event.title,
      slug: event.slug,
      category: event.category?.name || 'رویداد',
      shortDescription: event.shortDescription,
      date: event.date,
      time: event.time,
      venue: event.venue,
      isFull: event.isFull,
    }));

    return {
      data: events,
      pagination: {
        page: result.meta?.pagination?.page || page,
        pageSize: result.meta?.pagination?.pageSize || pageSize,
        pageCount: result.meta?.pagination?.pageCount || 1,
        total: result.meta?.pagination?.total || events.length,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated events from Strapi:', error);
    const allEvents = fallbackEvents;
    const totalPages = Math.ceil(allEvents.length / pageSize);
    return {
      data: allEvents.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allEvents.length,
      },
    };
  }
}
