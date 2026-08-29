import { getCourseBySlug, getCoursesSlugs } from '../../../features/courses/detail';
import { CourseDetailPage } from '../../../components/pages/CourseDetailPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getCoursesSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURI(encodedSlug);
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: 'دوره یافت نشد',
    };
  }

  return {
    title: `${course.title} | مؤسسه آزاد سینمایی طهرانی`,
    description: course.shortDescription,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURI(encodedSlug);
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailPage course={course} />;
}
