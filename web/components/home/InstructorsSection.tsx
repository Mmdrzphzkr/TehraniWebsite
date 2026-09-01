import Link from 'next/link';
import type { Instructor } from '../../lib/types/cms';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PlaceholderMedia } from '../ui/PlaceholderMedia';
import { SwiperCarousel } from '../ui/SwiperCarousel';

function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <Link href={`/instructors/${instructor.slug}`} className="group text-center">
      <PlaceholderMedia
        tone={instructor.avatarColor as 'brand-red'}
        className="mx-auto aspect-square w-full max-w-[9.5rem] rounded-full"
      />
      <h3 className="mt-4 text-sm font-bold text-brand-navy-dark group-hover:text-brand-red">
        {instructor.name}
      </h3>
      <p className="mt-1 text-xs text-slate-500">{instructor.title}</p>
      <span className="mt-2 inline-block rounded-full bg-brand-navy/5 px-3 py-1 text-[11px] font-semibold text-brand-navy/70">
        {instructor.category.name}
      </span>
    </Link>
  );
}

export function InstructorsSection({ instructors }: { instructors: Instructor[] }) {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="اساتید و تیم"
          heading="آموزش با اساتید حرفه‌ای"
          description="گروهی از بازیگران، کارگردانان و مدرسان باتجربه، همراه هنرجویان در مسیر یادگیری."
          viewAllHref="/instructors"
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
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </SwiperCarousel>
        </div>
      </Container>
    </section>
  );
}
