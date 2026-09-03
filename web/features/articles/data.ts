import type { Article } from '../../lib/types/cms';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

type StrapiArticleResponse = {
  data?: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    summary: string;
    publicationDate: string;
    readMinutes: number;
    content: string;
    category?: {
      id: number;
      name: string;
    };
  }> | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

const fallbackArticles: Article[] = [
  {
    id: 'article-1',
    title: 'تاریخچه بازیگری در سینمای ایران',
    slug: 'history-of-acting-in-iranian-cinema',
    category: 'تاریخ سینما',
    summary:
      'بررسی تاریخی از آغاز بازیگری در سینمای ایران تا عصر جدید و تأثیر آن بر رشد هنر بازیگری',
    publicationDate: '۱۴۰۵/۰۴/۱۵',
    content: '',
    readMinutes: 8,
  },
  {
    id: 'article-2',
    title: 'اصول کار مقابل دوربین',
    slug: 'principles-of-working-before-camera',
    category: 'تکنیک بازیگری',
    summary:
      'نکات عملی و اصول اساسی که هر بازیگر باید برای کار مقابل دوربین بداند.',
    publicationDate: '۱۴۰۵/۰۵/۰۱',
    content: '',
    readMinutes: 6,
  },
  {
    id: 'article-3',
    title: 'نقش احساسات در بازیگری',
    slug: 'role-of-emotions-in-acting',
    category: 'نظریه بازیگری',
    summary:
      'تحلیل عمیق درباره نقش احساسات و تجارب شخصی در خلق یک کاراکتر اعتقادپذیر',
    publicationDate: '۱۴۰۵/۰۵/۱۵',
    content: '',
    readMinutes: 10,
  },
];

async function fetchArticlesFromStrapi(): Promise<Article[]> {
  if (!strapiUrl) {
    // console.log('⚠️ STRAPI_URL not configured, using fallback data');
    return fallbackArticles;
  }

  try {
    // console.log(`Server  Fetching articles from Strapi at ${strapiUrl}...`);

    const url = `${strapiUrl}/api/articles?populate=category&pagination[pageSize]=100`;
    // console.log(`Server  URL is ${url}`);

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`Server  response is ${response.status} / ${response.statusText}`);

    if (!response.ok) {
      // console.log(`⚠️ Failed to fetch articles from Strapi, using fallback content`);
      return fallbackArticles;
    }

    const result = (await response.json()) as StrapiArticleResponse;
    // console.log(`✅ Fetched ${result.data?.length || 0} articles from Strapi`);

    if (!result.data || result.data.length === 0) {
      return fallbackArticles;
    }

    return result.data.map((article) => ({
      id: article.documentId,
      title: article.title,
      slug: article.slug,
      category: article.category?.name || 'مقاله',
      summary: article.summary,
      publicationDate: article.publicationDate,
      content: article.content,
      readMinutes: article.readMinutes,
    }));
  } catch (error) {
    // console.error('Error fetching articles from Strapi:', error);
    return fallbackArticles;
  }
}

export async function getArticlesData(): Promise<Article[]> {
  return fetchArticlesFromStrapi();
}

export async function getArticlesPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<PaginatedResponse<Article>> {
  if (!strapiUrl) {
    const allArticles = fallbackArticles;
    const totalPages = Math.ceil(allArticles.length / pageSize);
    return {
      data: allArticles.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allArticles.length,
      },
    };
  }

  try {
    const url = `${strapiUrl}/api/articles?populate=category&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const allArticles = fallbackArticles;
      const totalPages = Math.ceil(allArticles.length / pageSize);
      return {
        data: allArticles.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allArticles.length,
        },
      };
    }

    const result = (await response.json()) as StrapiArticleResponse;

    if (!result.data || result.data.length === 0) {
      const allArticles = fallbackArticles;
      const totalPages = Math.ceil(allArticles.length / pageSize);
      return {
        data: allArticles.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total: allArticles.length,
        },
      };
    }

    const articles = result.data.map((article) => ({
      id: article.documentId,
      title: article.title,
      slug: article.slug,
      category: article.category?.name || 'مقاله',
      summary: article.summary,
      publicationDate: article.publicationDate,
      content: article.content,
      readMinutes: article.readMinutes,
    }));

    return {
      data: articles,
      pagination: {
        page: result.meta?.pagination?.page || page,
        pageSize: result.meta?.pagination?.pageSize || pageSize,
        pageCount: result.meta?.pagination?.pageCount || 1,
        total: result.meta?.pagination?.total || articles.length,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated articles from Strapi:', error);
    const allArticles = fallbackArticles;
    const totalPages = Math.ceil(allArticles.length / pageSize);
    return {
      data: allArticles.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        pageCount: totalPages,
        total: allArticles.length,
      },
    };
  }
}
