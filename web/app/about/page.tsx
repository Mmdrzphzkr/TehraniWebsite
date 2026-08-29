import type { Metadata } from 'next';
import { getAboutPageData } from '../../features/about/data';
import { AboutPage } from '../../components/pages/AboutPage';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPageData();

  return {
    title: about.seo?.metaTitle || 'درباره مؤسسه | مؤسسه آزاد سینمایی طهرانی',
    description:
      about.seo?.metaDescription || 'درباره مؤسسه آزاد سینمایی طهرانی، ماموریت و دیدگاه ما در آموزش بازیگری و سینما',
    openGraph: {
      title: about.seo?.metaTitle || 'درباره مؤسسه',
      description: about.seo?.metaDescription,
      images: about.seo?.ogImage ? [{ url: about.seo.ogImage }] : undefined,
    },
  };
}

export default async function Page() {
  const about = await getAboutPageData();

  return <AboutPage about={about} />;
}
