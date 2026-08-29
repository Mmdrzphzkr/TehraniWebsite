import type { Metadata } from 'next';
import { getFounderPageData } from '../../features/founder/data';
import { FounderPage } from '../../components/pages/FounderPage';

export async function generateMetadata(): Promise<Metadata> {
  const founder = await getFounderPageData();

  return {
    title: founder.seo?.metaTitle || `${founder.name} | مؤسسه آزاد سینمایی طهرانی`,
    description:
      founder.seo?.metaDescription || `درباره ${founder.name}، بنیان‌گذار مؤسسه آزاد سینمایی طهرانی`,
    openGraph: {
      title: founder.seo?.metaTitle || founder.name,
      description: founder.seo?.metaDescription,
      images: founder.seo?.ogImage ? [{ url: founder.seo.ogImage }] : undefined,
    },
  };
}

export default async function Page() {
  const founder = await getFounderPageData();

  return <FounderPage founder={founder} />;
}
