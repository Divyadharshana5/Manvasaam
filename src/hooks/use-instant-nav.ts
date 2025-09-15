"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useInstantNav() {
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    // Immediate visual feedback
    document.body.classList.add("nav-loading");
    
    // Preload and navigate instantly
    router.prefetch(href);
    
    // Navigate with timeout guarantee
    const navigationPromise = router.push(href);
    
    // Force navigation within 2 seconds
    const timeout = setTimeout(() => {
      window.location.href = href;
    }, 2000);
    
    // Clean up when navigation completes
    navigationPromise.finally(() => {
      clearTimeout(timeout);
      document.body.classList.remove("nav-loading");
    });
    
  }, [router]);

  return { navigate };
}