import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/auth',
  '/about',
  '/founder',
  '/courses',
  '/events',
  '/articles',
  '/media',
  '/rental',
  '/contact',
  '/instructors',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Allow public paths without authentication
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Admin routes require specific role
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const payload = verifyToken(token);
    if (!payload || !['SUPER_ADMIN', 'REQUEST_ADMIN'].includes(payload.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
