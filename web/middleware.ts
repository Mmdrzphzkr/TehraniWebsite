import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/utils/jwt-edge';

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

// Paths that require an authenticated session (checked via JWT cookie)
const PROTECTED_PREFIXES = ['/dashboard', '/requests'];

function redirectToAuth(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectUrl = new URL('/auth', request.url);
  redirectUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
  return NextResponse.redirect(redirectUrl);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Allow public paths without authentication
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const payload = token ? await verifyTokenEdge(token) : null;
    if (!payload) {
      return redirectToAuth(request);
    }
  }

  // Admin routes require a specific role
  if (pathname.startsWith('/admin')) {
    const payload = token ? await verifyTokenEdge(token) : null;
    if (!payload) {
      return redirectToAuth(request);
    }

    if (!['SUPER_ADMIN', 'REQUEST_ADMIN'].includes(payload.role)) {
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
