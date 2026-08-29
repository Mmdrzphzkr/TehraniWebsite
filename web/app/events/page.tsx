import { getEventsPaginated } from '../../features/events/data';
import { EventsListingPage } from '../../components/pages/EventsListingPage';

export const metadata = {
  title: 'رویدادها و اکران‌ها | مؤسسه آزاد سینمایی طهرانی',
  description:
    'مشاهده تمام رویدادها، اکران‌ها و نشست‌های تخصصی مؤسسه آزاد سینمایی طهرانی',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const parsedPage = params.page ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const result = await getEventsPaginated(page, 6);

  return <EventsListingPage {...result} />;
}
