'use client';

import { useEffect, useState, useCallback } from 'react';
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
  payload: Record<string, any>;
  relatedCourseWorkshop?: { title: string; slug: string };
  relatedEvent?: { title: string; slug: string };
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

const statusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'NEW', label: 'جدید' },
  { value: 'IN_REVIEW', label: 'در حال بررسی' },
  { value: 'CONTACTED', label: 'تماس گرفته شده' },
  { value: 'APPROVED', label: 'تأیید شده' },
  { value: 'REJECTED', label: 'رد شده' },
  { value: 'CLOSED', label: 'بسته شده' },
];

const typeOptions = [
  { value: '', label: 'همه انواع' },
  { value: 'COURSE_PARTICIPATION', label: 'درخواست دوره' },
  { value: 'EVENT_PARTICIPATION', label: 'درخواست رویداد' },
  { value: 'CONSULTATION', label: 'مشاوره' },
  { value: 'COOPERATION', label: 'همکاری' },
  { value: 'EQUIPMENT_RENTAL', label: 'اجاره تجهیزات' },
  { value: 'SPACE_RENTAL', label: 'اجاره فضا' },
  { value: 'CONTACT', label: 'تماس' },
];

export default function RequestsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) return;

    setPageLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(filterStatus && { status: filterStatus }),
        ...(filterType && { type: filterType }),
      });

      const response = await fetch(`/api/dashboard/requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setRequests(data.requests);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setPageLoading(false);
    }
  }, [user?.id, currentPage, filterStatus, filterType]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-brand-navy hover:underline mb-4 inline-block"
          >
            ← بازگشت به داشبورد
          </Link>
          <h1 className="text-4xl font-bold text-brand-navy-dark mb-2">درخواست‌های شما</h1>
          <p className="text-slate-600">
            {pagination?.total || 0} درخواست
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                وضعیت
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                نوع درخواست
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-slate-600 mb-4">درخواستی یافت نشد.</p>
            <Link href="/courses" className="text-brand-navy hover:underline">
              مرور دوره‌ها و رویدادها
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Link
                key={request.id}
                href={`/dashboard/requests/${request.documentId}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy-dark">
                      {formatRequestType(request.type as any)}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(request.submittedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status as any)}`}>
                    {formatRequestStatus(request.status as any)}
                  </div>
                </div>

                {(request.relatedCourseWorkshop || request.relatedEvent) && (
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    {request.relatedCourseWorkshop && (
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">دوره:</span> {request.relatedCourseWorkshop.title}
                      </p>
                    )}
                    {request.relatedEvent && (
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">رویداد:</span> {request.relatedEvent.title}
                      </p>
                    )}
                  </div>
                )}

                <div className="text-sm text-slate-600">
                  <p className="line-clamp-2">
                    {request.payload.subject ||
                      request.payload.message ||
                      request.payload.description ||
                      'بدون توضیح'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-brand-navy">
                  مشاهده جزئیات →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              قبلی
            </button>

            {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === page
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(pagination.pageCount, currentPage + 1))}
              disabled={currentPage === pagination.pageCount}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
