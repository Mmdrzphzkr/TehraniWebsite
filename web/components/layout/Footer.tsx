import Link from 'next/link';
import { Container } from '../ui/Container';
import { IconMapPin, IconPhone } from '../ui/icons';

const FOOTER_COLUMNS = [
  {
    title: 'مؤسسه',
    links: [
      { label: 'درباره ما', href: '/about' },
      { label: 'علی عظیم‌زاده طهرانی', href: '/founder' },
      { label: 'اساتید و تیم', href: '/instructors' },
      { label: 'تماس با ما', href: '/contact' }
    ]
  },
  {
    title: 'آموزش',
    links: [
      { label: 'دوره‌ها و کارگاه‌ها', href: '/courses' },
      { label: 'رویدادها', href: '/events' },
      { label: 'دانش‌نامه', href: '/article' },
      { label: 'کتابخانه رسانه', href: '/media' }
    ]
  },
  {
    title: 'خدمات',
    links: [
      { label: 'خدمات اجاره', href: '/rental' },
      { label: 'ورود / ثبت‌نام', href: '/auth/sign-in' },
      { label: 'پنل کاربری', href: '/dashboard' }
    ]
  }
];

export function Footer() {
  return (
    <footer className="bg-brand-navy-dark text-brand-cream">
      <div className="film-strip-divider text-brand-gold/70" aria-hidden="true" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gold text-sm font-extrabold text-brand-navy-dark">
              ط
            </span>
            <span className="text-sm font-extrabold">مؤسسه آزاد سینمایی طهرانی</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-cream/60">
            آموزش حرفه‌ای بازیگری و هنرهای نمایشی؛ از کلاس درس تا صحنه اجرا.
          </p>
          <div className="mt-5 space-y-2 text-sm text-brand-cream/70">
            <div className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>تهران، خیابان نمونه، مؤسسه آزاد سینمایی طهرانی</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 shrink-0 text-brand-gold" />
              <span dir="ltr" className="text-right">
                021-00000000
              </span>
            </div>
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-bold text-brand-gold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-cream/70 transition-colors hover:text-brand-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-brand-cream/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} مؤسسه آزاد سینمایی طهرانی. تمامی حقوق محفوظ است.</span>
          <span>ساخته‌شده با Next.js</span>
        </Container>
      </div>
    </footer>
  );
}
