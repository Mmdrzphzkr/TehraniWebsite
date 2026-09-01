'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/profile" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">پروفایل</h2>
            <p className="text-slate-600 text-sm">مدیریت اطلاعات شخصی</p>
          </Link>

          <Link href="/dashboard/requests" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">درخواست‌ها</h2>
            <p className="text-slate-600 text-sm">مشاهده درخواست‌های شما</p>
          </Link>

          <Link href="/dashboard/courses" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">دوره‌ها</h2>
            <p className="text-slate-600 text-sm">دوره‌های ثبت‌نام شده</p>
          </Link>

          <Link href="/dashboard/events" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-brand-navy-dark mb-2">رویدادها</h2>
            <p className="text-slate-600 text-sm">رویدادهای ثبت‌نام شده</p>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">خوش آمدید!</h2>
          <p className="text-blue-800">داشبورد کاربری شما آماده است. از منو بالا بخش‌های مختلف را مشاهده کنید.</p>
        </div>
      </div>
    </main>
  );
}
