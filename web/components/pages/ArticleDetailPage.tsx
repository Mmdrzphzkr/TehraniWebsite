'use client';

import Link from 'next/link';
import type { Article } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';

export function ArticleDetailPage({ article }: { article: Article }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white py-12">
        <Container>
          <div className="mb-4 flex items-center gap-2">
            <Link href="/articles" className="hover:text-brand-cream">
              دانش‌نامه
            </Link>
            <span>/</span>
            <span className="text-brand-cream">{article.title}</span>
          </div>
          <h1 className="text-4xl font-bold leading-snug mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 flex-wrap text-sm">
            <Badge tone="navy" className="bg-brand-cream/20">
              {article.category}
            </Badge>
            <span>{article.publicationDate}</span>
            <span>•</span>
            <span>{article.readMinutes} دقیقه مطالعه</span>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article Meta */}
          <div className="mb-8 pb-8 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">منتشر شده در</p>
              <p className="font-semibold text-slate-900">{article.publicationDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">زمان مطالعه</p>
              <p className="font-semibold text-slate-900">{article.readMinutes} دقیقه</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">دسته‌بندی</p>
              <p className="font-semibold text-slate-900">{article.category}</p>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            {/* Summary */}
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-brand-navy rounded">
              <p className="text-lg leading-relaxed text-slate-700">
                {article.summary}
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                متن کامل مقاله شامل تحلیل‌های عمیق، نکات عملی، و بررسی‌های جزئی درباره موضوع است. این مقاله توسط متخصصین نوشته شده و می‌تواند برای شما منبع معتبری باشد.
              </p>

              <h2 className="text-2xl font-bold text-brand-navy-dark mt-8">بخش اول</h2>
              <p>
                توضیح و تشریح مفاهیم پایه‌ای و اساسی در این بخش آورده شده است. خوانندگان می‌توانند از این بخش یک فهم کلی و کلی‌نگری درباره موضوع کسب کنند.
              </p>

              <h2 className="text-2xl font-bold text-brand-navy-dark mt-8">بخش دوم</h2>
              <p>
                در این بخش به جزئیات بیشتر و تفاصیل دقیق‌تر پرداخته می‌شود. نمونه‌های عملی و کاربردی نیز در این جا ارائه شده‌اند.
              </p>

              <h2 className="text-2xl font-bold text-brand-navy-dark mt-8">نتیجه‌گیری</h2>
              <p>
                در پایان، خلاصه‌ای از نکات اصلی و درس‌های یادگیری‌شده از این مقاله ارائه می‌شود. این بخش به خوانندگان کمک می‌کند تا یادگیری‌های خود را تثبیت کنند.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-600 mb-4">
                این مقاله برای شما مفید بود؟ ایده‌ها و نظرات خود را با ما به اشتراک بگذارید.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red/90 transition-colors"
              >
                ارتباط با ما
              </Link>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-12 pt-12 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-brand-navy-dark mb-6">مقالات مرتبط</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Link
                  key={i}
                  href="/articles"
                  className="p-4 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-brand-navy-dark hover:text-brand-red mb-2">
                    مقاله مرتبط شماره {i}
                  </h4>
                  <p className="text-sm text-slate-600">خلاصه‌ای از محتوای مقاله مرتبط</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
