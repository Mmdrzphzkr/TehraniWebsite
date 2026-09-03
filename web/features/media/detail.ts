import type { MediaItem } from '../../lib/types/cms';
import { getMediaItemsData } from './data';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

type StrapiMediaDetailResponse = {
  data: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    type: 'VIDEO' | 'GALLERY' | 'PODCAST' | 'INTERVIEW';
    description: string;
    duration?: number;
    embedUrl?: string;
    mediaFile?: {
      url: string;
    };
    tags?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;
};

export async function getMediaItemBySlug(slug: string): Promise<MediaItem | null> {
  if (!strapiUrl) {
    const media = await getMediaItemsData();
    return media.find((m) => m.slug === slug) || null;
  }

  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `${strapiUrl}/api/media-items?filters[slug][$eq]=${encodedSlug}&populate=tags,mediaFile`;
    // console.log(`[Media Detail] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`[Media Detail] Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Media Detail] Strapi responded with ${response.status}, using fallback`);
      const media = await getMediaItemsData();
      return media.find((m) => m.slug === slug) || null;
    }

    const result = (await response.json()) as StrapiMediaDetailResponse;
    // console.log(`[Media Detail] Got ${result.data?.length || 0} media from Strapi`);

    if (!result.data || result.data.length === 0) {
      console.warn(`[Media Detail] No media found with slug: ${slug}, using fallback`);
      const media = await getMediaItemsData();
      return media.find((m) => m.slug === slug) || null;
    }

    const item = result.data[0];
    // console.log(`[Media Detail] Found media: ${item.title}`);

    return {
      id: item.documentId,
      title: item.title,
      slug: item.slug,
      mediaType: item.type as any,
    };
  } catch (error) {
    console.error('[Media Detail] Error fetching media detail:', error);
    const media = await getMediaItemsData();
    return media.find((m) => m.slug === slug) || null;
  }
}

export async function getMediaItemsSlugs(): Promise<string[]> {
  const media = await getMediaItemsData();
  return media.map((m) => m.slug);
}
