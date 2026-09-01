'use client';

import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';

const contactFields = [
  {
    name: 'subject',
    label: 'موضوع پیام',
    type: 'text' as const,
    required: true,
    placeholder: 'موضوع پیام خود را بنویسید',
    maxLength: 100,
    helper: 'خلاصه‌ای از مضمون پیام',
  },
  {
    name: 'message',
    label: 'متن پیام',
    type: 'textarea' as const,
    required: true,
    placeholder: 'پیام خود را بنویسید',
    maxLength: 2000,
    helper: 'توضیح کامل درخواست یا سؤال خود',
  },
];

export default function ContactRequestPage() {
  const router = useRouter();

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/dashboard/requests');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="flex items-center justify-center px-4">
        <RequestForm
          type={RequestType.CONTACT}
          fields={contactFields}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}
