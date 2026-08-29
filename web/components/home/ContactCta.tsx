import type { ContactContent } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { IconMapPin, IconPhone, IconArrow } from '../ui/icons';

export function ContactCta({ contact }: { contact: ContactContent }) {
  return (
    <section className="relative overflow-hidden bg-brand-red py-16 text-brand-cream">
      <div className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-brand-navy-dark/20 blur-3xl" />
      <Container className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{contact.headline}</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-cream/85">{contact.supportingCopy}</p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-cream/90">
            <span className="flex items-center gap-1.5">
              <IconPhone className="h-4 w-4" />
              <span dir="ltr">{contact.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <IconMapPin className="h-4 w-4" />
              {contact.address}
            </span>
          </div>
        </div>

        <Button
          href={contact.cta.href}
          variant="secondary"
          className="shrink-0 bg-brand-navy-dark hover:bg-brand-navy"
          icon={<IconArrow className="h-4 w-4 rotate-180" />}
        >
          {contact.cta.label}
        </Button>
      </Container>
    </section>
  );
}
