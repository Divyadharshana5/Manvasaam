"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useMemo } from "react";

export function useFastNavigation() {
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());
  const isNavigatingRef = useRef(false);

  // Prefetch a route with caching - optimized to avoid state updates
  const prefetchRoute = useCallback(
    (route: string) => {
      if (prefetchedRoutes.current.has(route)) {
        return; // Already prefetched
      }

      // Next.js prefetch only (browser-level prefetch can cause hydration issues)
      router.prefetch(route);

      prefetchedRoutes.current.add(route);
    },
    [router]
  );

  // Navigate with instant feedback - optimized
  const navigateInstantly = useCallback(
    (route: string) => {
      if (isNavigatingRef.current) return; // Prevent double navigation

      isNavigatingRef.current = true;

      if (typeof document !== "undefined") {
        document.body.classList.add("page-transitioning");
      }

      // Prefetch one more time for maximum speed
      router.prefetch(route);

      // Navigate
      router.push(route);

      // Haptic feedback for mobile
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(50);
      }

      // Clean up after short delay
      setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.classList.remove("page-transitioning");
        }
        isNavigatingRef.current = false;
      }, 150);
    },
    [router]
  );

  // Bulk prefetch multiple routes - optimized
  const prefetchRoutes = useCallback(
    (routes: string[]) => {
      routes.forEach((route) => {
        if (!prefetchedRoutes.current.has(route)) {
          router.prefetch(route);
          prefetchedRoutes.current.add(route);
        }
      });
    },
    [router]
  );

  // Preload critical resources for a route - optimized
  const preloadRoute = useCallback(
    (route: string) => {
      if (typeof document !== "undefined") {
        const existingPreload = document.querySelector(
          `link[rel="preload"][href="${route}"]`
        );
        if (!existingPreload) {
          const preloadLink = document.createElement("link");
          preloadLink.rel = "preload";
          preloadLink.href = route;
          preloadLink.as = "document";
          document.head.appendChild(preloadLink);
        }
      }

      prefetchRoute(route);
    },
    [prefetchRoute]
  );

  // Cleanup prefetch links on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        const links = document.querySelectorAll(
          'link[rel="prefetch"], link[rel="preload"]'
        );
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && prefetchedRoutes.current.has(href)) {
            link.remove();
          }
        });
      }
    };
  }, []);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      prefetchRoute,
      prefetchRoutes,
      preloadRoute,
      navigateInstantly,
      navigate: navigateInstantly, // Alias for convenience
      preload: prefetchRoute, // Alias for convenience
    }),
    [prefetchRoute, prefetchRoutes, preloadRoute, navigateInstantly]
  );
}
