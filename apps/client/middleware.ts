import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import APP_ROUTER from './app/lib/config/router';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('sign-in');

  if (pathname.includes('sign-up') || pathname.includes('sign-in')) {
    if (token && token.value) {
      return NextResponse.redirect(new URL(APP_ROUTER.HOME, request.url));
    }
  }
  if (
    pathname.includes(APP_ROUTER.ADD_NEW_JOURNEY) ||
    pathname.includes(APP_ROUTER.ADD_NEW_DELIVERY_ORDER) ||
    pathname.includes(APP_ROUTER.PROFILE) ||
    pathname.includes(APP_ROUTER.EDIT_JOURNEY) ||
    pathname.includes(APP_ROUTER.EDIT_DELIVERY_ORDER)
  ) {
    if (!token) {
      return NextResponse.redirect(new URL(APP_ROUTER.SIGN_IN, request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
