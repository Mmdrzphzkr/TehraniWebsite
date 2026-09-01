'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  formatRequestType,
  formatRequestStatus,
  getStatusColor,
} from '@/lib/services/request-service';

interface Request {
  id: string;
  documentId: string;
  type: string;
  status: string;
  submittedAt: string;
  closedAt?: string;
  payload: Record<string, any>;
  internalNotes?: string;
  relatedCourseWorkshop?: {
    id: string;
    title: string;
    slug: string;
  };
  relatedEvent?: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    fullName: string;
    mobile: string;
  };
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function RequestDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!user?.id) return;

      try {
        setPageLoading(true);
        const response = await fetch(`/api/dashboard/requests/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('درخواست یافت نشد');
          } else {
            throw new Error('Failed to fetch request');
          }
        } else {
          const data = await response.json();
          setRequest(data.request);
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('خطا در بارگذاری درخواست');
      } finally {
        setPageLoading(false);
      }
    };

    fetchRequest();
  }, [user?.id, params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
        </div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/dashboard/requests"
            className="text-brand-navy hover:underline mb-4 inline-block"
          >
            ← بازگشت به درخواست‌ها
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-slate-600">{error || 'درخواست یافت نشد'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <Link
          href="/dashboard/requests"
          className="text-brand-navy hover:underline mb-4 inline-block"
        >
          ← بازگشت به درخواست‌ها
        </Link>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-navy-dark mb-2">
                {formatRequestType(request.type as any)}
              </h1>
              <p className="text-slate-600">
                {new Date(request.submittedAt).toLocaleDateString('fa-IR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-lg font-medium ${getStatusColor(request.status as any)}`}>
              {formatRequestStatus(request.status as any)}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-700">
                <span className="font-medium">ثبت شده</span> - {new Date(request.submittedAt).toLocaleDateString('fa-IR')}
              </span>
            </div>

            {request.status !== 'NEW' && (
              <>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['IN_REVIEW', 'CONTACTED', 'APPROVED', 'REJECTED', 'CLOSED'].includes(request.status) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-slate-700">
                    <span className="font-medium">در حال بررسی</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['CONTACTED', 'APPROVED', 'REJECTED', 'CLOSED'].includes(request.status) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-slate-700">
                    <span className="font-medium">تماس گرفته شده</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['APPROVED', 'REJECTED', 'CLOSED'].includes(request.status) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-slate-700">
                    <span className="font-medium">نتیجه‌گیری</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand-navy-dark mb-6">جزئیات درخواست</h2>

          <div className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">نوع درخواست</label>
              <p className="text-lg text-slate-800">{formatRequestType(request.type as any)}</p>
            </div>

            {/* Related Content */}
            {(request.relatedCourseWorkshop || request.relatedEvent) && (
              <div className="border-t border-slate-200 pt-6">
                {request.relatedCourseWorkshop && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">دوره مرتبط</label>
                    <Link
                      href={`/courses/${request.relatedCourseWorkshop.slug}`}
                      className="text-lg text-brand-navy hover:underline font-medium"
                    >
                      {request.relatedCourseWorkshop.title} →
                    </Link>
                  </div>
                )}

                {request.relatedEvent && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">رویداد مرتبط</label>
                    <Link
                      href={`/events/${request.relatedEvent.slug}`}
                      className="text-lg text-brand-navy hover:underline font-medium"
                    >
                      {request.relatedEvent.title} →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Payload Details */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-brand-navy-dark mb-4">اطلاعات ارسال شده</h3>
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                {Object.entries(request.payload).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formatPayloadKey(key)}
                    </label>
                    <p className="text-slate-800 whitespace-pre-wrap break-words">
                      {formatPayloadValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            {request.internalNotes && (
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">یادداشت‌های داخلی</label>
                <p className="text-slate-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  {request.internalNotes}
                </p>
              </div>
            )}

            {/* Closed Date */}
            {request.closedAt && (
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1">تاریخ بسته‌شدن</label>
                <p className="text-slate-800">
                  {new Date(request.closedAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        {request.status === 'NEW' || request.status === 'IN_REVIEW' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">سوالی دارید؟</h3>
            <p className="text-blue-800 mb-4">
              برای اطلاعات بیشتر می‌توانید با ما تماس بگیرید یا از طریق صفحه تماس یک پیام بفرستید.
            </p>
            <Link href="/contact" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              درخواست تماس
            </Link>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-800">
              درخواست شما بررسی‌شده است. برای اطلاعات بیشتر لطفا منتظر تماس از سمت مؤسسه باشید.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function formatPayloadKey(key: string): string {
  const keyLabels: Record<string, string> = {
    subject: 'موضوع',
    message: 'پیام',
    description: 'توضیح',
    details: 'جزئیات',
    cooperationArea: 'زمینه همکاری',
    introduction: 'معرفی',
    projectType: 'نوع پروژه',
    equipment: 'تجهیزات مورد نیاز',
    date: 'تاریخ',
    duration: 'مدت‌زمان',
    space: 'فضا',
    time: 'زمان',
    capacity: 'ظرفیت',
    intendedUse: 'کاربرد مورد نظر',
  };

  return keyLabels[key] || key;
}

function formatPayloadValue(value: any): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'بله' : 'خیر';
  }

  if (Array.isArray(value)) {
    return value.join('، ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}
