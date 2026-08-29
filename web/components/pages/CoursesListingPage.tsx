'use client';

import Link from 'next/link';
import type { CourseWorkshop } from '../../lib/types/cms';
import type { PaginatedResponse } from '../../features/courses/data';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
}

export function CoursesListingPage({
  data,
  pagination,
}: PaginatedResponse<CourseWorkshop>) {
  const courses = data;

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-12">
        <div className="mb-12">
          <SectionHeading
            eyebrow="دوره‌ها و کارگاه‌ها"
            heading="تمام دوره‌های آموزشی"
            description="مسیر آموزشی خود را از میان دوره‌های تئوری و کارگاه‌های عملی انتخاب کنید."
          />
        </div>

        {courses.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هیچ دوره‌ای برای نمایش موجود نیست.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <PlaceholderMedia
                    tone={course.instructors[0]?.avatarColor as 'brand-red'}
                    className="aspect-[16/10]"
                  >
                    <span className="absolute top-3 start-3">
                      <Badge
                        tone={course.type === 'COURSE' ? 'navy' : 'red'}
                        className="bg-brand-cream/90"
                      >
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
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {course.shortDescription}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <span className="text-slate-500">{course.instructors[0]?.name}</span>
                      <span className="font-bold text-brand-navy">{formatPrice(course.price)}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>شروع: {course.startDate}</span>
                      <span>
                        {course.isFull
                          ? 'بدون ظرفیت'
                          : `${course.remainingCapacity} از ${course.totalCapacity} صندلی`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={`/courses?page=${pagination.page - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    قبلی
                  </Link>
                )}

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/courses?page=${pageNum}`}
                    className={`rounded-lg px-4 py-2 ${
                      pageNum === pagination.page
                        ? 'bg-brand-navy text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                {pagination.page < pagination.pageCount && (
                  <Link
                    href={`/courses?page=${pagination.page + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    بعدی
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
