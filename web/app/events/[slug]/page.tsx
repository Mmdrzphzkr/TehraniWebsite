import { getEventBySlug, getEventsSlugs } from '../../../features/events/detail';
import { EventDetailPage } from '../../../components/pages/EventDetailPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getEventsSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURI(encodedSlug);
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'رویداد یافت نشد',
    };
  }

  return {
    title: `${event.title} | مؤسسه آزاد سینمایی طهرانی`,
    description: event.shortDescription,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURI(encodedSlug);
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
