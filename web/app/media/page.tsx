import { getMediaItemsPaginated } from '../../features/media/data';
import { MediaListingPage } from '../../components/pages/MediaListingPage';

export const metadata = {
  title: 'کتابخانه رسانه | مؤسسه آزاد سینمایی طهرانی',
  description:
    'مشاهده ویدیوها، عکس‌ها و محتوای رسانه‌ای مؤسسه آزاد سینمایی طهرانی',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const result = await getMediaItemsPaginated(page, 6);

  return <MediaListingPage {...result} />;
}