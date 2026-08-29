'use client';

import Link from 'next/link';
import type { MediaItem, MediaType } from '../../lib/types/cms';
import type { PaginatedResponse } from '../../features/courses/data'; // or define your own generic type
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';

function getMediaTypeLabel(type: MediaType): string {
  const labels: Record<MediaType, string> = {
    VIDEO: 'ویدیو',
    AUDIO: 'صوت',
    IMAGE: 'عکس',
    INTERVIEW: 'مصاحبه',
    EDUCATIONAL: 'آموزشی',
    OTHER: 'دیگر',
  };
  return labels[type] || 'رسانه';
}

function getMediaTypeTone(type: MediaType): 'brand-red' | 'brand-navy' | 'brand-teal' {
  const tones: Record<MediaType, 'brand-red' | 'brand-navy' | 'brand-teal'> = {
    VIDEO: 'brand-red',
    AUDIO: 'brand-navy',
    IMAGE: 'brand-teal',
    INTERVIEW: 'brand-red',
    EDUCATIONAL: 'brand-navy',
    OTHER: 'brand-teal',
  };
  return tones[type] || 'brand-navy';
}

export function MediaListingPage({ data, pagination }: PaginatedResponse<MediaItem>) {
  const mediaItems = data;

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-12">
        <div className="mb-12">
          <SectionHeading
            eyebrow="کتابخانه رسانه"
            heading="محتوای رسانه‌ای"
            description="ویدیوها، عکس‌ها و محتوای صوتی مؤسسه را کاوش کنید"
          />
        </div>

        {mediaItems.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هیچ محتوایی برای نمایش موجود نیست.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mediaItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/media/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <PlaceholderMedia
                    tone={getMediaTypeTone(item.mediaType)}
                    className="aspect-video"
                  >
                    <span className="absolute top-3 start-3">
                      <Badge
                        tone={item.mediaType === 'VIDEO' ? 'red' : 'navy'}
                        className="bg-brand-cream/90"
                      >
                        {getMediaTypeLabel(item.mediaType)}
                      </Badge>
                    </span>
                  </PlaceholderMedia>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-slate-600">
                      {getMediaTypeLabel(item.mediaType)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={`/media?page=${pagination.page - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    قبلی
                  </Link>
                )}

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/media?page=${pageNum}`}
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
                    href={`/media?page=${pagination.page + 1}`}
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
