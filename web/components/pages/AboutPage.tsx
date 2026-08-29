'use client';

import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import type { AboutPageContent } from '../../features/about/data';

export function AboutPage({ about }: { about: AboutPageContent }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy-dark to-brand-navy-dark/95 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-cream/80">درباره ما</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">{about.title}</h1>
            {about.subtitle && <p className="mt-4 text-xl text-white/80">{about.subtitle}</p>}
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-slate-700">{about.introduction}</p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            {about.mission && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy-dark">ماموریت ما</h2>
                <p className="mt-4 leading-relaxed text-slate-600">{about.mission}</p>
              </div>
            )}
            {about.vision && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy-dark">دیدگاه ما</h2>
                <p className="mt-4 leading-relaxed text-slate-600">{about.vision}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      {about.values && about.values.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading
              eyebrow="ارزش‌های ما"
              heading="اصول‌ی که ما را راهنمایی می‌کند"
              description="این ارزش‌ها در هر تصمیم و عملی که ما انجام می‌دهیم منعکس می‌شود."
            />

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((value, index) => (
                <div key={index} className="rounded-lg bg-white p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-brand-navy-dark">{value.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{value.description}</p>
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
            <h2 className="text-3xl font-bold">برای شروع مسیر خود آماده‌اید؟</h2>
            <p className="mt-4 text-white/80">
              بیایید با هم یاد بگیریم و بر این مسیر حرفه‌ای قدم بگذاریم.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/courses" className="bg-brand-red hover:bg-brand-red/90 text-white">
                مشاهده دوره‌ها
              </Button>
              <Button href="/contact" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                تماس با ما
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
