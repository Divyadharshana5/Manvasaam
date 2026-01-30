"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

/**
 * Dashboard Language Sync Component
 * Ensures language consistency when navigating to dashboard pages
 * Should be included in dashboard layouts
 */
export function DashboardLanguageSync() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Aggressive language sync for dashboard pages
    const syncDashboardLanguage = () => {
      try {
        const stored = localStorage.getItem("manvaasam-language");
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('manvaasam-language='))
          ?.split('=')[1];
        
        // Determine the correct language
        const correctLanguage = stored || cookieValue || "English";
        
        // If current context doesn't match stored preference, update it
        if (correctLanguage !== selectedLanguage && correctLanguage !== "undefined" && correctLanguage !== "null") {
          console.log(`[DashboardLanguageSync] Correcting language from ${selectedLanguage} to ${correctLanguage}`);
          setSelectedLanguage(correctLanguage as any);
          
          // Ensure both storage mechanisms are in sync
          if (stored !== correctLanguage) {
            localStorage.setItem("manvaasam-language", correctLanguage);
          }
          if (cookieValue !== correctLanguage) {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `manvaasam-language=${correctLanguage};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
          }
        }
      } catch (error) {
        console.warn("[DashboardLanguageSync] Error syncing language:", error);
      }
    };

    // Sync immediately when component mounts
    syncDashboardLanguage();

    // Sync when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncDashboardLanguage();
      }
    };

    // Sync when window gains focus
    const handleFocus = () => {
      syncDashboardLanguage();
    };

    // Listen for custom language change events
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail !== selectedLanguage) {
        console.log(`[DashboardLanguageSync] Received language change event: ${e.detail}`);
        setSelectedLanguage(e.detail);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("languageChange", handleLanguageChange as EventListener);

    // Set up a periodic check as a fallback
    const interval = setInterval(syncDashboardLanguage, 2000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
      clearInterval(interval);
    };
  }, [selectedLanguage, setSelectedLanguage]);

  return null;
}