'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRequestType, formatRequestStatus, getStatusColor } from '@/lib/services/request-service';

interface RecentRequest {
  id: string;
  documentId: string;
  type: string;
  status: string;
  submittedAt: string;
  payload: Record<string, any>;
  relatedCourseWorkshop?: { title: string };
  relatedEvent?: { title: string };
}

interface DashboardStats {
  totalRequests: number;
  byStatus: Record<string, number>;
  recentRequests: RecentRequest[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setStatsLoading(true);
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy mx-auto mb-4"></div>
            <p className="text-slate-600">درحال بارگذاری...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-navy-dark mb-2">داشبورد کاربری</h1>
              <p className="text-slate-600">خوش آمدید، {user.mobile}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/profile" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">پروفایل</h2>
            <p className="text-slate-600 text-sm">مدیریت اطلاعات شخصی</p>
          </Link>

          <Link href="/dashboard/requests" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">درخواست‌ها</h2>
            <p className="text-slate-600 text-sm">
              {stats?.totalRequests || 0} درخواست
            </p>
          </Link>

          <Link href="/dashboard/courses" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">دوره‌ها</h2>
            <p className="text-slate-600 text-sm">دوره‌های ثبت‌نام شده</p>
          </Link>

          <Link href="/dashboard/courses" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">رویدادها</h2>
            <p className="text-slate-600 text-sm">رویدادهای ثبت‌نام شده</p>
          </Link>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-slate-600 text-sm mb-1">کل درخواست‌ها</p>
              <p className="text-3xl font-bold text-brand-navy">{stats.totalRequests}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-4">
              <p className="text-blue-600 text-sm mb-1">جدید</p>
              <p className="text-3xl font-bold text-blue-700">{stats.byStatus.NEW || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
              <p className="text-yellow-600 text-sm mb-1">در حال بررسی</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.byStatus.IN_REVIEW || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm p-4">
              <p className="text-purple-600 text-sm mb-1">تماس‌شده</p>
              <p className="text-3xl font-bold text-purple-700">{stats.byStatus.CONTACTED || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-4">
              <p className="text-green-600 text-sm mb-1">تأیید‌شده</p>
              <p className="text-3xl font-bold text-green-700">{stats.byStatus.APPROVED || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm p-4">
              <p className="text-red-600 text-sm mb-1">رد‌شده</p>
              <p className="text-3xl font-bold text-red-700">{stats.byStatus.REJECTED || 0}</p>
            </div>
          </div>
        )}

        {/* Recent Requests */}
        {!statsLoading && stats && stats.recentRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-navy-dark">آخرین درخواست‌ها</h2>
              <Link href="/dashboard/requests" className="text-brand-navy hover:underline text-sm">
                مشاهده همه →
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/dashboard/requests/${request.documentId}`}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {formatRequestType(request.type as any)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(request.submittedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status as any)}`}>
                    {formatRequestStatus(request.status as any)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">درخواست جدید ثبت کنید</h2>
          <p className="text-blue-800 mb-4">می‌توانید درخواست‌های مختلفی مانند شرکت در دوره، رویداد یا استعلام اجاره تجهیزات را ثبت کنید.</p>
          <Link href="/courses" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            مرور دوره‌ها و رویدادها
          </Link>
        </div>
      </div>
    </main>
  );
}
