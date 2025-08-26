"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useFastNavigation() {
  const router = useRouter();

  // Preload critical pages
  useEffect(() => {
    // Preload privacy, terms, and support pages
    router.prefetch("/privacy");
    router.prefetch("/terms");
    router.prefetch("/support");
    router.prefetch("/"); // Home page
  }, [router]);

  // Fast navigation function with loading state
  const navigateFast = useCallback((href: string) => {
    // Add loading class to body for instant feedback
    document.body.classList.add("page-transitioning");
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      router.push(href);
      
      // Remove loading class after navigation
      setTimeout(() => {
        document.body.classList.remove("page-transitioning");
      }, 100);
    });
  }, [router]);

  // Keyboard shortcuts for quick navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd + Shift is pressed
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'p':
            event.preventDefault();
            navigateFast("/privacy");
            break;
          case 't':
            event.preventDefault();
            navigateFast("/terms");
            break;
          case 's':
            event.preventDefault();
            navigateFast("/support");
            break;
          case 'h':
            event.preventDefault();
            navigateFast("/");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [navigateFast]);

  return { navigateFast };
}

// CSS for smooth transitions (to be added to globals.css)
export const fastNavigationStyles = `
  .page-transitioning {
    cursor: wait;
  }
  
  .page-transitioning * {
    pointer-events: none;
  }
  
  /* Smooth page transitions */
  .page-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-out, transform 300ms ease-out;
  }
  
  .page-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  .page-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
`;