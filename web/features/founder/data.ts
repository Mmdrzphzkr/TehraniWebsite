import type { FounderContent, SeoMeta } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

export interface FounderPageContent {
  name: string;
  role: string;
  bio: string;
  biography?: string;
  achievements?: string[];
  cta?: {
    label: string;
    href: string;
  };
  seo?: SeoMeta;
}

type StrapiFounderResponse = {
  data?: {
    id: number;
    documentId: string;
    name: string;
    role: string;
    bio: string;
    biography?: string;
    achievements?: string[];
    cta?: {
      label: string;
      href: string;
    };
    seo?: SeoMeta;
  } | null;
};

const fallbackFounderContent: FounderPageContent = {
  name: 'علی عظیم‌زاده طهرانی',
  role: 'بنیان‌گذار و مدیر مؤسسه',
  bio: 'با بیش از دو دهه فعالیت حرفه‌ای در سینما و تئاتر، علی عظیم‌زاده طهرانی مؤسسه آزاد سینمایی طهرانی را با هدف تربیت نسل جدیدی از بازیگران آگاه و حرفه‌ای بنیان نهاد.',
  biography:
    'علی عظیم‌زاده طهرانی در سال 1970 در تهران متولد شد. وی تحصیلات خود را در زمینه بازیگری و کارگردانی در دانشگاه‌های معتبر ایران و خارج از کشور انجام داد. طی سال‌های فعالیتش، وی در بیش از 50 فیلم و نمایش تئاتری حضور داشته است.',
  achievements: [
    'تأسیس مؤسسه آزاد سینمایی طهرانی (2000)',
    'کارگردانی بیش از 30 فیلم و نمایش',
    'بازیگری در فیلم‌های بین‌المللی',
    'تدریس و آموزش صدها هنرجو',
    'عضویت در هیئت‌های تخصصی سینمای ایران',
  ],
  cta: {
    label: 'دوره‌های با علی عظیم‌زاده',
    href: '/courses',
  },
};

async function fetchFounderFromStrapi(): Promise<FounderPageContent> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackFounderContent;
  }

  try {
    // console.log(`Server  Fetching founder page from Strapi at ${strapiUrl}...`);
    const url = `${strapiUrl}/api/founder?populate=*`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch founder page from Strapi, using fallback content`);
      return fallbackFounderContent;
    }

    const result = (await response.json()) as StrapiFounderResponse;
    // console.log(`✅ Fetched founder page from Strapi`);

    if (!result.data) {
      return fallbackFounderContent;
    }

    return {
      name: result.data.name,
      role: result.data.role,
      bio: result.data.bio,
      biography: result.data.biography,
      achievements: result.data.achievements,
      cta: result.data.cta,
      seo: result.data.seo,
    };
  } catch (error) {
    console.error('Error fetching founder page from Strapi:', error);
    return fallbackFounderContent;
  }
}

export async function getFounderPageData(): Promise<FounderPageContent> {
  return fetchFounderFromStrapi();
}
