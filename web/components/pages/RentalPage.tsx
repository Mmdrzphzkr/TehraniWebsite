'use client';

import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import type { RentalPageContent } from '../../features/rental/data';

export function RentalPage({ rental }: { rental: RentalPageContent }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy-dark to-brand-navy-dark/95 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-cream/80">خدمات</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">{rental.title}</h1>
            {rental.subtitle && <p className="mt-4 text-xl text-white/80">{rental.subtitle}</p>}
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-slate-700">{rental.introduction}</p>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      {rental.features && rental.features.length > 0 && (
        <section className="bg-white py-16">
          <Container>
            <SectionHeading
              eyebrow="امکانات ما"
              heading="تمام آنچه برای تولید نیاز دارید"
              description="ما تجهیزات حرفه‌ای و فضای مناسب برای تمام نیازهای تولیدی شما فراهم می‌کنیم."
            />

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rental.features.map((feature, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 p-8 hover:shadow-lg transition-shadow">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy-dark">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Pricing Section */}
      {rental.services && rental.services.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading
              eyebrow="طرح‌های قیمتی"
              heading="بسته‌های اجاره"
              description="طرح‌های متنوع برای هر بودجه و نیاز"
            />

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rental.services.map((service, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border border-slate-100 bg-white p-8 hover:shadow-lg transition-shadow"
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-8 inline-block rounded-full bg-brand-red px-4 py-1 text-sm font-semibold text-white">
                      محبوب‌ترین
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-brand-navy-dark">{service.title}</h3>
                  <p className="mt-3 text-slate-600">{service.description}</p>
                  {service.price && (
                    <p className="mt-6 text-2xl font-bold text-brand-navy">{service.price}</p>
                  )}
                  <button className="mt-6 w-full rounded-lg bg-brand-navy py-2.5 font-semibold text-white hover:bg-brand-navy-dark transition-colors">
                    درخواست‌ قیمت
                  </button>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Process Section */}
      <section className="bg-white py-16">
        <Container>
          <SectionHeading
              eyebrow="روند رزرو"
              heading="روند رزرو"
              description="سه مرحله ساده برای اجاره تجهیزات"
            />

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '۱',
                title: 'تماس و پرسش',
                description: 'با ما تماس بگیرید و نیازهای خود را توضیح دهید.',
              },
              {
                step: '۲',
                title: 'دریافت پیشنهاد',
                description: 'ما برای شما یک بسته‌ی شخصی‌سازی شده ارسال می‌کنیم.',
              },
              {
                step: '۳',
                title: 'تایید و رزرو',
                description: 'قرارداد را امضا کنید و تجهیزات را دریافت کنید.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-brand-navy-dark">{item.title}</h4>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-navy-dark to-brand-navy py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold">آماده برای شروع پروژه‌ی خود؟</h2>
            <p className="mt-4 text-white/80">
              تیم ما برای کمک کردن به شما آماده است. با ما تماس بگیرید و بیایید ببینیم چگونه می‌توانیم کمکتان کنیم.
            </p>
            <div className="mt-8">
              {rental.cta ? (
                <Button href={rental.cta.href} className="bg-brand-red hover:bg-brand-red/90 text-white">
                  {rental.cta.label}
                </Button>
              ) : (
                <Button href="/contact" className="bg-brand-red hover:bg-brand-red/90 text-white">
                  درخواست استعلام
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
