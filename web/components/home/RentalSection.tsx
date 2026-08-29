import type { RentalContent } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { IconArrow } from '../ui/icons';

export function RentalSection({ rental }: { rental: RentalContent }) {
  return (
    <section className="bg-brand-green py-20 text-brand-cream">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-cream/10 px-3 py-1 text-xs font-bold text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            خدمات اجاره
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">فضا و تجهیزات، آماده تولید</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-cream/80">{rental.intro}</p>

          <Button href={rental.cta.href} variant="primary" className="mt-8" icon={<IconArrow className="h-4 w-4 rotate-180" />}>
            {rental.cta.label}
          </Button>
        </div>

        <div className="grid gap-4">
          {rental.features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl border border-brand-cream/15 bg-brand-cream/5 p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gold text-sm font-extrabold text-brand-navy-dark">
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-bold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-cream/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
