'use client';

import Link from 'next/link';
import type { EventItem } from '../../lib/types/cms';
import type { PaginatedResponse } from '../../features/events/data';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { IconClock, IconMapPin } from '../ui/icons';

export function EventsListingPage({
  data,
  pagination,
}: PaginatedResponse<EventItem>) {
  const events = data;

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-12">
        <div className="mb-12">
          <SectionHeading
            eyebrow="رویدادها"
            heading="رویدادها و اکران‌ها"
            description="اکران‌ها، نشست‌های تخصصی و نمایش‌های صحنه‌ای مؤسسه را دنبال کنید و در آن‌ها شرکت بجویید."
          />
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هیچ رویدادی برای نمایش موجود نیست.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const [year, month, day] = event.date.split('/');
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group relative flex overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    {/* Ticket-stub date block */}
                    <div className="relative flex w-24 shrink-0 flex-col items-center justify-center bg-brand-navy text-brand-cream">
                      <span className="text-2xl font-extrabold">{day}</span>
                      <span className="mt-1 text-xs text-brand-cream/70">
                        {month}/{year}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <div className="flex items-center justify-between">
                        <Badge tone="green">{event.category}</Badge>
                        {event.isFull ? <Badge tone="red">ظرفیت تکمیل</Badge> : null}
                      </div>
                      <h3 className="text-base font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                        {event.title}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-slate-600">
                        {event.shortDescription}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <IconClock className="h-3.5 w-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconMapPin className="h-3.5 w-3.5" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={`/events?page=${pagination.page - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    قبلی
                  </Link>
                )}

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/events?page=${pageNum}`}
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
                    href={`/events?page=${pagination.page + 1}`}
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
