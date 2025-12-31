"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function NavigationPerformance() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    // Track navigation performance
    const trackNavigation = () => {
      if ("performance" in window) {
        // Measure navigation timing
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          const domContentLoaded =
            navigation.domContentLoadedEventEnd - navigation.fetchStart;

          // Log performance metrics (you can send these to analytics)
          console.log("Navigation Performance:", {
            loadTime: `${loadTime}ms`,
            domContentLoaded: `${domContentLoaded}ms`,
            transferSize: navigation.transferSize,
            encodedBodySize: navigation.encodedBodySize,
          });
        }
      }
    };

    // Track when navigation completes
    trackNavigation();

    // Track route changes
    const handleRouteChange = (url: string) => {
      const startTime = performance.now();

      // Track when the route change completes
      const observer = new MutationObserver(() => {
        const endTime = performance.now();
        const routeChangeTime = endTime - startTime;

        console.log("Route Change Performance:", {
          url,
          time: `${routeChangeTime}ms`,
        });

        observer.disconnect();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Listen for route changes (Next.js specific)
    const originalPush = router.push;
    router.push = (...args) => {
      handleRouteChange(args[0] as string);
      return originalPush.apply(router, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, isMounted]);

  return null; // This component doesn't render anything
}
