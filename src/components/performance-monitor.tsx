"use client";

import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // First Input Delay (FID) and Cumulative Layout Shift (CLS)
      const webVitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.entryType}:`, entry);
        }
      });

      try {
        webVitalsObserver.observe({ entryTypes: ["first-input", "layout-shift"] });
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // Time to First Byte (TTFB)
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          console.log("TTFB:", ttfb);
        }
      });

      return () => {
        observer.disconnect();
        webVitalsObserver.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}