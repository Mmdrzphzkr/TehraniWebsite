import type { FounderContent } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { IconArrow } from '../ui/icons';

export function FounderSection({ founder }: { founder: FounderContent }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-dark py-20 text-brand-cream">
      <div className="pointer-events-none absolute inset-y-0 start-1/2 w-[60rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(215,173,99,0.18),transparent_65%)]" />

      <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        {/* Spotlight portrait placeholder */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-xs">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-gold/30 via-brand-navy to-black" />
          <div className="absolute inset-x-10 top-0 h-full rounded-t-full bg-brand-gold/10 blur-2xl" />
          <div className="absolute inset-6 flex items-end justify-center rounded-2xl border border-brand-gold/30 pb-6">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-gold text-2xl font-extrabold text-brand-navy-dark">
              ع.ط
            </span>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            بنیان‌گذار مؤسسه
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{founder.name}</h2>
          <p className="mt-2 text-sm font-semibold text-brand-gold">{founder.role}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-cream/75">{founder.bio}</p>

          <Button href={founder.cta.href} variant="primary" className="mt-8" icon={<IconArrow className="h-4 w-4 rotate-180" />}>
            {founder.cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
