'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';
import { Container } from '@/components/ui/Container';

export const dynamic = 'force-dynamic';

export default function EventParticipationRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const eventName = searchParams.get('eventName');

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/dashboard/courses');
    }, 2000);
  };

  // For event participation, we only need the eventId
  // The form doesn't have user-facing fields for this type
  const fields: never[] = [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-brand-navy-dark mb-2">
                ثبت‌نام رویداد
              </h1>
              {eventName && (
                <p className="text-lg text-slate-600">{eventName}</p>
              )}
              <p className="text-slate-500 mt-2">لطفاً تأیید کنید</p>
            </div>

            {eventId ? (
              <RequestForm
                type={RequestType.EVENT_PARTICIPATION}
                fields={fields}
                relatedIds={{ relatedEventId: eventId }}
                onSuccess={handleSuccess}
              >
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    برای تکمیل فرایند ثبت‌نام در این رویداد، لطفاً روی دکمه زیر کلیک کنید.
                  </p>
                </div>
              </RequestForm>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  شناسه رویداد یافت نشد. لطفاً از صفحه رویداد دوباره تلاش کنید.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
