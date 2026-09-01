'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatRequestStatus, getStatusColor } from '@/lib/services/request-service';

interface ContentRequest {
  id: string;
  documentId: string;
  type: 'COURSE_PARTICIPATION' | 'EVENT_PARTICIPATION';
  status: string;
  submittedAt: string;
  payload: Record<string, any>;
  relatedCourseWorkshop?: {
    id: string;
    title: string;
    slug: string;
    instructor?: { name: string };
    startDate?: string;
  };
  relatedEvent?: {
    id: string;
    title: string;
    slug: string;
    startDate?: string;
  };
}

export default function CoursesEventsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<ContentRequest[]>([]);
  const [events, setEvents] = useState<ContentRequest[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchCourseEventRequests = async () => {
      if (!user?.id) return;

      try {
        setPageLoading(true);
        const response = await fetch('/api/dashboard/course-event-requests');

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setCourses(data.courses || []);
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching course/event requests:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCourseEventRequests();
  }, [user?.id]);

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
          <h1 className="text-4xl font-bold text-brand-navy-dark mb-2">
            دوره‌ها و رویدادهای من
          </h1>
          <p className="text-slate-600">
            تمام درخواست‌های شرکت در دوره‌ها و رویدادها
          </p>
        </div>

        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
          </div>
        ) : (
          <>
            {/* Courses Section */}
            <div className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-brand-navy-dark mb-2">
                  دوره‌ها و کارگاه‌ها ({courses.length})
                </h2>
                <p className="text-slate-600">دوره‌هایی که برای شرکت در آن‌ها درخواست داده‌اید</p>
              </div>

              {courses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-slate-600 mb-4">درخواست دوره‌ای ثبت نشده است.</p>
                  <Link href="/courses" className="text-brand-navy hover:underline">
                    مرور دوره‌ها
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/dashboard/requests/${course.documentId}`}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-brand-navy-dark mb-1">
                            {course.relatedCourseWorkshop?.title || 'دوره'}
                          </h3>
                          {course.relatedCourseWorkshop?.instructor && (
                            <p className="text-sm text-slate-500">
                              مدرس: {course.relatedCourseWorkshop.instructor.name}
                            </p>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                            course.status as any
                          )}`}
                        >
                          {formatRequestStatus(course.status as any)}
                        </div>
                      </div>

                      {course.relatedCourseWorkshop?.startDate && (
                        <p className="text-sm text-slate-600 mb-3">
                          شروع:‌{' '}
                          {new Date(course.relatedCourseWorkshop.startDate).toLocaleDateString('fa-IR')}
                        </p>
                      )}

                      <p className="text-sm text-slate-600 mb-4">
                        درخواست ثبت‌شده: {new Date(course.submittedAt).toLocaleDateString('fa-IR')}
                      </p>

                      <div className="pt-4 border-t border-slate-200 text-sm text-brand-navy">
                        مشاهده جزئیات درخواست →
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Events Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-brand-navy-dark mb-2">
                  رویدادها ({events.length})
                </h2>
                <p className="text-slate-600">رویدادهایی که برای شرکت در آن‌ها درخواست داده‌اید</p>
              </div>

              {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-slate-600 mb-4">درخواست رویدادی ثبت نشده است.</p>
                  <Link href="/events" className="text-brand-navy hover:underline">
                    مرور رویدادها
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/dashboard/requests/${event.documentId}`}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-brand-navy-dark mb-1">
                            {event.relatedEvent?.title || 'رویداد'}
                          </h3>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                            event.status as any
                          )}`}
                        >
                          {formatRequestStatus(event.status as any)}
                        </div>
                      </div>

                      {event.relatedEvent?.startDate && (
                        <p className="text-sm text-slate-600 mb-3">
                          شروع: {new Date(event.relatedEvent.startDate).toLocaleDateString('fa-IR')}
                        </p>
                      )}

                      <p className="text-sm text-slate-600 mb-4">
                        درخواست ثبت‌شده: {new Date(event.submittedAt).toLocaleDateString('fa-IR')}
                      </p>

                      <div className="pt-4 border-t border-slate-200 text-sm text-brand-navy">
                        مشاهده جزئیات درخواست →
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
