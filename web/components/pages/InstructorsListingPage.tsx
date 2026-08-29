'use client';

import Link from 'next/link';
import type { Instructor } from '../../lib/types/cms';
import type { PaginatedResponse } from '../../features/instructors/data';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

export function InstructorsListingPage({
  data,
  pagination,
}: PaginatedResponse<Instructor>) {
  const instructors = data;

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-12">
        <div className="mb-12">
          <SectionHeading
            eyebrow="اساتید و تیم"
            heading="اساتید و اعضای تیم مؤسسه"
            description="گروهی از بازیگران، کارگردانان و مدرسان باتجربه، همراه هنرجویان در مسیر یادگیری."
          />
        </div>

        {instructors.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هیچ استادی برای نمایش موجود نیست.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {instructors.map((instructor) => (
                <Link
                  key={instructor.id}
                  href={`/instructors/${instructor.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
                >
                  <PlaceholderMedia
                    tone={instructor.avatarColor as 'brand-navy'}
                    className="aspect-square w-full max-w-[9.5rem] rounded-full"
                  />
                  <h3 className="mt-4 text-base font-bold text-brand-navy-dark group-hover:text-brand-red">
                    {instructor.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{instructor.title}</p>
                  <span className="mt-3">
                    <Badge tone="navy">{instructor.category.name}</Badge>
                  </span>
                </Link>
              ))}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={`/instructors?page=${pagination.page - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    قبلی
                  </Link>
                )}

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/instructors?page=${pageNum}`}
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
                    href={`/instructors?page=${pagination.page + 1}`}
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
