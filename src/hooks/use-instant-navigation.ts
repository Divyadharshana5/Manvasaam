/**
 * Instant Navigation Hook - For ultra-fast page transitions
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useInstantNavigation() {
  const router = useRouter();

  // Prefetch critical routes on mount
  useEffect(() => {
    const criticalRoutes = [
      "/login/farmer",
      "/login/retail",
      "/login/transport",
      "/dashboard/farmer",
      "/dashboard/retail",
      "/dashboard/transport",
    ];

    // Prefetch all critical routes immediately
    criticalRoutes.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  // Instant navigation with prefetch
  const navigateInstant = useCallback(
    (href: string) => {
      // Prefetch immediately
      router.prefetch(href);
      
      // Navigate instantly
      router.push(href);
    },
    [router]
  );

  // Prefetch on hover
  const prefetchOnHover = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  return {
    navigateInstant,
    prefetchOnHover,
    router,
  };
}
