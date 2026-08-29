import type { EventItem } from '../../lib/types/cms';
import { getEventsData } from './data';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

type StrapiEventDetailResponse = {
  data: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    startDate: string;
    endDate?: string;
    venue: string;
    speaker?: string;
    capacity?: number;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
};

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (!strapiUrl) {
    const events = await getEventsData();
    return events.find((e) => e.slug === slug) || null;
  }

  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `${strapiUrl}/api/events?filters[slug][$eq]=${encodedSlug}&populate=category`;
    // console.log(`[Events Detail] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`[Events Detail] Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Events Detail] Strapi responded with ${response.status}, using fallback`);
      const events = await getEventsData();
      return events.find((e) => e.slug === slug) || null;
    }

    const result = (await response.json()) as StrapiEventDetailResponse;
    // console.log(`[Events Detail] Got ${result.data?.length || 0} events from Strapi`);

    if (!result.data || result.data.length === 0) {
      console.warn(`[Events Detail] No event found with slug: ${slug}, using fallback`);
      const events = await getEventsData();
      return events.find((e) => e.slug === slug) || null;
    }

    const event = result.data[0];
    // console.log(`[Events Detail] Found event: ${event.title}`);

    return {
      id: event.documentId,
      title: event.title,
      slug: event.slug,
      category: event.category?.name || 'رویداد',
      shortDescription: event.description,
      date: event.startDate,
      time: '00:00',
      venue: event.venue,
      isFull: false,
    };
  } catch (error) {
    console.error('[Events Detail] Error fetching event detail:', error);
    const events = await getEventsData();
    return events.find((e) => e.slug === slug) || null;
  }
}

export async function getEventsSlugs(): Promise<string[]> {
  const events = await getEventsData();
  return events.map((e) => e.slug);
}
