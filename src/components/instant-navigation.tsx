"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

interface InstantNavigationProps {
  routes: string[];
  priority?: "high" | "low";
  preloadResources?: boolean;
}

export function InstantNavigation({
  routes,
  priority = "high",
  preloadResources = true,
}: InstantNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all routes immediately
    routes.forEach((route) => {
      router.prefetch(route);
    });

    if (preloadResources) {
      routes.forEach((route) => {
        // Create prefetch link for browser-level optimization - avoid duplicates
        const existingPrefetch = document.querySelector(
          `link[rel="prefetch"][href="${route}"]`
        );
        if (!existingPrefetch) {
          const prefetchLink = document.createElement("link");
          prefetchLink.rel = "prefetch";
          prefetchLink.href = route;
          prefetchLink.as = "document";
          if (priority === "high") {
            prefetchLink.setAttribute("importance", "high");
          }
          document.head.appendChild(prefetchLink);
        }

        // Create preload link for critical routes - avoid duplicates
        if (priority === "high") {
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
      });
    }

    // Cleanup function
    return () => {
      if (preloadResources) {
        const links = document.querySelectorAll(
          'link[rel="prefetch"], link[rel="preload"]'
        );
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && routes.includes(href)) {
            link.remove();
          }
        });
      }
    };
  }, [routes, router, priority, preloadResources]);

  return null; // This component doesn't render anything
}

// Hook for instant navigation with optimizations
export function useInstantNavigation() {
  const router = useRouter();

  const navigateInstantly = useCallback(
    (href: string) => {
      // Prefetch one more time right before navigation for maximum speed
      router.prefetch(href);

      // Navigate immediately
      router.push(href);

      // Optional: Add haptic feedback for mobile devices
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
    },
    [router]
  );

  const prefetchRoute = useCallback(
    (href: string) => {
      router.prefetch(href);

      // Also add browser-level prefetch - avoid duplicates
      const existingLink = document.querySelector(
        `link[rel="prefetch"][href="${href}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        link.as = "document";
        document.head.appendChild(link);
      }
    },
    [router]
  );

  return { navigateInstantly, prefetchRoute };
}
