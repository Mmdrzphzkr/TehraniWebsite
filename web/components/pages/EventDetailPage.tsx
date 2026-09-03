'use client';

import Link from 'next/link';
import type { EventItem } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

export function EventDetailPage({ event }: { event: EventItem }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-brand-red text-white py-12">
        <Container>
          <div className="mb-4 flex items-center gap-2">
            <Link href="/events" className="hover:text-brand-cream">
              رویدادها
            </Link>
            <span>/</span>
            <span className="text-brand-cream">{event.title}</span>
          </div>
          <h1 className="text-4xl font-bold leading-snug mb-4">{event.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge tone="red" className="bg-brand-cream/20">
              {event.category}
            </Badge>
            {event.isFull && (
              <Badge tone="neutral" className="bg-white/20">
                پذیری تکمیل
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
              <PlaceholderMedia tone="brand-red" className="aspect-video rounded-2xl" />
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">درباره این رویداد</h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-4">
                {event.shortDescription}
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                این رویداد نمایش‌ی فیلم‌های برگزیده و مستندات باکیفیت است که تحت نظارت کارشناسان و متخصصان در حوزه سینما برگزار می‌شود.
              </p>
            </div>

            {/* Details */}
            <div className="grid gap-6 md:grid-cols-2 py-8 border-t border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-500 mb-2">تاریخ و زمان</p>
                <p className="text-lg font-semibold text-brand-navy-dark mb-1">
                  {event.date}
                </p>
                <p className="text-brand-red font-medium">
                  ساعت {event.time}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">مکان برگزاری</p>
                <p className="text-lg font-semibold text-brand-navy-dark">
                  {event.venue}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="sticky top-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Status */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-2">وضعیت ثبت‌نام</p>
                {event.isFull ? (
                  <Badge tone="neutral" className="bg-slate-100 text-slate-700">
                    ظرفیت تکمیل شده
                  </Badge>
                ) : (
                  <Badge tone="green" className="bg-green-100 text-green-700">
                    ظرفیت موجود
                  </Badge>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">دسته‌بندی</p>
                  <p className="font-semibold text-slate-900">{event.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">تاریخ</p>
                  <p className="font-semibold text-slate-900">{event.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">ساعت</p>
                  <p className="font-semibold text-slate-900">{event.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">مکان</p>
                  <p className="font-semibold text-slate-900">{event.venue}</p>
                </div>
              </div>

              {/* CTA */}
              {!event.isFull && (
                <Button
                  href={`/requests/event?eventId=${encodeURIComponent(event.id)}&eventName=${encodeURIComponent(event.title)}`}
                  className="w-full bg-brand-red text-white hover:bg-brand-red/90"
                >
                  درخواست شرکت
                </Button>
              )}
              {event.isFull && (
                <div className="w-full py-2 px-4 bg-slate-100 text-slate-600 text-center rounded-lg font-medium">
                  ظرفیت تکمیل شده
                </div>
              )}

              {/* Contact */}
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
