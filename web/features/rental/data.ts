import type { SeoMeta } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_TOKEN;

export interface RentalPageContent {
  title: string;
  subtitle?: string;
  introduction: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  services?: Array<{
    title: string;
    description: string;
    price?: string;
  }>;
  cta?: {
    label: string;
    href: string;
  };
  seo?: SeoMeta;
}

type StrapiRentalResponse = {
  data?: {
    id: number;
    documentId: string;
    title: string;
    subtitle?: string;
    introduction: string;
    features: Array<{
      id: number;
      title: string;
      description: string;
    }>;
    services?: Array<{
      id: number;
      title: string;
      description: string;
      price?: string;
    }>;
    cta?: {
      label: string;
      href: string;
    };
    seo?: SeoMeta;
  } | null;
};

const fallbackRentalContent: RentalPageContent = {
  title: 'اجاره تجهیزات و فضا',
  subtitle: 'از تجهیزات استودیویی تا سالن‌های آموزشی',
  introduction:
    'سالن آموزش، استودیوی تولید محتوا، و تجهیزات فیلم‌برداری مؤسسه برای پروژه‌های آموزشی و تولیدی در اختیار علاقه‌مندان قرار می‌گیرد. ما تمام تجهیزات لازم برای تولید محتوای حرفه‌ای را در اختیار شما قرار می‌دهیم.',
  features: [
    {
      title: 'اجاره تجهیزات',
      description: 'دوربین، نور، و صدابرداری با کیفیت استودیویی',
    },
    {
      title: 'اجاره فضا',
      description: 'سالن آموزش و استودیو با ظرفیت ۴۰ نفر',
    },
    {
      title: 'مشاوره تولید',
      description: 'راهنمایی فنی برای پروژه‌های کوتاه و مستند',
    },
    {
      title: 'تدوین و پس‌تولید',
      description: 'خدمات تدوین ویدیویی توسط متخصصان حرفه‌ای',
    },
  ],
  services: [
    {
      title: 'بسته بنیادی',
      description: 'دوربین و نور برای یک روز',
      price: '۲۰۰,۰۰۰ تومان',
    },
    {
      title: 'بسته کامل',
      description: 'تمام تجهیزات + استودیو برای یک روز',
      price: '۸۰۰,۰۰۰ تومان',
    },
    {
      title: 'بسته درازمدت',
      description: 'اجاره ماهانه با تخفیف ۲۰٪',
      price: 'تماس برای قیمت',
    },
  ],
  cta: {
    label: 'درخواست استعلام و رزرو',
    href: '/contact',
  },
};

async function fetchRentalFromStrapi(): Promise<RentalPageContent> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackRentalContent;
  }

  try {
    // console.log(`Server  Fetching rental page from Strapi at ${strapiUrl}...`);
    const url = `${strapiUrl}/api/rental-page?populate=*`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch rental page from Strapi, using fallback content`);
      return fallbackRentalContent;
    }

    const result = (await response.json()) as StrapiRentalResponse;
    // console.log(`✅ Fetched rental page from Strapi`);

    if (!result.data) {
      return fallbackRentalContent;
    }

    return {
      title: result.data.title,
      subtitle: result.data.subtitle,
      introduction: result.data.introduction,
      features: result.data.features,
      services: result.data.services,
      cta: result.data.cta,
      seo: result.data.seo,
    };
  } catch (error) {
    console.error('Error fetching rental page from Strapi:', error);
    return fallbackRentalContent;
  }
}

export async function getRentalPageData(): Promise<RentalPageContent> {
  return fetchRentalFromStrapi();
}
