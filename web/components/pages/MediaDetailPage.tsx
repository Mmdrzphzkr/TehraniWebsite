'use client';

import Link from 'next/link';
import type { MediaItem, MediaType } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';

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

export function MediaDetailPage({ mediaItem }: { mediaItem: MediaItem }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-brand-navy-dark text-white py-12">
        <Container>
          <div className="mb-4 flex items-center gap-2">
            <Link href="/media" className="hover:text-brand-cream">
              کتابخانه رسانه
            </Link>
            <span>/</span>
            <span className="text-brand-cream">{mediaItem.title}</span>
          </div>
          <h1 className="text-4xl font-bold leading-snug mb-4">{mediaItem.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge tone="navy" className="bg-brand-cream/20">
              {getMediaTypeLabel(mediaItem.mediaType)}
            </Badge>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Media Player / Content */}
            <div className="mb-8 bg-slate-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl mb-4">
                  {mediaItem.mediaType === 'VIDEO' && '▶'}
                  {mediaItem.mediaType === 'AUDIO' && '🔊'}
                  {mediaItem.mediaType === 'IMAGE' && '🖼'}
                  {mediaItem.mediaType === 'INTERVIEW' && '🎤'}
                  {mediaItem.mediaType === 'EDUCATIONAL' && '📚'}
                  {mediaItem.mediaType === 'OTHER' && '📁'}
                </div>
                <p className="text-xl font-semibold">
                  این {getMediaTypeLabel(mediaItem.mediaType).toLowerCase()} را اینجا ببینید
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  محتوای رسانه‌ای
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">درباره این محتوا</h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-4">
                این {getMediaTypeLabel(mediaItem.mediaType).toLowerCase()} در مؤسسه آزاد سینمایی طهرانی تولید یا انتشار یافته است.
              </p>
              <p className="text-base leading-relaxed text-slate-600 mb-4">
                محتوای ارائه‌شده از طرف اساتید حرفه‌ای و متخصصین تهیه شده است و می‌تواند برای یادگیری و توسعه مهارت‌های خود بسیار مفید باشد.
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                این محتوا برای اغراض آموزشی و تحقیقی قابل استفاده است و تنها برای اعضای مؤسسه و دانشجویان درحال تحصیل دسترسی دارند.
              </p>
            </div>

            {/* Metadata */}
            <div className="grid gap-6 md:grid-cols-2 py-8 border-t border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-500 mb-2">نوع محتوا</p>
                <p className="text-lg font-semibold text-brand-navy-dark">
                  {getMediaTypeLabel(mediaItem.mediaType)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">مرتبط با</p>
                <p className="text-lg font-semibold text-brand-navy-dark">
                  مؤسسه آزاد سینمایی طهرانی
                </p>
              </div>
            </div>

            {/* Related Content */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-brand-navy-dark mb-6">محتوای مرتبط</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Link
                    key={i}
                    href="/media"
                    className="p-4 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-full aspect-video bg-slate-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-2xl">📁</span>
                    </div>
                    <h4 className="font-semibold text-brand-navy-dark hover:text-brand-red mb-2">
                      محتوای مرتبط {i}
                    </h4>
                    <p className="text-sm text-slate-600">نوع محتوا و توضیحات</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="sticky top-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Type */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-2">نوع محتوا</p>
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  {getMediaTypeLabel(mediaItem.mediaType)}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">عنوان</p>
                  <p className="font-semibold text-slate-900">{mediaItem.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">منتشر شده توسط</p>
                  <p className="font-semibold text-slate-900">
                    مؤسسه آزاد سینمایی طهرانی
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">وضعیت دسترسی</p>
                  <p className="font-semibold text-green-600">فعال</p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-slate-700 mb-3">
                  برای اطلاعات بیشتر درباره این محتوا با ما تماس بگیرید.
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-4 py-2 bg-brand-navy text-white rounded font-medium hover:bg-brand-navy-dark transition-colors text-sm"
                >
                  ارتباط با ما
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
