'use client';

import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';

const cooperationFields = [
  {
    name: 'cooperationArea',
    label: 'حوزه همکاری',
    type: 'text' as const,
    required: true,
    placeholder: 'مثال: تهیه‌کندگی فیلم، تدوین، موسیقی متن',
    maxLength: 100,
    helper: 'حوزه‌ای را که علاقه مند برای همکاری هستید بنویسید',
  },
  {
    name: 'shortIntroduction',
    label: 'معرفی کوتاه',
    type: 'textarea' as const,
    required: true,
    placeholder: 'خود را به طور مختصر معرفی کنید',
    maxLength: 300,
    helper: 'توضیح کوتاهی از تجربیات و مهارت‌های خود',
  },
  {
    name: 'additionalDetails',
    label: 'جزئیات اضافی',
    type: 'textarea' as const,
    placeholder: 'اطلاعات اضافی در مورد همکاری درخواستی (اختیاری)',
    maxLength: 2000,
  },
  {
    name: 'portfolioUrl',
    label: 'لینک پورتفولیو',
    type: 'url' as const,
    placeholder: 'https://example.com/portfolio',
    helper: 'لینک به پورتفولیو یا کارنامه خود (اختیاری)',
  },
];

export default function CooperationRequestPage() {
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
          type={RequestType.COOPERATION}
          fields={cooperationFields}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}
