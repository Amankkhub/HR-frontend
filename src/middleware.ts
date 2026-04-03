import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/employees', '/attendance', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear any invalid cookies
    response.cookies.delete('access_token');
    return response;
  }

  // If accessing login with valid token, redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
