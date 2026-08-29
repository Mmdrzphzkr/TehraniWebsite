import type { Metadata } from 'next';
import { getRentalPageData } from '../../features/rental/data';
import { RentalPage } from '../../components/pages/RentalPage';

export async function generateMetadata(): Promise<Metadata> {
  const rental = await getRentalPageData();

  return {
    title: rental.seo?.metaTitle || 'اجاره تجهیزات | مؤسسه آزاد سینمایی طهرانی',
    description:
      rental.seo?.metaDescription || 'اجاره تجهیزات و فضای استودیویی برای پروژه‌های تولیدی',
    openGraph: {
      title: rental.seo?.metaTitle || 'اجاره تجهیزات',
      description: rental.seo?.metaDescription,
      images: rental.seo?.ogImage ? [{ url: rental.seo.ogImage }] : undefined,
    },
  };
}

export default async function Page() {
  const rental = await getRentalPageData();

  return <RentalPage rental={rental} />;
}
