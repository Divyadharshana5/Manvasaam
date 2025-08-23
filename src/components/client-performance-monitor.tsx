"use client";

import dynamic from "next/dynamic";

// Client-side dynamic import for performance monitor
const PerformanceMonitor = dynamic(() => import("@/components/performance-monitor"), {
  ssr: false,
});

export default function ClientPerformanceMonitor() {
  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <PerformanceMonitor />;
}