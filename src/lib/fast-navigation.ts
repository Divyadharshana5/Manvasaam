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
    // Instant navigation
    router.push(path);
  }, [router]);

  const preload = useCallback((path: string) => {
    router.prefetch(path);
  }, [router]);

  return { navigate, preload };
}

// Fast Link component with instant preloading
export function FastLink({ 
  href, 
  children, 
  className = "",
  ...props 
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { navigate, preload } = useFastNavigation();

  return (
    <button
      className={`cursor-pointer ${className}`}
      onMouseEnter={() => preload(href)}
      onClick={() => navigate(href)}
      {...props}
    >
      {children}
    </button>
  );
}