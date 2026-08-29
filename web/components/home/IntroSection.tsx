import Link from 'next/link';
import type { HomepageContent } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { IconArrow } from '../ui/icons';

export function IntroSection({ content }: { content: HomepageContent['introduction'] }) {
  return (
    <section className="bg-brand-cream py-20">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3 py-1 text-xs font-bold text-brand-red">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {content.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-navy-dark sm:text-4xl">
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{content.body}</p>

          <Link
            href={content.cta.href}
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy transition-colors hover:text-brand-red"
          >
            {content.cta.label}
            <IconArrow className="h-4 w-4 rotate-180" />
          </Link>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-brand-navy/10 pt-8 sm:max-w-sm">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-extrabold text-brand-navy-dark">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial "quote card" motif rather than a literal photo grid */}
        <div className="relative">
          <div className="absolute -top-6 -end-6 h-full w-full rounded-3xl border-2 border-brand-gold/30" aria-hidden="true" />
          <div className="relative rounded-3xl bg-brand-navy p-10 text-brand-cream shadow-xl">
            <span className="text-6xl font-black leading-none text-brand-gold">”</span>
            <p className="mt-2 text-lg font-medium leading-relaxed text-brand-cream/90">
              بازیگری هنری است که با دانش، تمرین و صداقت در اجرا به بلوغ می‌رسد؛ ما این مسیر را قدم‌به‌قدم با شما طی
              می‌کنیم.
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-brand-cream/15 pt-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-gold text-sm font-extrabold text-brand-navy-dark">
                ط
              </span>
              <div>
                <div className="text-sm font-bold">علی عظیم‌زاده طهرانی</div>
                <div className="text-xs text-brand-cream/60">بنیان‌گذار مؤسسه</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
