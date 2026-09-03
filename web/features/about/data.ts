import type { SeoMeta } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

export interface AboutPageContent {
  title: string;
  subtitle?: string;
  introduction: string;
  mission?: string;
  vision?: string;
  values?: Array<{
    title: string;
    description: string;
  }>;
  seo?: SeoMeta;
}

type StrapiAboutResponse = {
  data?: {
    id: number;
    documentId: string;
    title: string;
    subtitle?: string;
    introduction: string;
    mission?: string;
    vision?: string;
    values?: Array<{
      id: number;
      title: string;
      description: string;
    }>;
    seo?: SeoMeta;
  } | null;
};

const fallbackAboutContent: AboutPageContent = {
  title: 'درباره مؤسسه',
  subtitle: 'مسیری برای آموزش حرفه‌ای سینما و تئاتر',
  introduction:
    'مؤسسه آزاد سینمایی طهرانی با هدف آموزش اصولی بازیگری و هنرهای نمایشی تأسیس شده است. این مؤسسه با ترکیبی از آموزش تئوری، تمرین عملی و حضور در پروژه‌های واقعی، هنرجویان را برای ورود حرفه‌ای به دنیای سینما و تئاتر آماده می‌کند.',
  mission:
    'آموزش اصولی، حرفه‌ای و عملی بازیگری و هنرهای نمایشی به افرادی که علاقه و تعهد جدی دارند.',
  vision:
    'خانه‌ای برای استعدادها و علاقه‌مندان جدی به سینما و تئاتر؛ مؤسسه‌ای که نسل‌های متوالی هنرمندان حرفه‌ای را تربیت کند.',
  values: [
    {
      title: 'تعهد به کیفیت',
      description: 'ما به بالاترین استانداردهای آموزشی متعهدیم و هرگز برای جودا کردن هنر کمپرومیز نمی‌کنیم.',
    },
    {
      title: 'آموزش عملی',
      description: 'تئوری بدون عمل بی‌مقدار است. ما بر یادگیری عملی و تمرین مداوم تاکید می‌کنیم.',
    },
    {
      title: 'احترام به هنر',
      description: 'هنرهای نمایشی ارزشمند و شایسته احترام هستند. ما این ارزش‌ها را به نسل‌های بعدی منتقل می‌کنیم.',
    },
  ],
};

async function fetchAboutFromStrapi(): Promise<AboutPageContent> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackAboutContent;
  }

  try {
    // console.log(`Server  Fetching about page from Strapi at ${strapiUrl}...`);
    const url = `${strapiUrl}/api/about?populate=*`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch about page from Strapi, using fallback content`);
      return fallbackAboutContent;
    }

    const result = (await response.json()) as StrapiAboutResponse;
    // console.log(`✅ Fetched about page from Strapi`);

    if (!result.data) {
      return fallbackAboutContent;
    }

    return {
      title: result.data.title,
      subtitle: result.data.subtitle,
      introduction: result.data.introduction,
      mission: result.data.mission,
      vision: result.data.vision,
      values: result.data.values,
      seo: result.data.seo,
    };
  } catch (error) {
    console.error('Error fetching about page from Strapi:', error);
    return fallbackAboutContent;
  }
}

export async function getAboutPageData(): Promise<AboutPageContent> {
  return fetchAboutFromStrapi();
}
