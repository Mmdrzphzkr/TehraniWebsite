import type { MediaItem } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

type StrapiMediaResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    mediaType: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'INTERVIEW' | 'EDUCATIONAL' | 'OTHER';
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

const fallbackMediaItems: MediaItem[] = [
  {
    id: 'media-1',
    title: 'نمایش مستند: سفر یک بازیگر',
    slug: 'documentary-actors-journey',
    mediaType: 'VIDEO',
  },
  {
    id: 'media-2',
    title: 'پادکست: صحبت‌های علی عظیم‌زاده طهرانی',
    slug: 'podcast-ali-azimzadeh-interview',
    mediaType: 'AUDIO',
  },
  {
    id: 'media-3',
    title: 'گالری: کلاس‌های عملی مؤسسه',
    slug: 'gallery-practical-classes',
    mediaType: 'IMAGE',
  },
  {
    id: 'media-4',
    title: 'مصاحبه: نکات بازیگری با حسن رضایی',
    slug: 'interview-hassan-rezaei',
    mediaType: 'INTERVIEW',
  },
];

async function fetchMediaItemsFromStrapi(): Promise<MediaItem[]> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackMediaItems;
  }

  try {
    // console.log(`Server  Fetching media items from Strapi at ${strapiUrl}...`);

    const url = `${strapiUrl}/api/media-items?pagination[pageSize]=100`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch media items from Strapi, using fallback content`);
      return fallbackMediaItems;
    }

    const result = (await response.json()) as StrapiMediaResponse;
    // console.log(`✅ Fetched ${result.data?.length || 0} media items from Strapi`);

    if (!result.data || result.data.length === 0) {
      return fallbackMediaItems;
    }

    return result.data.map((item) => ({
      id: item.documentId,
      title: item.title,
      slug: item.slug,
      mediaType: item.mediaType,
    }));
  } catch (error) {
    console.error('Error fetching media items from Strapi:', error);
    return fallbackMediaItems;
  }
}

export async function getMediaItemsData(): Promise<MediaItem[]> {
  return fetchMediaItemsFromStrapi();
}

export async function getMediaItemsPaginated(
  page: number = 1,
  pageSize: number = 8
): Promise<PaginatedResponse<MediaItem>> {
  if (!strapiUrl) {
    const allMedia = fallbackMediaItems;
    const totalPages = Math.ceil(allMedia.length / pageSize);
    return {
      data: allMedia.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allMedia.length,
      },
    };
  }

  try {
    const url = `${strapiUrl}/api/media-items?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const allMedia = fallbackMediaItems;
      const totalPages = Math.ceil(allMedia.length / pageSize);
      return {
        data: allMedia.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allMedia.length,
        },
      };
    }

    const result = (await response.json()) as StrapiMediaResponse;

    if (!result.data || result.data.length === 0) {
      const allMedia = fallbackMediaItems;
      const totalPages = Math.ceil(allMedia.length / pageSize);
      return {
        data: allMedia.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allMedia.length,
        },
      };
    }

    const media = result.data.map((item) => ({
      id: item.documentId,
      title: item.title,
      slug: item.slug,
      mediaType: item.mediaType,
    }));

    return {
      data: media,
      pagination: {
        page: result.meta?.pagination?.page || page,
        pageSize: result.meta?.pagination?.pageSize || pageSize,
        pageCount: result.meta?.pagination?.pageCount || 1,
        total: result.meta?.pagination?.total || media.length,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated media from Strapi:', error);
    const allMedia = fallbackMediaItems;
    const totalPages = Math.ceil(allMedia.length / pageSize);
    return {
      data: allMedia.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allMedia.length,
      },
    };
  }
}
