import Link from 'next/link';
import type { CourseWorkshop } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
}

export function CoursesSection({ courses }: { courses: CourseWorkshop[] }) {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="دوره‌ها و کارگاه‌ها"
          heading="دوره‌های در حال ثبت‌نام"
          description="مسیر آموزشی خود را از میان دوره‌های تئوری و کارگاه‌های عملی انتخاب کنید."
          viewAllHref="/courses"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <PlaceholderMedia tone={course.instructors[0]?.avatarColor as 'brand-red'} className="aspect-[16/10]">
                <span className="absolute top-3 start-3">
                  <Badge tone={course.type === 'COURSE' ? 'navy' : 'red'} className="bg-brand-cream/90">
                    {course.type === 'COURSE' ? 'دوره' : 'کارگاه'}
                  </Badge>
                </span>
                {course.isFull ? (
                  <span className="absolute top-3 end-3">
                    <Badge tone="neutral" className="bg-brand-cream/90 text-slate-700">
                      ظرفیت تکمیل
                    </Badge>
                  </span>
                ) : null}
              </PlaceholderMedia>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{course.shortDescription}</p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">{course.instructors[0]?.name}</span>
                  <span className="font-bold text-brand-navy">{formatPrice(course.price)}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>شروع: {course.startDate}</span>
                  <span>
                    {course.isFull ? 'بدون ظرفیت' : `${course.remainingCapacity} از ${course.totalCapacity} صندلی`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
