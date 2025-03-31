import { NextResponse } from 'next/server';

export function middleware (request) {
  console.log('Middleware triggered');
  const path = request.nextUrl.pathname;

  // Get auth token from cookies
  let authToken = request.cookies.get('auth-token')?.value;

  // If the path is exactly '/', redirect to chat page
  if (path === '/') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
  
  // If the path is not login and user is not authenticated, redirect to login
  if (!authToken && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and tries to access login page, redirect to home
  if (authToken && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which paths this middleware should be run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images).*)',
  ],
};
