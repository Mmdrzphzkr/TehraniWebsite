import type { Article } from '../../lib/types/cms';
import { getArticlesData } from './data';

const strapiUrl = process.env.STRAPI_URL || 'http://localhost:8000';
const strapiToken = process.env.STRAPI_API_TOKEN;

type StrapiArticleDetailResponse = {
  data: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    publicationDate: string;
    readMinutes: number;
    category?: {
      id: number;
      name: string;
    };
  }>;
};

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!strapiUrl) {
    const articles = await getArticlesData();
    return articles.find((a) => a.slug === slug) || null;
  }

  try {
    const url = `${strapiUrl}/api/articles?filters[slug][$eq]=${slug}&populate=category`;
    // console.log(`[Articles Detail] Fetching from: ${url}`);
    // console.log(`article slug:`, slug);
    const response = await fetch(url, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 60 },
    });

    // console.log(`[Articles Detail] Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Articles Detail] Strapi responded with ${response.status}, using fallback`);
      const articles = await getArticlesData();
      return articles.find((a) => a.slug === slug) || null;
    }

    const result = (await response.json()) as StrapiArticleDetailResponse;
    // console.log(`[Articles Detail] Got ${result.data?.length || 0} articles from Strapi`);

    if (!result.data || result.data.length === 0) {
      console.warn(`[Articles Detail] No article found with slug: ${slug}, using fallback`);
      const articles = await getArticlesData();
      return articles.find((a) => a.slug === slug) || null;
    }

    const article = result.data[0];
    console.log(`[Articles Detail] Found article: ${JSON.stringify(article.readMinutes)}`);

    return {
      id: article.documentId,
      title: article.title,
      slug: article.slug,
      category: article.category?.name || 'مقاله',
      summary: article.summary,
      content: article.content,
      publicationDate: article.publicationDate,
      readMinutes: article.readMinutes,
    };
  } catch (error) {
    console.error('[Articles Detail] Error fetching article detail:', error);
    const articles = await getArticlesData();
    return articles.find((a) => a.slug === slug) || null;
  }
}

export async function getArticlesSlugs(): Promise<string[]> {
  const articles = await getArticlesData();
  return articles.map((a) => a.slug);
}
