'use client';

import Link from 'next/link';
import type { Article } from '../../lib/types/cms';
import type { PaginatedResponse } from '../../features/articles/data';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

export function ArticlesListingPage({
  data,
  pagination,
}: PaginatedResponse<Article>) {
  const articles = data;

  return (
    <main className="min-h-screen bg-slate-50">
      <Container className="py-12">
        <div className="mb-12">
          <SectionHeading
            eyebrow="دانش‌نامه"
            heading="مقالات و نوشته‌های تخصصی"
            description="خواندن مقالات درباره هنر بازیگری، سینما و تئاتر"
          />
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">هیچ مقاله‌ای برای نمایش موجود نیست.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy-dark">
                    <div className="text-center">
                      <div className="mb-2 inline-block rounded-full bg-brand-cream/20 px-3 py-1">
                        <Badge tone="navy" className="bg-transparent text-white">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {article.summary}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span>{article.publicationDate}</span>
                      <span>{article.readMinutes} دقیقه مطالعه</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={`/articles?page=${pagination.page - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    قبلی
                  </Link>
                )}

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/articles?page=${pageNum}`}
                    className={`rounded-lg px-4 py-2 ${
                      pageNum === pagination.page
                        ? 'bg-brand-navy text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                {pagination.page < pagination.pageCount && (
                  <Link
                    href={`/articles?page=${pagination.page + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  >
                    بعدی
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
