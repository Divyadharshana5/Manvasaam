/**
 * Navigation Optimizer - Fast page transitions and preloading
 */

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

// Preload critical routes
const CRITICAL_ROUTES = [
  '/dashboard/farmer',
  '/dashboard/hub', 
  '/dashboard/customer',
  '/dashboard/restaurant',
  '/login/farmer',
  '/login/hub',
  '/login/customer', 
  '/login/restaurant'
];

// Navigation performance optimizer
export class NavigationOptimizer {
  private static instance: NavigationOptimizer;
  private preloadedRoutes = new Set<string>();
  private router: any;

  private constructor() {}

  static getInstance(): NavigationOptimizer {
    if (!NavigationOptimizer.instance) {
      NavigationOptimizer.instance = new NavigationOptimizer();
    }
    return NavigationOptimizer.instance;
  }

  setRouter(router: any) {
    this.router = router;
  }

  // Preload route for instant navigation
  preloadRoute(route: string) {
    if (this.preloadedRoutes.has(route)) return;
    
    try {
      this.router?.prefetch(route);
      this.preloadedRoutes.add(route);
    } catch (error) {
      console.warn('Failed to preload route:', route, error);
    }
  }

  // Fast navigation with optimistic UI updates
  navigateWithOptimization(route: string, options?: {
    showLoadingState?: boolean;
    preloadNext?: string[];
  }) {
    const { showLoadingState = true, preloadNext = [] } = options || {};

    // Preload the target route if not already done
    this.preloadRoute(route);

    // Preload next likely routes
    preloadNext.forEach(nextRoute => this.preloadRoute(nextRoute));

    // Navigate with optimistic loading
    if (showLoadingState) {
      // Add loading class to body for global loading state
      document.body.classList.add('page-transitioning');
    }

    // Perform navigation
    this.router?.push(route);

    // Clean up loading state after navigation
    if (showLoadingState) {
      setTimeout(() => {
        document.body.classList.remove('page-transitioning');
      }, 100);
    }
  }

  // Preload all critical routes on app start
  preloadCriticalRoutes() {
    CRITICAL_ROUTES.forEach(route => {
      setTimeout(() => this.preloadRoute(route), 100);
    });
  }
}

// React hook for optimized navigation
export function useOptimizedNavigation() {
  const router = useRouter();
  const optimizer = NavigationOptimizer.getInstance();

  useEffect(() => {
    optimizer.setRouter(router);
    // Preload critical routes after component mount
    const timer = setTimeout(() => {
      optimizer.preloadCriticalRoutes();
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, optimizer]);

  const navigateFast = useCallback((route: string, options?: {
    showLoadingState?: boolean;
    preloadNext?: string[];
  }) => {
    optimizer.navigateWithOptimization(route, options);
  }, [optimizer]);

  const preloadRoute = useCallback((route: string) => {
    optimizer.preloadRoute(route);
  }, [optimizer]);

  return { navigateFast, preloadRoute };
}

// Button hover preloading
export function useHoverPreload() {
  const optimizer = NavigationOptimizer.getInstance();

  const handleHover = useCallback((route: string) => {
    optimizer.preloadRoute(route);
  }, [optimizer]);

  return handleHover;
}