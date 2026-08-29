import { getInstructorsPaginated } from '../../features/instructors/data';
import { InstructorsListingPage } from '../../components/pages/InstructorsListingPage';

export const metadata = {
  title: 'اساتید و تیم | مؤسسه آزاد سینمایی طهرانی',
  description:
    'آشنایی با اساتید، مدرسان و تیم مؤسسه آزاد سینمایی طهرانی',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const parsedPage = params.page ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const result = await getInstructorsPaginated(page, 8);

  return <InstructorsListingPage {...result} />;
}
