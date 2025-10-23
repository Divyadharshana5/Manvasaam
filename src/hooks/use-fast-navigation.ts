/**
 * Fast Navigation Hook - Easy access to optimized navigation
 */

import { useCallback } from "react";
import { useFastNavigation } from "@/lib/navigation-optimizer";

export function useFastNavigationHook() {
  const { navigateWithPreload, preloadRoute } = useFastNavigation();

  // Navigate to a route with instant preloading
  const navigate = useCallback(
    (
      route: string,
      options?: {
        preloadNext?: string[];
        showLoading?: boolean;
      }
    ) => {
      const { preloadNext = [], showLoading = true } = options || {};

      navigateWithPreload(route, preloadNext);
    },
    [navigateWithPreload]
  );

  // Preload a route for instant navigation later
  const preload = useCallback(
    (route: string, priority: "high" | "normal" = "normal") => {
      preloadRoute(route, priority);
    },
    [preloadRoute]
  );

  // Preload multiple routes in batch
  const batchPreload = useCallback(
    (routes: string[], priority: "high" | "normal" = "normal") => {
      routes.forEach((route, index) => {
        setTimeout(() => preloadRoute(route, priority), index * 10);
      });
    },
    [preloadRoute]
  );

  // Navigate with role-based preloading
  const navigateWithRole = useCallback(
    (route: string, userRole?: string) => {
      const roleBasedRoutes: Record<string, string[]> = {
        farmer: ["/dashboard/farmer", "/dashboard/farmer/products"],
        retail: ["/dashboard/retail", "/dashboard/retail/products"],
        transport: ["/dashboard/transport", "/dashboard/transport/orders"],
      };

      const preloadNext = userRole ? roleBasedRoutes[userRole] || [] : [];
      navigateWithPreload(route, preloadNext);
    },
    [navigateWithPreload]
  );

  // Quick navigation to common pages
  const quickNavigate = useCallback(
    {
      home: () => navigate("/"),
      privacy: () => navigate("/privacy"),
      terms: () => navigate("/terms"),
      support: () => navigate("/support"),
      faq: () => navigate("/dashboard/faq"),
      login: (role: string) => navigate(`/login/${role}`),
      dashboard: (role: string) => navigate(`/dashboard/${role}`),
    },
    [navigate]
  );

  return {
    navigate,
    preload,
    batchPreload,
    navigateWithRole,
    quickNavigate,
    // Utility functions
    isPreloaded: (route: string) => {
      // Check if route is in preloaded routes (this would need to be exposed from the optimizer)
      return false; // Placeholder - would need to be implemented
    },
  };
}

// Specialized hooks for different user types
export function useFarmerNavigation() {
  const { navigate, preload } = useFastNavigationHook();

  const navigateToFarmerPages = useCallback(
    (page: string) => {
      const route = `/dashboard/farmer${page ? `/${page}` : ""}`;
      navigate(route, {
        preloadNext: [
          "/dashboard/farmer/products",
          "/dashboard/farmer/matchmaking",
        ],
      });
    },
    [navigate]
  );

  return { navigateToFarmerPages, preload };
}

export function useRetailNavigation() {
  const { navigate, preload } = useFastNavigationHook();

  const navigateToRetailPages = useCallback(
    (page: string) => {
      const route = `/dashboard/retail${page ? `/${page}` : ""}`;
      navigate(route, {
        preloadNext: ["/dashboard/retail/products", "/dashboard/retail/orders"],
      });
    },
    [navigate]
  );

  return { navigateToRetailPages, preload };
}

export function useTransportNavigation() {
  const { navigate, preload } = useFastNavigationHook();

  const navigateToTransportPages = useCallback(
    (page: string) => {
      const route = `/dashboard/transport${page ? `/${page}` : ""}`;
      navigate(route, {
        preloadNext: ["/dashboard/transport/orders", "/dashboard/transport/vehicles"],
      });
    },
    [navigate]
  );

  return { navigateToTransportPages, preload };
}

export function useCustomerNavigation() {
  const { navigate, preload } = useFastNavigationHook();

  const navigateToCustomerPages = useCallback(
    (page: string) => {
      const route = `/dashboard${page ? `/${page}` : ""}`;
      navigate(route, {
        preloadNext: ["/dashboard/products", "/dashboard/orders"],
      });
    },
    [navigate]
  );

  return { navigateToCustomerPages, preload };
}

export function useRestaurantNavigation() {
  const { navigate, preload } = useFastNavigationHook();

  const navigateToRestaurantPages = useCallback(
    (page: string) => {
      const route = `/dashboard/restaurant${page ? `/${page}` : ""}`;
      navigate(route, {
        preloadNext: [
          "/dashboard/restaurant/orders",
          "/dashboard/restaurant/products",
        ],
      });
    },
    [navigate]
  );

  return { navigateToRestaurantPages, preload };
}
