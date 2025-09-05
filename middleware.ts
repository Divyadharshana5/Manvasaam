import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session cookie to check if user is authenticated
  const sessionCookie = request.cookies.get('session');
  const isAuthenticated = !!sessionCookie;
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard/restaurant'
  ];
  
  // Define auth routes that should redirect if already authenticated
  const authRoutes = [
    '/login/farmer',
    '/login/customer',
    '/login/hub', 
    '/login/restaurant'
  ];
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If accessing protected route without authentication, redirect to home
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If accessing auth route while authenticated, redirect to appropriate dashboard
  if (isAuthRoute && isAuthenticated) {
    // All authenticated users redirect to restaurant dashboard
    return NextResponse.redirect(new URL('/dashboard/restaurant', request.url));
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|bg-agri.png|manifest.json).*)',
  ],
};