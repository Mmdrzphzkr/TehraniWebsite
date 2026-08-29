import type { HeroContent } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { IconPlay, IconArrow } from '../ui/icons';

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-dark text-brand-cream">
      {/* Ambient cinematic glow accents, built with pure CSS — no imagery required */}
      <div className="pointer-events-none absolute -top-32 -end-32 h-96 w-96 rounded-full bg-brand-red/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -start-24 h-96 w-96 rounded-full bg-brand-green/20 blur-3xl" />

      <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            {content.eyebrow}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.25] sm:text-5xl lg:text-[3.4rem]">
            {content.headline}
            <br />
            <span className="text-brand-gold">{content.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-cream/70 sm:text-lg">
            {content.supportingCopy}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={content.primaryCta.href} variant="primary" icon={<IconArrow className="h-4 w-4 rotate-180" />}>
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="outline-light">
              {content.secondaryCta.label}
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-brand-cream/10 pt-8">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-extrabold text-brand-gold sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1 text-xs text-brand-cream/60 sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Decorative viewfinder-style frame standing in for a hero video/portrait */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-red via-brand-navy to-brand-green opacity-90" />
          <div
            className="absolute inset-0 rounded-[2rem] opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 20px)'
            }}
          />
          <div className="absolute inset-6 rounded-2xl border border-brand-cream/25" />

          {/* corner brackets, viewfinder motif (static class names so Tailwind's scanner can find them) */}
          <span className="absolute top-0 start-0 m-3 h-8 w-8 rounded-sm border-t-2 border-s-2 border-brand-gold" />
          <span className="absolute top-0 end-0 m-3 h-8 w-8 rounded-sm border-t-2 border-e-2 border-brand-gold" />
          <span className="absolute bottom-0 start-0 m-3 h-8 w-8 rounded-sm border-b-2 border-s-2 border-brand-gold" />
          <span className="absolute bottom-0 end-0 m-3 h-8 w-8 rounded-sm border-b-2 border-e-2 border-brand-gold" />

          <button
            type="button"
            aria-label="پخش ویدئوی معرفی مؤسسه"
            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream/90 text-brand-navy-dark shadow-xl transition-transform hover:scale-105"
          >
            <IconPlay className="h-6 w-6 translate-x-[1px]" />
          </button>

          <span className="absolute bottom-6 start-6 rounded-full bg-brand-navy-dark/70 px-3 py-1 text-xs font-bold text-brand-cream backdrop-blur">
            ویدئوی معرفی مؤسسه
          </span>
        </div>
      </Container>

      <div className="film-strip-divider text-brand-gold/40" aria-hidden="true" />
    </section>
  );
}
