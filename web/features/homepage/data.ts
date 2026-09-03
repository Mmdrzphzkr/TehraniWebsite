import type { HomepageContent } from '../../lib/types/cms';
import { getCoursesData } from '../courses/data';
import { getEventsData } from '../events/data';
import { getInstructorsData } from '../instructors/data';
import { getArticlesData } from '../articles/data';
import { getMediaItemsData } from '../media/data';

type StrapiHomepageResponse = {
  data?: {
    hero?: unknown;
    sections?: {
      introduction?: unknown;
      founder?: unknown;
      rental?: unknown;
      contact?: unknown;
    };
    seo?: unknown;
  } | null;
};

const fallbackHomepageContent: Omit<HomepageContent, 'courses' | 'events' | 'instructors' | 'articles' | 'mediaItems'> = {
  hero: {
    eyebrow: 'مؤسسه آزاد سینمایی طهرانی',
    headline: 'چراغ‌ها که خاموش می‌شود،',
    highlight: 'صحنه از آنِ شماست.',
    supportingCopy:
      'از اولین حضور مقابل دوربین تا ایفای نقش روی صحنه؛ مؤسسه طهرانی مسیر آموزش بازیگری و سینما را با اساتید حرفه‌ای و کارگاه‌های عملی برای شما هموار می‌کند.',
    primaryCta: { label: 'مشاهده دوره‌ها و کارگاه‌ها', href: '/courses' },
    secondaryCta: { label: 'آشنایی با مؤسسه', href: '/about' },
    stats: [
      { label: 'سال فعالیت', value: '۱۵' },
      { label: 'هنرجوی فارغ‌التحصیل', value: '۲۰۰۰' },
      { label: 'استاد و مدرس', value: '۲۰' },
    ],
  },
  introduction: {
    eyebrow: 'درباره ما',
    heading: 'خانه‌ای برای علاقه‌مندان جدی سینما و بازیگری',
    body: 'مؤسسه آزاد سینمایی طهرانی با هدف آموزش اصولی بازیگری و هنرهای نمایشی تأسیس شده و با ترکیبی از آموزش تئوری، تمرین عملی و حضور در پروژه‌های واقعی، هنرجویان را برای ورود حرفه‌ای به دنیای سینما و تئاتر آماده می‌کند.',
    cta: { label: 'بیشتر درباره ما بخوانید', href: '/about' },
    stats: [
      { label: 'دوره فعال', value: '۱۲' },
      { label: 'رویداد سالانه', value: '۳۰+' },
    ],
  },
  founder: {
    name: 'علی عظیم‌زاده طهرانی',
    role: 'بنیان‌گذار و مدیر مؤسسه',
    bio: 'با بیش از دو دهه فعالیت حرفه‌ای در سینما و تئاتر، علی عظیم‌زاده طهرانی مؤسسه آزاد سینمایی طهرانی را با هدف تربیت نسل جدیدی از بازیگران آگاه و حرفه‌ای بنیان نهاد.',
    cta: { label: 'بیشتر بدانید', href: '/founder' },
  },
  rental: {
    intro:
      'سالن آموزش، استودیوی تولید محتوا، و تجهیزات فیلم‌برداری مؤسسه برای پروژه‌های آموزشی و تولیدی در اختیار علاقه‌مندان قرار می‌گیرد.',
    features: [
      { title: 'اجاره تجهیزات', description: 'دوربین، نور، و صدابرداری با کیفیت استودیویی.' },
      { title: 'اجاره فضا', description: 'سالن آموزش و استودیو با ظرفیت ۴۰ نفر.' },
      { title: 'مشاوره تولید', description: 'راهنمایی فنی برای پروژه‌های کوتاه و مستند.' },
    ],
    cta: { label: 'استعلام و رزرو', href: '/rental' },
  },
  contact: {
    headline: 'برای مشاوره ثبت‌نام آماده‌ایم',
    supportingCopy:
      'سوالی درباره دوره‌ها، رویدادها یا خدمات مؤسسه دارید؟ همکاران ما در کوتاه‌ترین زمان پاسخگوی شما هستند.',
    phone: '۰۲۱-۰۰۰۰۰۰۰۰',
    address: 'تهران، خیابان نمونه، مؤسسه آزاد سینمایی طهرانی',
    cta: { label: 'درخواست مشاوره', href: '/contact' },
  },
};

async function fetchHomepageFromStrapi(): Promise<Omit<HomepageContent, 'courses' | 'events' | 'instructors' | 'articles' | 'mediaItems'> | null> {
  const strapiUrl = process.env.STRAPI_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';
  const strapiToken = process.env.STRAPI_API_TOKEN;
  if (!strapiToken) {
    return null;
  }

  try {
    const response = await fetch(`${strapiUrl}/api/homepage?populate=*`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as StrapiHomepageResponse;
    const data = payload.data;

    if (!data) {
      return null;
    }

    return {
      hero: (data.hero || fallbackHomepageContent.hero) as typeof fallbackHomepageContent.hero,
      introduction: (data.sections?.introduction || fallbackHomepageContent.introduction) as typeof fallbackHomepageContent.introduction,
      founder: (data.sections?.founder || fallbackHomepageContent.founder) as typeof fallbackHomepageContent.founder,
      rental: (data.sections?.rental || fallbackHomepageContent.rental) as typeof fallbackHomepageContent.rental,
      contact: (data.sections?.contact || fallbackHomepageContent.contact) as typeof fallbackHomepageContent.contact,
    };
  } catch (err) {
    console.error('Error fetching homepage from Strapi:', err);
    return null;
  }
}

export async function getHomepageData(): Promise<HomepageContent> {
  const strapiData = await fetchHomepageFromStrapi();
  const baseContent = strapiData || fallbackHomepageContent;

  // Fetch data from each content type's own endpoint
  const [courses, events, instructors, articles, mediaItems] = await Promise.all([
    getCoursesData(),
    getEventsData(),
    getInstructorsData(),
    getArticlesData(),
    getMediaItemsData(),
  ]);

  return {
    ...baseContent,
    courses: courses.slice(0, 3), // Show first 3 courses on homepage
    events: events.slice(0, 3), // Show first 3 events on homepage
    instructors: instructors.slice(0, 4), // Show first 4 instructors on homepage
    articles: articles.slice(0, 3), // Show first 3 articles on homepage
    mediaItems: mediaItems.slice(0, 4), // Show first 4 media items on homepage
  };
}
