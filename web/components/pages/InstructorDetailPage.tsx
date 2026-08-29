'use client';

import Link from 'next/link';
import type { Instructor } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function InstructorDetailPage({ instructor }: { instructor: Instructor }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-brand-navy-dark text-white py-12">
        <Container>
          <div className="mb-4 flex items-center gap-2">
            <Link href="/instructors" className="hover:text-brand-cream">
              اساتید و تیم
            </Link>
            <span>/</span>
            <span className="text-brand-cream">{instructor.name}</span>
          </div>
          <h1 className="text-4xl font-bold leading-snug mb-2">{instructor.name}</h1>
          <p className="text-brand-cream font-medium">{instructor.title}</p>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Avatar */}
            <div className="mb-8">
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-dark flex items-center justify-center" />
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">درباره {instructor.name}</h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-4">
                {instructor.name} یک متخصص و مجرب در حوزه {instructor.category.name} است. با تجربه چند دهه‌ای و تحصیلات بالا، وی تاکنون هزاران دانشجو را آموزش داده است.
              </p>
              <p className="text-base leading-relaxed text-slate-600 mb-4">
                تخصص و دانش عمیق {instructor.name} در زمینه‌های مختلف سینما و تئاتر، سبب شده تا وی به یکی از مطلوب‌ترین و محترم‌ترین اساتید مؤسسه تبدیل شود.
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                روش تدریس تعاملی و عملی‌گرا، به دانشجویان کمک می‌کند تا مفاهیم را بهتر درک کنند و مهارت‌های خود را توسعه دهند.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8 border-t border-b border-slate-200 py-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-6">تجربه و سوابق</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-navy-dark">مدرس و کارگردان</h3>
                    <p className="text-sm text-slate-600">مؤسسه آزاد سینمایی طهرانی (۲۰۱۰ - اکنون)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-navy-dark">کارگردان و تهیه‌کننده</h3>
                    <p className="text-sm text-slate-600">چندین پروژه فیلم و تئاتر (۱۹۹۸ - اکنون)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-navy-dark">بازیگر و هنرمند</h3>
                    <p className="text-sm text-slate-600">حضور در فیلم‌ها و نمایش‌های مختلف (۱۹۹۰ - اکنون)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy-dark mb-4">تخصص‌ها</h2>
              <div className="flex flex-wrap gap-3">
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  بازیگری
                </Badge>
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  کارگردانی
                </Badge>
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  تهیه‌کنندگی
                </Badge>
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  تئوری سینما
                </Badge>
                <Badge tone="navy" className="bg-brand-navy-dark/10 text-brand-navy-dark">
                  تئاتر
                </Badge>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="sticky top-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Basic Info */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-2">نام</p>
                <p className="text-lg font-bold text-brand-navy-dark">{instructor.name}</p>
              </div>

              {/* Title and Category */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">عنوان</p>
                  <p className="font-semibold text-slate-900">{instructor.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">تخصص</p>
                  <p className="font-semibold text-slate-900">{instructor.category.name}</p>
                </div>
              </div>

              {/* CTA */}
              <Button href="/contact" className="w-full bg-brand-red text-white hover:bg-brand-red/90 mb-3">
                درخواست کلاس‌های خصوصی
              </Button>
              <Link
                href="/contact"
                className="inline-block w-full py-3 px-6 bg-transparent border-2 border-brand-navy text-brand-navy rounded text-center font-bold hover:bg-brand-navy/5 transition-colors"
              >
                ارتباط مستقیم
              </Link>

              {/* Note */}
              <p className="text-xs text-slate-500 text-center mt-4">
                می‌توانید با {instructor.name.split(' ')[0]} برای دوره‌ها و کارگاه‌های تخصصی تماس بگیرید.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
