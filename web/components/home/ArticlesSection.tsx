import Link from 'next/link';
import type { Article } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconArrow, IconClock } from '../ui/icons';

export function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="دانش‌نامه"
          heading="آخرین نوشته‌های آموزشی"
          description="مقالات، راهنماها و تجربه‌های عملی برای علاقه‌مندان به بازیگری و سینما."
          viewAllHref="/articles"
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col bg-white p-6">
              <span className="text-xs font-bold text-brand-red">{article.category}</span>
              <h3 className="mt-3 flex-1 text-lg font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                {article.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.summary}</p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <IconClock className="h-3.5 w-3.5" />
                  {article.readMinutes} دقیقه مطالعه
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-navy group-hover:text-brand-red">
                  ادامه مطلب
                  <IconArrow className="h-3.5 w-3.5 rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
