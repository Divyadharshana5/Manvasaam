"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NavigationMetrics {
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
  totalNavigations: number;
  successRate: number;
}

export function NavigationPerformanceMonitor() {
  const [metrics, setMetrics] = useState<NavigationMetrics>({
    averageTime: 0,
    fastestTime: 0,
    slowestTime: 0,
    totalNavigations: 0,
    successRate: 100,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load metrics from localStorage
    const savedMetrics = localStorage.getItem("navigationMetrics");
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics);
        setMetrics(parsed);
      } catch (error) {
        console.warn("Failed to parse navigation metrics");
      }
    }

    // Show monitor after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Monitor navigation performance
  useEffect(() => {
    const handleNavigationStart = () => {
      const startTime = performance.now();

      // Store start time for this navigation
      sessionStorage.setItem("navStartTime", startTime.toString());
    };

    const handleNavigationEnd = () => {
      const startTime = sessionStorage.getItem("navStartTime");
      if (startTime) {
        const endTime = performance.now();
        const duration = endTime - parseFloat(startTime);

        // Update metrics
        updateMetrics(duration);
        sessionStorage.removeItem("navStartTime");
      }
    };

    // Listen for navigation events
    window.addEventListener("beforeunload", handleNavigationStart);
    window.addEventListener("load", handleNavigationEnd);

    // Listen for route changes in Next.js
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      handleNavigationStart();
      return originalPushState.apply(this, args);
    };

    return () => {
      window.removeEventListener("beforeunload", handleNavigationStart);
      window.removeEventListener("load", handleNavigationEnd);
      history.pushState = originalPushState;
    };
  }, []);

  const updateMetrics = (duration: number) => {
    setMetrics((prev) => {
      const newTotal = prev.totalNavigations + 1;
      const newAverage =
        (prev.averageTime * prev.totalNavigations + duration) / newTotal;
      const newFastest =
        prev.fastestTime === 0
          ? duration
          : Math.min(prev.fastestTime, duration);
      const newSlowest = Math.max(prev.slowestTime, duration);

      const newMetrics = {
        averageTime: newAverage,
        fastestTime: newFastest,
        slowestTime: newSlowest,
        totalNavigations: newTotal,
        successRate: duration < 2000 ? 100 : Math.max(0, prev.successRate - 5), // Penalize slow navigation
      };

      // Save to localStorage
      localStorage.setItem("navigationMetrics", JSON.stringify(newMetrics));
      return newMetrics;
    });
  };

  const getPerformanceColor = (time: number) => {
    if (time < 1000) return "text-green-500";
    if (time < 2000) return "text-yellow-500";
    return "text-red-500";
  };

  const getPerformanceIcon = (time: number) => {
    if (time < 1000) return <Zap className="h-4 w-4 text-green-500" />;
    if (time < 2000) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <Card className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Navigation Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span>Average:</span>
            <span
              className={`font-mono ${getPerformanceColor(
                metrics.averageTime
              )}`}
            >
              {metrics.averageTime.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Fastest:</span>
            <span className="font-mono text-green-500">
              {metrics.fastestTime.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Slowest:</span>
            <span className="font-mono text-red-500">
              {metrics.slowestTime.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Success Rate:</span>
            <span
              className={`font-mono ${
                metrics.successRate >= 95
                  ? "text-green-500"
                  : metrics.successRate >= 80
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {metrics.successRate}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Total:</span>
            <span className="font-mono text-gray-600">
              {metrics.totalNavigations}
            </span>
          </div>

          {/* Performance indicator */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {getPerformanceIcon(metrics.averageTime)}
              <span className="text-xs text-gray-600">
                {metrics.averageTime < 1000
                  ? "Excellent"
                  : metrics.averageTime < 2000
                  ? "Good"
                  : "Needs Improvement"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Hook for tracking navigation performance
export function useNavigationPerformance() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationStart, setNavigationStart] = useState<number | null>(null);

  const startNavigation = () => {
    setIsNavigating(true);
    setNavigationStart(performance.now());
  };

  const endNavigation = () => {
    if (navigationStart) {
      const duration = performance.now() - navigationStart;

      // Update metrics
      const savedMetrics = localStorage.getItem("navigationMetrics");
      if (savedMetrics) {
        try {
          const metrics = JSON.parse(savedMetrics);
          const newTotal = metrics.totalNavigations + 1;
          const newAverage =
            (metrics.averageTime * metrics.totalNavigations + duration) /
            newTotal;
          const newFastest =
            metrics.fastestTime === 0
              ? duration
              : Math.min(metrics.fastestTime, duration);
          const newSlowest = Math.max(metrics.slowestTime, duration);

          const newMetrics = {
            ...metrics,
            averageTime: newAverage,
            fastestTime: newFastest,
            slowestTime: newSlowest,
            totalNavigations: newTotal,
            successRate:
              duration < 2000 ? 100 : Math.max(0, metrics.successRate - 5),
          };

          localStorage.setItem("navigationMetrics", JSON.stringify(newMetrics));
        } catch (error) {
          console.warn("Failed to update navigation metrics");
        }
      }
    }

    setIsNavigating(false);
    setNavigationStart(null);
  };

  return {
    isNavigating,
    startNavigation,
    endNavigation,
  };
}
