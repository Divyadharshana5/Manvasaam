"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

// Instant navigation with preloading
export function useFastNavigation() {
  const router = useRouter();

  // Preload critical routes immediately
  useEffect(() => {
    const routes = [
      "/dashboard/farmer",
      "/dashboard/customer", 
      "/dashboard/hub",
      "/dashboard/restaurant",
      "/dashboard/orders",
      "/dashboard/products",
      "/dashboard/profile"
    ];
    
    routes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  const navigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const preload = useCallback((path: string) => {
    router.prefetch(path);
  }, [router]);

  return { navigate, preload };
}