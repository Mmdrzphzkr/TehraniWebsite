import Link from 'next/link';
import type { MediaItem, MediaType } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import { Badge } from '../ui/Badge';
import { IconPlay } from '../ui/icons';
import { SwiperCarousel } from '../ui/SwiperCarousel';

const MEDIA_LABELS: Record<MediaType, string> = {
  VIDEO: 'ویدئو',
  AUDIO: 'پادکست',
  IMAGE: 'گالری',
  INTERVIEW: 'گفت‌وگو',
  EDUCATIONAL: 'آموزشی',
  OTHER: 'رسانه'
};

const MEDIA_TONES = ['brand-red', 'brand-gold', 'brand-navy', 'brand-green'] as const;

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  return (
    <Link href={`/media/${item.slug}`} className="group block">
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
  );
}

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

        <div className="mt-10">
          <SwiperCarousel itemsPerView={4} spaceBetween={24} showArrows={true} showDots={true} loop={true}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {mediaItems.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} />
            ))}
          </SwiperCarousel>
        </div>
      </Container>
    </section>
  );
}
