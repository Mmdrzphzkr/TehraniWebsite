import { getMediaItemsData } from '../../features/media/data';
import { MediaListingPage } from '../../components/pages/MediaListingPage';

export const metadata = {
  title: 'کتابخانه رسانه | مؤسسه آزاد سینمایی طهرانی',
  description:
    'مشاهده ویدیوها، عکس‌ها و محتوای رسانه‌ای مؤسسه آزاد سینمایی طهرانی',
};

export default async function Page() {
  const mediaItems = await getMediaItemsData();

  return <MediaListingPage mediaItems={mediaItems} />;
}
