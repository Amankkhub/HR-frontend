import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Just pass through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
