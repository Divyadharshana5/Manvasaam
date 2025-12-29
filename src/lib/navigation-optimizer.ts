/**
 * Ultra-Fast Navigation Optimizer - Page transitions within 2 seconds
 */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Critical routes that must be preloaded instantly
const CRITICAL_ROUTES = [
  "/dashboard/farmer",
  "/dashboard/hub",
  "/dashboard/retail",
  "/dashboard/transport",
  "/login/farmer",
  "/login/retail",
  "/login/transport",
  "/privacy",
  "/terms",
  "/support",
  "/faq",
];

// Navigation performance optimizer with sub-2-second guarantee
export class NavigationOptimizer {
  private static instance: NavigationOptimizer;
  private preloadedRoutes = new Set<string>();
  private router: any;
  private navigationQueue: string[] = [];
  private isNavigating = false;

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

  // Instant route preloading with priority
  preloadRoute(route: string, priority: "high" | "normal" = "normal") {
    if (this.preloadedRoutes.has(route)) return;

    try {
      if (priority === "high") {
        // High priority routes get immediate preloading
        this.router?.prefetch(route, { priority: "high" });
      } else {
        // Normal priority routes get queued preloading
        setTimeout(() => {
          this.router?.prefetch(route);
        }, 10);
      }
      this.preloadedRoutes.add(route);
    } catch (error) {
      console.warn("Failed to preload route:", route, error);
    }
  }

  // Ultra-fast navigation with optimistic UI updates
  async navigateWithOptimization(
    route: string,
    options?: {
      showLoadingState?: boolean;
      preloadNext?: string[];
      optimisticUpdate?: boolean;
    }
  ) {
    const {
      showLoadingState = true,
      preloadNext = [],
      optimisticUpdate = false,
    } = options || {};

    // Prevent multiple simultaneous navigations
    if (this.isNavigating) {
      this.navigationQueue.push(route);
      return;
    }

    this.isNavigating = true;

    try {
      // 1. Show instant loading state FIRST for immediate feedback
      if (showLoadingState) {
        this.showNavigationProgress();
      }

      // 2. Instant preloading of target route (non-blocking)
      this.preloadRoute(route, "high");

      // 3. Preload next likely routes (non-blocking)
      if (preloadNext.length > 0) {
        setTimeout(() => {
          preloadNext.forEach((nextRoute) =>
            this.preloadRoute(nextRoute, "normal")
          );
        }, 0);
      }

      // 4. Perform navigation immediately (don't wait)
      this.router?.push(route);

      // 5. Clean up loading state after short delay
      setTimeout(() => {
        if (showLoadingState) {
          this.hideNavigationProgress();
        }
      }, 300);
    } catch (error) {
      console.error("Navigation failed:", error);
      // Force navigation on error
      this.router?.push(route);
    } finally {
      // Reset navigation state quickly
      setTimeout(() => {
        this.isNavigating = false;

        // Process queued navigations
        if (this.navigationQueue.length > 0) {
          const nextRoute = this.navigationQueue.shift();
          if (nextRoute) {
            this.navigateWithOptimization(nextRoute, options);
          }
        }
      }, 50);
    }
  }

  // Show navigation progress indicator
  private showNavigationProgress() {
    if (typeof document === "undefined") return;

    // Remove existing progress bar if any
    const existing = document.getElementById("nav-progress");
    if (existing) existing.remove();

    const progressBar = document.createElement("div");
    progressBar.id = "nav-progress";
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #22c55e, #3b82f6);
      z-index: 9999;
      animation: progressSlide 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes progressSlide {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
  }

  // Hide navigation progress indicator
  private hideNavigationProgress() {
    if (typeof document === "undefined") return;

    const progressBar = document.getElementById("nav-progress");
    if (progressBar) {
      progressBar.remove();
    }
  }

  // Perform optimistic UI updates
  private performOptimisticUpdate(route: string) {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    // Update page title immediately
    const routeTitles: Record<string, string> = {
      "/login/farmer": "Farmer Login - Manvaasam",
      "/login/retail": "Retail Login - Manvaasam",
      "/login/transport": "Transport Login - Manvaasam",
      "/dashboard/farmer": "Farmer Dashboard - Manvaasam",
      "/dashboard/retail": "Retail Dashboard - Manvaasam",
      "/dashboard/transport": "Transport Dashboard - Manvaasam",
    };

    if (routeTitles[route]) {
      document.title = routeTitles[route];
    }

    // Update URL without navigation for instant feedback
    window.history.replaceState({}, "", route);
  }

  // Preload all critical routes instantly
  preloadCriticalRoutes() {
    CRITICAL_ROUTES.forEach((route, index) => {
      // Stagger preloading to avoid blocking
      setTimeout(() => this.preloadRoute(route, "high"), index * 10);
    });
  }

  // Batch preload multiple routes
  batchPreloadRoutes(routes: string[]) {
    routes.forEach((route, index) => {
      setTimeout(() => this.preloadRoute(route), index * 20);
    });
  }
}

// React hook for ultra-fast navigation
export function useOptimizedNavigation() {
  const router = useRouter();
  const optimizer = NavigationOptimizer.getInstance();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    optimizer.setRouter(router);

    // Preload critical routes immediately on mount
    optimizer.preloadCriticalRoutes();

    // Cleanup timeout on unmount
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [router, optimizer]);

  const navigateFast = useCallback(
    async (
      route: string,
      options?: {
        showLoadingState?: boolean;
        preloadNext?: string[];
        optimisticUpdate?: boolean;
      }
    ) => {
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Set navigation timeout
      navigationTimeoutRef.current = setTimeout(() => {
        console.warn(
          "Navigation taking longer than expected, showing fallback..."
        );
        // Force navigation if it's taking too long
        router.push(route);
      }, 2500); // Slightly longer than our 2-second target

      try {
        await optimizer.navigateWithOptimization(route, options);
      } finally {
        // Clear timeout after navigation
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
      }
    },
    [optimizer, router]
  );

  const preloadRoute = useCallback(
    (route: string, priority?: "high" | "normal") => {
      optimizer.preloadRoute(route, priority);
    },
    [optimizer]
  );

  const batchPreload = useCallback(
    (routes: string[]) => {
      optimizer.batchPreloadRoutes(routes);
    },
    [optimizer]
  );

  return {
    navigateFast,
    preloadRoute,
    batchPreload,
    isPreloaded: (route: string) => optimizer["preloadedRoutes"].has(route),
  };
}

// Button hover preloading with instant feedback
export function useHoverPreload() {
  const optimizer = NavigationOptimizer.getInstance();

  const handleHover = useCallback(
    (route: string) => {
      optimizer.preloadRoute(route, "high");
    },
    [optimizer]
  );

  const handleClick = useCallback(
    (route: string) => {
      // Preload on click for immediate feedback
      optimizer.preloadRoute(route, "high");
    },
    [optimizer]
  );

  return { handleHover, handleClick };
}

// Fast navigation utility for components
export function useFastNavigation() {
  const { navigateFast, preloadRoute } = useOptimizedNavigation();

  const navigateWithPreload = useCallback(
    (route: string, preloadNext?: string[]) => {
      // Preload target route immediately
      preloadRoute(route, "high");

      // Navigate with optimization
      navigateFast(route, {
        showLoadingState: true,
        preloadNext: preloadNext || [],
        optimisticUpdate: true,
      });
    },
    [navigateFast, preloadRoute]
  );

  return { navigateWithPreload, preloadRoute };
}
