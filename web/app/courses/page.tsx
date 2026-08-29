import { getCoursesPaginated } from '../../features/courses/data';
import { CoursesListingPage } from '../../components/pages/CoursesListingPage';

export const metadata = {
  title: 'دوره‌ها و کارگاه‌ها | مؤسسه آزاد سینمایی طهرانی',
  description:
    'مشاهده تمام دوره‌های آموزشی و کارگاه‌های عملی مؤسسه آزاد سینمایی طهرانی',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const result = await getCoursesPaginated(page, 6);

  return <CoursesListingPage {...result} />;
}
