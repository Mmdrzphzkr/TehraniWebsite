'use client';

import { useEffect, useState, ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';
import { IconChevronLeft, IconChevronRight } from './icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SwiperCarouselProps {
  children: ReactNode;
  itemsPerView?: number;
  spaceBetween?: number;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
}

export function SwiperCarousel({
  children,
  itemsPerView = 3,
  spaceBetween = 24,
  className,
  autoplay = false,
  autoplayDelay = 5000,
  showArrows = true,
  showDots = true,
  loop = true,
  breakpoints,
}: SwiperCarouselProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const childrenArray = Array.isArray(children) ? children : [children];
  const itemCount = childrenArray.length;

  if (!isMounted) {
    return (
      <div className={cn('flex', className)} style={{ gap: `${spaceBetween}px` }}>
        {childrenArray}
      </div>
    );
  }

  const defaultBreakpoints = {
    0: { slidesPerView: 1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: itemsPerView, spaceBetween },
    ...breakpoints,
  };

  return (
    <div className={cn('relative', className)} dir="rtl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={itemsPerView}
        spaceBetween={spaceBetween}
        loop={loop && itemCount > itemsPerView}
        navigation={showArrows && itemCount > itemsPerView}
        pagination={showDots && itemCount > itemsPerView ? { clickable: true } : false}
        autoplay={autoplay && itemCount > itemsPerView ? { delay: autoplayDelay, disableOnInteraction: false } : false}
        breakpoints={defaultBreakpoints}
        grabCursor={true}
        className="overflow-hidden"
      >
        {childrenArray.map((child, index) => (
          <SwiperSlide key={index} className="h-auto">
            {child}
          </SwiperSlide>
        ))}
        {showArrows && itemCount > itemsPerView && (
          <>
            <div
              className={cn(
                'swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 border border-slate-200 text-brand-navy-dark shadow-md transition-all hover:bg-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2',
                'rtl:rotate-180'
              )}
              slot="button-prev"
              aria-label="اسلاید قبلی"
            >
              <IconChevronLeft className="h-6 w-6" />
            </div>
            <div
              className={cn(
                'swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 border border-slate-200 text-brand-navy-dark shadow-md transition-all hover:bg-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2',
                'rtl:rotate-180'
              )}
              slot="button-next"
              aria-label="اسلاید بعدی"
            >
              <IconChevronRight className="h-6 w-6" />
            </div>
          </>
        )}
        {showDots && itemCount > itemsPerView && (
          <div
            className="swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
            slot="pagination"
          />
        )}
      </Swiper>
    </div>
  );
}