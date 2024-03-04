import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import APP_ROUTER from './app/lib/config/router';
import { getToken } from './app/actions/tokens';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken();
  if (pathname.includes('sign-up') || pathname.includes('sign-in')) {
    if (token) {
      return NextResponse.redirect(new URL(APP_ROUTER.HOME, request.url));
    }
  }
  if (pathname.includes('new-journey') || pathname.includes('new-order')) {
    if (!token) {
      return NextResponse.redirect(new URL(APP_ROUTER.SIGN_IN, request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
