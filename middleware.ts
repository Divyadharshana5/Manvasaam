import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for prefetch requests for faster navigation
  const purpose = request.headers.get('purpose');
  const isPrefetch = purpose === 'prefetch' || 
                    request.headers.get('x-middleware-prefetch') ||
                    request.headers.get('x-nextjs-data');
  
  if (isPrefetch) {
    // Add cache headers for prefetch requests
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }
  
  // Get session cookie to check if user is authenticated
  const sessionCookie = request.cookies.get('session');
  const isAuthenticated = !!sessionCookie;
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard/retail',
    '/dashboard/transport'
  ];
  
  // Define auth routes that should redirect if already authenticated
  const authRoutes = [
    '/login/farmer',
    '/login/retail',
    '/login/transport'
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
    // All authenticated users redirect to retail dashboard by default
    return NextResponse.redirect(new URL('/dashboard/retail', request.url));
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