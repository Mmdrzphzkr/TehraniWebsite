import Link from 'next/link';
import type { EventItem } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { IconClock, IconMapPin } from '../ui/icons';

export function EventsSection({ events }: { events: EventItem[] }) {
  return (
    <section className="bg-brand-cream py-20">
      <Container>
        <SectionHeading
          eyebrow="رویدادها"
          heading="رویدادهای پیش رو"
          description="اکران‌ها، نشست‌های تخصصی و نمایش‌های صحنه‌ای مؤسسه را دنبال کنید."
          viewAllHref="/events"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {events.map((event) => {
            const [year, month, day] = event.date.split('/');
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group relative flex overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Ticket-stub date block */}
                <div className="relative flex w-24 shrink-0 flex-col items-center justify-center bg-brand-navy text-brand-cream">
                  <span className="text-2xl font-extrabold">{day}</span>
                  <span className="mt-1 text-xs text-brand-cream/70">
                    {month}/{year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center justify-between">
                    <Badge tone="green">{event.category}</Badge>
                    {event.isFull ? <Badge tone="red">ظرفیت تکمیل</Badge> : null}
                  </div>
                  <h3 className="text-base font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                    {event.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">{event.shortDescription}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <IconClock className="h-3.5 w-3.5" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconMapPin className="h-3.5 w-3.5" />
                      {event.venue}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
