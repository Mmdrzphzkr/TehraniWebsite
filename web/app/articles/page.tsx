import { getArticlesPaginated } from '../../features/articles/data';
import { ArticlesListingPage } from '../../components/pages/ArticlesListingPage';

export const metadata = {
  title: 'دانش‌نامه | مؤسسه آزاد سینمایی طهرانی',
  description:
    'خواندن مقالات و نوشته‌های تخصصی درباره هنر بازیگری و سینما',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const result = await getArticlesPaginated(page, 6);

  return <ArticlesListingPage {...result} />;
}
