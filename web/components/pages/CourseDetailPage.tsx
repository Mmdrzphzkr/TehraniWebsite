'use client';

import Link from 'next/link';
import type { CourseWorkshop } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
}

export function CourseDetailPage({ course }: { course: CourseWorkshop }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-brand-navy-dark text-white py-12">
        <Container>
          <div className="mb-4 flex items-center gap-2">
            <Link href="/courses" className="hover:text-brand-cream">
              دوره‌ها و کارگاه‌ها
            </Link>
            <span>/</span>
            <span className="text-brand-cream">{course.title}</span>
          </div>
          <h1 className="text-4xl font-bold leading-snug mb-4">{course.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge tone={course.type === 'COURSE' ? 'navy' : 'red'} className="bg-brand-cream/20">
              {course.type === 'COURSE' ? 'دوره' : 'کارگاه'}
            </Badge>
            {course.isFull && (
              <Badge tone="neutral" className="bg-white/20">
                ظرفیت تکمیل
              </Badge>
            )}
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Media */}
            <div className="mb-8">
              <PlaceholderMedia tone={course.instructors[0]?.avatarColor as 'brand-red'} className="aspect-video rounded-2xl" />
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">توضیحات دوره</h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-4">
                {course.shortDescription}
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                این دوره برای افرادی طراحی شده‌است که می‌خواهند مهارت‌های خود را تحت نظر اساتید حرفه‌ای توسعه دهند. برنامه درسی ترکیبی از تئوری و تمرین عملی است.
              </p>
            </div>

            {/* Instructor */}
            <div className="mb-8 border-t border-b border-slate-200 py-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">مدرس</h2>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-navy to-brand-navy-dark flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-brand-navy-dark">
                    {course.instructors[0]?.name}
                  </h3>
                  <p className="text-sm text-brand-red font-medium">
                    {course.instructors[0]?.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {course.instructors[0]?.category.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="sticky top-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-2">قیمت</p>
                <p className="text-3xl font-bold text-brand-navy">
                  {formatPrice(course.price)}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">شروع</p>
                  <p className="font-semibold text-slate-900">{course.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">مکان</p>
                  <p className="font-semibold text-slate-900">{course.venue}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">ظرفیت</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">
                      {course.remainingCapacity} از {course.totalCapacity} صندلی
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-brand-red h-2 rounded-full"
                        style={{
                          width: `${((course.totalCapacity - course.remainingCapacity) / course.totalCapacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {!course.isFull && (
                <Button
                  href={`/requests/course?courseId=${encodeURIComponent(course.id)}&courseName=${encodeURIComponent(course.title)}`}
                  className="w-full bg-brand-red text-white hover:bg-brand-red/90"
                >
                  درخواست ثبت‌نام
                </Button>
              )}
              {course.isFull && (
                <div className="w-full py-2 px-4 bg-slate-100 text-slate-600 text-center rounded-lg font-medium">
                  ظرفیت تکمیل شده
                </div>
              )}

              {/* Info */}
              <p className="text-xs text-slate-500 text-center mt-4">
                برای اطلاعات بیشتر با ما تماس بگیرید
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
