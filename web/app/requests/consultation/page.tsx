'use client';

import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';

const consultationFields = [
  {
    name: 'subject',
    label: 'موضوع مشاوره',
    type: 'text' as const,
    required: true,
    placeholder: 'موضوع درخواست خود را بنویسید',
    maxLength: 100,
    helper: 'به طور خلاصه موضوع مشاوره را توضیح دهید',
  },
  {
    name: 'description',
    label: 'توضیحات تفصیلی',
    type: 'textarea' as const,
    required: true,
    placeholder: 'توضیحات کامل درخواست خود را بنویسید',
    maxLength: 2000,
    helper: 'توضیحات بیشتر کمک می‌کند تا بهتر درک کنند',
  },
];

export default function ConsultationRequestPage() {
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
          type={RequestType.CONSULTATION}
          fields={consultationFields}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}
