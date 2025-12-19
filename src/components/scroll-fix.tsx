"use client";

import { useEffect } from "react";

export function ScrollFix() {
  useEffect(() => {
    // Ensure body can scroll
    const ensureScrollable = () => {
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
    };

    // Apply immediately
    ensureScrollable();

    // Also apply after any navigation
    const handleRouteChange = () => {
      setTimeout(ensureScrollable, 100);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // Clean up navigation classes that might block scrolling
    const cleanupNavigationClasses = () => {
      document.body.classList.remove('page-transitioning');
      document.documentElement.classList.remove('page-transitioning');
    };

    // Clean up immediately and periodically
    cleanupNavigationClasses();
    const interval = setInterval(cleanupNavigationClasses, 1000);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, []);

  return null;
}