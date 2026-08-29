import { getInstructorBySlug, getInstructorsSlugs } from '../../../features/instructors/detail';
import { InstructorDetailPage } from '../../../components/pages/InstructorDetailPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getInstructorsSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const {slug : encodedSlug} = await params;
  const slug = decodeURI(encodedSlug);
  const instructor = await getInstructorBySlug(slug);

  if (!instructor) {
    return {
      title: 'استاد یافت نشد',
    };
  }

  return {
    title: `${instructor.name} | اساتید | مؤسسه آزاد سینمایی طهرانی`,
    description: instructor.title,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const {slug : encodedSlug} = await params;
  const slug = decodeURI(encodedSlug);
  const instructor = await getInstructorBySlug(slug);

  if (!instructor) {
    notFound();
  }

  return <InstructorDetailPage instructor={instructor} />;
}
