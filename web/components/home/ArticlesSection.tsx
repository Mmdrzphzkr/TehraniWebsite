import Link from 'next/link';
import type { Article } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconArrow, IconClock } from '../ui/icons';
import { SwiperCarousel } from '../ui/SwiperCarousel';

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex flex-col bg-white p-6 h-full">
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
  );
}

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

        <div className="mt-10">
          <SwiperCarousel itemsPerView={3} spaceBetween={0} showArrows={true} showDots={true} loop={true}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 0 },
              768: { slidesPerView: 2, spaceBetween: 0 },
              1024: { slidesPerView: 3, spaceBetween: 0 },
            }}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </SwiperCarousel>
        </div>
      </Container>
    </section>
  );
}
