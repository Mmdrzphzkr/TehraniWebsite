import { getMediaItemBySlug, getMediaItemsSlugs } from '../../../features/media/detail';
import { MediaDetailPage } from '../../../components/pages/MediaDetailPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getMediaItemsSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const mediaItem = await getMediaItemBySlug(params.slug);

  if (!mediaItem) {
    return {
      title: 'محتوا یافت نشد',
    };
  }

  return {
    title: `${mediaItem.title} | کتابخانه رسانه | مؤسسه آزاد سینمایی طهرانی`,
    description: `محتوای رسانه‌ای: ${mediaItem.mediaType}`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURI(encodedSlug);
  const mediaItem = await getMediaItemBySlug(slug);

  if (!mediaItem) {
    notFound();
  }

  return <MediaDetailPage mediaItem={mediaItem} />;
}
