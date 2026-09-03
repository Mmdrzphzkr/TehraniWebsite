import type { SeoMeta } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

export interface ContactPageContent {
  title: string;
  subtitle?: string;
  headline: string;
  supportingCopy: string;
  phone: string;
  address: string;
  email?: string;
  hours?: string;
  socialLinks?: Array<{
    name: string;
    url: string;
  }>;
  cta?: {
    label: string;
    href: string;
  };
  seo?: SeoMeta;
}

type StrapiContactResponse = {
  data?: {
    id: number;
    documentId: string;
    title: string;
    subtitle?: string;
    headline: string;
    supportingCopy: string;
    phone: string;
    address: string;
    email?: string;
    hours?: string;
    socialLinks?: Array<{
      id: number;
      name: string;
      url: string;
    }>;
    cta?: {
      label: string;
      href: string;
    };
    seo?: SeoMeta;
  } | null;
};

const fallbackContactContent: ContactPageContent = {
  title: 'تماس با ما',
  subtitle: 'ما همیشه برای شنیدن از شما آماده‌ایم',
  headline: 'برای مشاوره ثبت‌نام آماده‌ایم',
  supportingCopy:
    'سوالی درباره دوره‌ها، رویدادها یا خدمات مؤسسه دارید؟ همکاران ما در کوتاه‌ترین زمان پاسخگوی شما هستند. ما از شنیدن داستان شما و کمک به شما برای رسیدن به اهداف هنری‌تان برای شما دعوت می‌کنیم.',
  phone: '۰۲۱-۰۰۰۰۰۰۰۰',
  address: 'تهران، خیابان نمونه، مؤسسه آزاد سینمایی طهرانی',
  email: 'info@tehrani-cinema.ir',
  hours: 'شنبه تا چهارشنبه: ۱۰:۰۰ تا ۱۸:۰۰',
  socialLinks: [
    {
      name: 'Instagram',
      url: 'https://instagram.com/tehrani-cinema',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/tehrani-cinema',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/tehrani-cinema',
    },
  ],
};

async function fetchContactFromStrapi(): Promise<ContactPageContent> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackContactContent;
  }

  try {
    // console.log(`Server  Fetching contact page from Strapi at ${strapiUrl}...`);
    const url = `${strapiUrl}/api/contact?populate=*`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch contact page from Strapi, using fallback content`);
      return fallbackContactContent;
    }

    const result = (await response.json()) as StrapiContactResponse;
    // console.log(`✅ Fetched contact page from Strapi`);

    if (!result.data) {
      return fallbackContactContent;
    }

    return {
      title: result.data.title,
      subtitle: result.data.subtitle,
      headline: result.data.headline,
      supportingCopy: result.data.supportingCopy,
      phone: result.data.phone,
      address: result.data.address,
      email: result.data.email,
      hours: result.data.hours,
      socialLinks: result.data.socialLinks,
      cta: result.data.cta,
      seo: result.data.seo,
    };
  } catch (error) {
    console.error('Error fetching contact page from Strapi:', error);
    return fallbackContactContent;
  }
}

export async function getContactPageData(): Promise<ContactPageContent> {
  return fetchContactFromStrapi();
}
