'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { IconMenu, IconClose, IconSearch } from '../ui/icons';

const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'درباره ما', href: '/about' },
  { label: 'علی عظیم‌زاده طهرانی', href: '/founder' },
  { label: 'اساتید و تیم', href: '/instructors' },
  { label: 'رویدادها', href: '/events' },
  { label: 'دوره‌ها و کارگاه‌ها', href: '/courses' },
  { label: 'دانش‌نامه', href: '/articles' },
  { label: 'کتابخانه رسانه', href: '/media' },
  { label: 'خدمات اجاره', href: '/rental' },
  { label: 'تماس با ما', href: '/contact' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-brand-cream/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-sm font-extrabold text-brand-cream">
            ط
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-extrabold text-brand-navy-dark">مؤسسه آزاد سینمایی طهرانی</span>
            <span className="text-xs font-medium text-brand-navy/60">Tehrani Free Cinema Institute</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.slice(0, 7).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-brand-navy/80 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="جست‌وجو"
            className="grid h-10 w-10 place-items-center rounded-full text-brand-navy/70 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
          >
            <IconSearch className="h-5 w-5" />
          </button>
          <Button href="/auth/sign-in" variant="secondary" className="px-5 py-2.5">
            ورود / ثبت‌نام
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          className="grid h-10 w-10 place-items-center rounded-full text-brand-navy lg:hidden"
        >
          {isMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </Container>

      {isMenuOpen ? (
        <div className="border-t border-brand-navy/10 bg-brand-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-navy/80 hover:bg-brand-navy/5 hover:text-brand-navy"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/auth/sign-in" variant="secondary" className="mt-2 justify-center">
              ورود / ثبت‌نام
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
