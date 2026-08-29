import type { Metadata } from 'next';
import { getContactPageData } from '../../features/contact/data';
import { ContactPage } from '../../components/pages/ContactPage';

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactPageData();

  return {
    title: contact.seo?.metaTitle || 'تماس | مؤسسه آزاد سینمایی طهرانی',
    description:
      contact.seo?.metaDescription || 'تماس با مؤسسه آزاد سینمایی طهرانی برای استعلام و رزرو',
    openGraph: {
      title: contact.seo?.metaTitle || 'تماس',
      description: contact.seo?.metaDescription,
      images: contact.seo?.ogImage ? [{ url: contact.seo.ogImage }] : undefined,
    },
  };
}

export default async function Page() {
  const contact = await getContactPageData();

  return <ContactPage contact={contact} />;
}
