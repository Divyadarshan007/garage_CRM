import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const publicRoutes = ['/admin/login'];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (!isPublic && !token && pathname.startsWith('/admin')) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  if (isPublic && token && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
