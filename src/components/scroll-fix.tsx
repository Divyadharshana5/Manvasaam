"use client";

import { useEffect } from "react";

export function ScrollFix() {
  useEffect(() => {
    // Ensure body can scroll
    const ensureScrollable = () => {
      // Force scroll on html and body
      document.body.style.setProperty('overflow-y', 'auto', 'important');
      document.body.style.setProperty('overflow-x', 'hidden', 'important');
      document.body.style.setProperty('height', 'auto', 'important');
      
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
      document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
      document.documentElement.style.setProperty('height', 'auto', 'important');
      
      // Ensure main containers can scroll
      const containers = document.querySelectorAll('.mobile-container, .scrollable-container, main');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.setProperty('overflow-y', 'auto', 'important');
          container.style.setProperty('height', 'auto', 'important');
        }
      });
    };

    // Apply immediately
    ensureScrollable();

    // Apply after DOM changes
    const observer = new MutationObserver(() => {
      ensureScrollable();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Also apply after any navigation
    const handleRouteChange = () => {
      setTimeout(ensureScrollable, 50);
      setTimeout(ensureScrollable, 200);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('beforeunload', handleRouteChange);
    
    // Clean up navigation classes that might block scrolling
    const cleanupNavigationClasses = () => {
      document.body.classList.remove('page-transitioning');
      document.documentElement.classList.remove('page-transitioning');
      
      // Remove any overflow hidden styles
      const elementsWithHiddenOverflow = document.querySelectorAll('[style*="overflow: hidden"], [style*="overflow-y: hidden"]');
      elementsWithHiddenOverflow.forEach(element => {
        if (element instanceof HTMLElement && !element.classList.contains('dropdown-menu')) {
          element.style.setProperty('overflow-y', 'auto', 'important');
        }
      });
    };

    // Clean up immediately and periodically
    cleanupNavigationClasses();
    const interval = setInterval(() => {
      cleanupNavigationClasses();
      ensureScrollable();
    }, 500);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleRouteChange);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}