'use client';

import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/RequestForm';
import { RequestType } from '@/lib/schemas/request-forms';

const equipmentRentalFields = [
  {
    name: 'projectType',
    label: 'نوع پروژه',
    type: 'text' as const,
    required: true,
    placeholder: 'مثال: فیلم کوتاه، مستند، تبلیغات',
    maxLength: 100,
    helper: 'نوع و توصیف کوتاه پروژه خود را بنویسید',
  },
  {
    name: 'requiredEquipment',
    label: 'تجهیزات مورد نیاز',
    type: 'textarea' as const,
    required: true,
    placeholder: 'دوربین 4K، لنز، نورپردازی، میکروفن، لرزشگیر، و غیره',
    maxLength: 500,
    helper: 'فهرست کامل تجهیزات مورد نیاز',
  },
  {
    name: 'requestedDate',
    label: 'تاریخ اجاره',
    type: 'date' as const,
    required: true,
    helper: 'تاریخی را انتخاب کنید که تجهیزات را نیاز دارید',
  },
  {
    name: 'rentalDuration',
    label: 'مدت زمان اجاره',
    type: 'text' as const,
    required: true,
    placeholder: 'مثال: ۵ روز، ۲ هفته، یک ماه',
    maxLength: 100,
    helper: 'مدت زمانی که تجهیزات را نیاز دارید',
  },
  {
    name: 'additionalNotes',
    label: 'یادداشت‌های اضافی',
    type: 'textarea' as const,
    placeholder: 'هر اطلاعات اضافی درباره درخواست',
    maxLength: 1000,
  },
];

export default function EquipmentRentalRequestPage() {
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
          type={RequestType.EQUIPMENT_RENTAL}
          fields={equipmentRentalFields}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}
