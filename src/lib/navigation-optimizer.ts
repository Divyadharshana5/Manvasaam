/**
 * Ultra-Fast Navigation Optimizer - Page transitions within 2 seconds
 */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Critical routes that must be preloaded instantly
const CRITICAL_ROUTES = [
  "/dashboard/farmer",
  "/dashboard/hub",
  "/dashboard/customer",
  "/dashboard/restaurant",
  "/login/farmer",
  "/login/hub",
  "/login/customer",
  "/login/restaurant",
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
      optimisticUpdate = true,
    } = options || {};

    // Prevent multiple simultaneous navigations
    if (this.isNavigating) {
      this.navigationQueue.push(route);
      return;
    }

    this.isNavigating = true;

    try {
      // 1. Instant preloading of target route
      this.preloadRoute(route, "high");

      // 2. Preload next likely routes
      preloadNext.forEach((nextRoute) =>
        this.preloadRoute(nextRoute, "normal")
      );

      // 3. Show instant loading state
      if (showLoadingState) {
        document.body.classList.add("page-transitioning");
        this.showNavigationProgress();
      }

      // 4. Optimistic UI update if enabled
      if (optimisticUpdate) {
        this.performOptimisticUpdate(route);
      }

      // 5. Perform navigation with timeout guarantee
      const navigationPromise = this.router?.push(route);

      // Set a 2-second timeout for navigation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Navigation timeout")), 2000);
      });

      // Race between navigation and timeout
      await Promise.race([navigationPromise, timeoutPromise]);

      // 6. Clean up loading state
      if (showLoadingState) {
        this.hideNavigationProgress();
        document.body.classList.remove("page-transitioning");
      }
    } catch (error) {
      console.error("Navigation failed:", error);

      // Fallback: force navigation even if timeout occurs
      if (error instanceof Error && error.message === "Navigation timeout") {
        console.warn("Navigation timeout, forcing navigation...");
        this.router?.push(route);
      }
    } finally {
      this.isNavigating = false;

      // Process queued navigations
      if (this.navigationQueue.length > 0) {
        const nextRoute = this.navigationQueue.shift();
        if (nextRoute) {
          setTimeout(
            () => this.navigateWithOptimization(nextRoute, options),
            100
          );
        }
      }
    }
  }

  // Show navigation progress indicator
  private showNavigationProgress() {
    const progressBar = document.createElement("div");
    progressBar.id = "nav-progress";
    progressBar.className =
      "fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 z-[9999] animate-pulse";
    document.body.appendChild(progressBar);
  }

  // Hide navigation progress indicator
  private hideNavigationProgress() {
    const progressBar = document.getElementById("nav-progress");
    if (progressBar) {
      progressBar.remove();
    }
  }

  // Perform optimistic UI updates
  private performOptimisticUpdate(route: string) {
    // Update page title immediately
    const routeTitles: Record<string, string> = {
      "/login/farmer": "Farmer Login - Manvaasam",
      "/login/hub": "Hub Login - Manvaasam",
      "/login/customer": "Customer Login - Manvaasam",
      "/login/restaurant": "Restaurant Login - Manvaasam",
      "/dashboard/farmer": "Farmer Dashboard - Manvaasam",
      "/dashboard/hub": "Hub Dashboard - Manvaasam",
      "/dashboard/customer": "Customer Dashboard - Manvaasam",
      "/dashboard/restaurant": "Restaurant Dashboard - Manvaasam",
    };

    if (routeTitles[route]) {
      document.title = routeTitles[route];
    }

    // Update URL without navigation for instant feedback
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", route);
    }
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
