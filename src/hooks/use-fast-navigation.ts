"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface NavigationState {
  isNavigating: boolean;
  currentRoute: string;
  prefetchedRoutes: Set<string>;
}

export function useFastNavigation() {
  const router = useRouter();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
    prefetchedRoutes: new Set(),
  });

  // Prefetch a route with caching
  const prefetchRoute = useCallback((route: string) => {
    if (navigationState.prefetchedRoutes.has(route)) {
      return; // Already prefetched
    }

    // Next.js prefetch
    router.prefetch(route);

    // Browser-level prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);

    // Service Worker prefetch
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_ROUTE',
        route,
      });
    }

    setNavigationState(prev => ({
      ...prev,
      prefetchedRoutes: new Set([...prev.prefetchedRoutes, route]),
    }));
  }, [router, navigationState.prefetchedRoutes]);

  // Navigate with instant feedback
  const navigateInstantly = useCallback((route: string) => {
    setNavigationState(prev => ({ ...prev, isNavigating: true }));

    // Add visual feedback
    document.body.classList.add('page-transitioning');

    // Prefetch one more time for maximum speed
    router.prefetch(route);

    // Navigate
    router.push(route);

    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Clean up after navigation
    setTimeout(() => {
      document.body.classList.remove('page-transitioning');
      setNavigationState(prev => ({ 
        ...prev, 
        isNavigating: false,
        currentRoute: route 
      }));
    }, 300);
  }, [router]);

  // Bulk prefetch multiple routes
  const prefetchRoutes = useCallback((routes: string[]) => {
    routes.forEach(route => prefetchRoute(route));
  }, [prefetchRoute]);

  // Preload critical resources for a route
  const preloadRoute = useCallback((route: string) => {
    // Preload the route
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = route;
    preloadLink.as = 'document';
    document.head.appendChild(preloadLink);

    // Also prefetch it
    prefetchRoute(route);
  }, [prefetchRoute]);

  // Monitor route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setNavigationState(prev => ({
        ...prev,
        currentRoute: window.location.pathname,
        isNavigating: false,
      }));
      document.body.classList.remove('page-transitioning');
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Cleanup prefetch links on unmount
  useEffect(() => {
    return () => {
      const links = document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]');
      links.forEach(link => {
        if (navigationState.prefetchedRoutes.has(link.getAttribute('href') || '')) {
          link.remove();
        }
      });
    };
  }, [navigationState.prefetchedRoutes]);

  return {
    navigationState,
    prefetchRoute,
    prefetchRoutes,
    preloadRoute,
    navigateInstantly,
    isNavigating: navigationState.isNavigating,
    currentRoute: navigationState.currentRoute,
  };
}