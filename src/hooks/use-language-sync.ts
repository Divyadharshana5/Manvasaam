"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

/**
 * Custom hook to force language synchronization
 * Use this in any component that needs to ensure language is synced
 */
export function useLanguageSync() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Aggressive sync check - runs on every component mount
    const syncLanguage = () => {
      const stored = localStorage.getItem("manvaasam-language");
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('manvaasam-language='))
        ?.split('=')[1];
      
      // Priority: localStorage > cookie > current context
      const targetLanguage = stored || cookieValue || selectedLanguage;
      
      if (targetLanguage && targetLanguage !== selectedLanguage && targetLanguage !== "undefined" && targetLanguage !== "null") {
        console.log(`[useLanguageSync] Forcing sync to: ${targetLanguage}`);
        setSelectedLanguage(targetLanguage as any);
      }
    };

    // Sync immediately
    syncLanguage();

    // Set up interval to check periodically (for edge cases)
    const interval = setInterval(syncLanguage, 1000);

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncLanguage();
      }
    };

    // Listen for focus events
    const handleFocus = () => {
      syncLanguage();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedLanguage, setSelectedLanguage]);

  return { selectedLanguage, setSelectedLanguage };
}