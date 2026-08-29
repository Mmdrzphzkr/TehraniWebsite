'use client';

import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import type { ContactPageContent } from '../../features/contact/data';

export function ContactPage({ contact }: { contact: ContactPageContent }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy-dark to-brand-navy-dark/95 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-cream/80">تماس با ما</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">{contact.title}</h1>
            {contact.subtitle && <p className="mt-4 text-xl text-white/80">{contact.subtitle}</p>}
          </div>
        </Container>
      </section>

      {/* Info Section */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-brand-navy-dark">{contact.headline}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{contact.supportingCopy}</p>

            {/* Contact Details */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-navy-dark">تلفن</h3>
                    <p className="mt-1 text-slate-600">{contact.phone}</p>
                  </div>
                </div>
              </div>

              {contact.email && (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy-dark">ایمیل</h3>
                      <p className="mt-1 text-slate-600">{contact.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-navy-dark">آدرس</h3>
                    <p className="mt-1 text-slate-600">{contact.address}</p>
                  </div>
                </div>
              </div>

              {contact.hours && (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy-dark">ساعات کاری</h3>
                      <p className="mt-1 text-slate-600">{contact.hours}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeading 
            eyebrow="فرم تماس"
            heading="فرم تماس" 
            description="پیامتان را برای ما بفرستید و ما در سریع‌ترین زمان پاسخ می‌دهیم." 
          />

            <form className="mt-8 space-y-6 rounded-2xl bg-white p-8 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand-navy-dark">
                    نام شما
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="نام کامل"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-navy-dark">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy-dark">
                  تلفن
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-brand-navy-dark">
                  موضوع
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="inquiry">استعلام عمومی</option>
                  <option value="courses">درباره دوره‌ها</option>
                  <option value="rental">درباره اجاره</option>
                  <option value="events">درباره رویدادها</option>
                  <option value="other">دیگر</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-navy-dark">
                  پیام
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  placeholder="پیام خود را اینجا بنویسید..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-red py-3 px-6 font-semibold text-white hover:bg-brand-red/90 transition-colors"
              >
                ارسال پیام
              </button>
            </form>
          </div>
        </Container>
      </section>

      {/* Social Links */}
      {contact.socialLinks && contact.socialLinks.length > 0 && (
        <section className="bg-white py-12">
          <Container>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-brand-navy-dark">ما را در شبکه‌های اجتماعی دنبال کنید</p>
              <div className="mt-6 flex gap-6">
                {contact.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy/10 text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                    aria-label={link.name}
                  >
                    <span className="text-sm font-semibold">{link.name[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
