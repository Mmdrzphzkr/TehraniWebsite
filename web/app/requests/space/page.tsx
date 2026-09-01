'use client';

import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';

const spaceRentalFields = [
  {
    name: 'requestedSpace',
    label: 'فضای مورد نیاز',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'سالن آموزش', value: 'training-hall' },
      { label: 'استودیو تولید محتوا', value: 'studio' },
      { label: 'هر دو فضا', value: 'both' },
    ],
    helper: 'فضایی را انتخاب کنید که نیاز دارید',
  },
  {
    name: 'requestedDate',
    label: 'تاریخ درخواستی',
    type: 'date' as const,
    required: true,
    helper: 'تاریخی را انتخاب کنید',
  },
  {
    name: 'startTime',
    label: 'ساعت شروع',
    type: 'time' as const,
    required: true,
    helper: 'ساعت شروع (HH:mm)',
  },
  {
    name: 'endTime',
    label: 'ساعت پایان',
    type: 'time' as const,
    required: true,
    helper: 'ساعت پایان (HH:mm)',
  },
  {
    name: 'numberOfPeople',
    label: 'تعداد افراد',
    type: 'number' as const,
    required: true,
    min: 1,
    max: 200,
    placeholder: '40',
    helper: 'تقریبی تعداد افراد حاضر',
  },
  {
    name: 'intendedUse',
    label: 'کاربرد مورد نظر',
    type: 'textarea' as const,
    required: true,
    placeholder: 'شرح مختصری از کاربرد فضا',
    maxLength: 500,
    helper: 'توضیح دهید قصد استفاده از فضا برای چه کاری است',
  },
  {
    name: 'additionalNotes',
    label: 'یادداشت‌های اضافی',
    type: 'textarea' as const,
    placeholder: 'نیازهای خاص، تجهیزات اضافی، و غیره',
    maxLength: 1000,
  },
];

export default function SpaceRentalRequestPage() {
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
          type={RequestType.SPACE_RENTAL}
          fields={spaceRentalFields}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}
