import Link from 'next/link';
import type { MediaItem, MediaType } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import { Badge } from '../ui/Badge';
import { IconPlay } from '../ui/icons';

const MEDIA_LABELS: Record<MediaType, string> = {
  VIDEO: 'ویدئو',
  AUDIO: 'پادکست',
  IMAGE: 'گالری',
  INTERVIEW: 'گفت‌وگو',
  EDUCATIONAL: 'آموزشی',
  OTHER: 'رسانه'
};

const MEDIA_TONES = ['brand-red', 'brand-gold', 'brand-navy', 'brand-green'] as const;

export function MediaSection({ mediaItems }: { mediaItems: MediaItem[] }) {
  return (
    <section className="bg-brand-cream py-20">
      <Container>
        <SectionHeading
          eyebrow="کتابخانه رسانه"
          heading="مستندها، مصاحبه‌ها و پادکست‌های آموزشی"
          description="مجموعه‌ای رو به رشد از رسانه‌های تصویری و صوتی مؤسسه."
          viewAllHref="/media"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mediaItems.map((item, index) => (
            <Link key={item.id} href={`/media/${item.slug}`} className="group block">
              <PlaceholderMedia tone={MEDIA_TONES[index % MEDIA_TONES.length]} className="aspect-square rounded-2xl">
                <span className="absolute top-3 start-3">
                  <Badge tone="neutral" className="bg-brand-cream/90">
                    {MEDIA_LABELS[item.mediaType]}
                  </Badge>
                </span>
                {item.mediaType === 'VIDEO' || item.mediaType === 'INTERVIEW' ? (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-cream/90 text-brand-navy-dark shadow-md transition-transform group-hover:scale-105">
                    <IconPlay className="h-5 w-5 translate-x-[1px]" />
                  </span>
                ) : null}
              </PlaceholderMedia>
              <h3 className="mt-3 text-sm font-bold leading-snug text-brand-navy-dark group-hover:text-brand-red">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
