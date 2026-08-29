import { getArticleBySlug, getArticlesSlugs } from '../../../features/articles/detail';
import { ArticleDetailPage } from '../../../components/pages/ArticleDetailPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getArticlesSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'مقاله یافت نشد',
    };
  }

  return {
    title: `${article.title} | دانش‌نامه | مؤسسه آزاد سینمایی طهرانی`,
    description: article.summary,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  // console.log(`Decoded slug: ${slug}`);
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailPage article={article} />;
}
