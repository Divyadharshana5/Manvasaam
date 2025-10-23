/**
 * Enhanced Navigation Provider - Ultra-fast page transitions within 2 seconds
 */

"use client";

import { useEffect, useCallback } from "react";
import { useOptimizedNavigation } from "@/lib/navigation-optimizer";
import { useRouter } from "next/navigation";

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const { preloadRoute, navigateFast } = useOptimizedNavigation();
  const router = useRouter();

  // Instant preloading on mount
  useEffect(() => {
    // Preload critical routes immediately
    const criticalRoutes = [
      "/login/farmer",
      "/login/retail",
      "/login/transport",
      "/dashboard/farmer",
      "/dashboard/retail",
      "/dashboard/transport",
      "/privacy",
      "/terms",
      "/support",
      "/faq",
    ];

    // Preload all critical routes instantly
    criticalRoutes.forEach((route) => {
      preloadRoute(route);
    });

    // Preload based on user type if available
    const userType = localStorage.getItem("userType");
    if (userType) {
      const userSpecificRoutes = {
        farmer: ["/dashboard/farmer/products", "/dashboard/farmer/matchmaking"],
        retail: ["/dashboard/retail/products", "/dashboard/retail/orders"],
        transport: ["/dashboard/transport/orders", "/dashboard/transport/vehicles"],
      };

      const routes =
        userSpecificRoutes[userType as keyof typeof userSpecificRoutes];
      if (routes) {
        routes.forEach((route) => preloadRoute(route));
      }
    }
  }, [preloadRoute]);

  // Global navigation optimization
  useEffect(() => {
    // Add global navigation event listeners
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (link && link.href) {
        const url = new URL(link.href);
        const path = url.pathname;
        if (path.startsWith("/")) {
          preloadRoute(path);
        }
      }
    };

    // Add hover preloading for all links
    document.addEventListener("mouseover", handleLinkHover);

    // Preload on focus for accessibility
    const handleLinkFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (link && link.href) {
        const url = new URL(link.href);
        const path = url.pathname;
        if (path.startsWith("/")) {
          preloadRoute(path);
        }
      }
    };

    document.addEventListener("focusin", handleLinkFocus);

    return () => {
      document.removeEventListener("mouseover", handleLinkHover);
      document.removeEventListener("focusin", handleLinkFocus);
    };
  }, [preloadRoute]);

  // Fast navigation with instant feedback
  const handleFastNavigation = useCallback(
    (route: string) => {
      // Show instant loading state
      document.body.classList.add("page-transitioning");

      // Navigate with optimization
      navigateFast(route, {
        showLoadingState: true,
        preloadNext: getNextLikelyRoutes(route),
      });

      // Remove loading state after navigation completes
      setTimeout(() => {
        document.body.classList.remove("page-transitioning");
      }, 100);
    },
    [navigateFast]
  );

  // Get next likely routes to preload
  const getNextLikelyRoutes = (currentRoute: string): string[] => {
    const routeMap: Record<string, string[]> = {
      "/login/farmer": ["/dashboard/farmer", "/dashboard/farmer/products"],
      "/login/retail": ["/dashboard/retail", "/dashboard/retail/products"],
      "/login/transport": ["/dashboard/transport", "/dashboard/transport/orders"],
      "/dashboard/farmer": [
        "/dashboard/farmer/products",
        "/dashboard/farmer/matchmaking",
      ],
      "/dashboard/retail": ["/dashboard/retail/products", "/dashboard/retail/orders"],
      "/dashboard/transport": ["/dashboard/transport/orders", "/dashboard/transport/vehicles"],
    };

    return routeMap[currentRoute] || [];
  };

  // Expose fast navigation globally for use in components
  useEffect(() => {
    (window as any).fastNavigate = handleFastNavigation;
    return () => {
      delete (window as any).fastNavigate;
    };
  }, [handleFastNavigation]);

  return <>{children}</>;
}
