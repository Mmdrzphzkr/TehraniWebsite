'use client';

import Link from 'next/link';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import type { FounderPageContent } from '../../features/founder/data';

export function FounderPage({ founder }: { founder: FounderPageContent }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy-dark to-brand-navy-dark/95 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-cream/80">بنیان‌گذار</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">{founder.name}</h1>
            <p className="mt-2 text-xl text-white/80">{founder.role}</p>
          </div>
        </Container>
      </section>

      {/* Profile Section */}
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="flex items-center justify-center">
              <PlaceholderMedia tone="brand-red" className="aspect-square w-full max-w-sm rounded-2xl" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-brand-navy-dark">درباره {founder.name}</h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-700">{founder.bio}</p>

              {founder.biography && (
                <p className="mt-4 leading-relaxed text-slate-600">{founder.biography}</p>
              )}

              {founder.cta && (
                <div className="mt-8">
                  <Button href={founder.cta.href} className="bg-brand-red hover:bg-brand-red/90 text-white">
                    {founder.cta.label}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Achievements Section */}
      {founder.achievements && founder.achievements.length > 0 && (
        <section className="bg-white py-16">
          <Container>
            <SectionHeading
              eyebrow="دستاورد‌ها"
              heading="دستاورد‌های او"
              description="مسیری پر از موفقیت و تعهد به هنر و آموزش"
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {founder.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-slate-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-700">{achievement}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-navy-dark to-brand-navy py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold">یاد بگیرید از بهترین‌ها</h2>
            <p className="mt-4 text-white/80">
              در دوره‌های من شرکت کنید و جزئیات فنی و هنری بازیگری را بیموزید.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              {founder.cta ? (
                <Button href={founder.cta.href} className="bg-brand-red hover:bg-brand-red/90 text-white">
                  {founder.cta.label}
                </Button>
              ) : (
                <Button href="/courses" className="bg-brand-red hover:bg-brand-red/90 text-white">
                  دیدن دوره‌های آموزشی
                </Button>
              )}
              <Button href="/contact" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                تماس برای اطلاعات بیشتر
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
