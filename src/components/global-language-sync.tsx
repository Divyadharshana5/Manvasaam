"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { languageDebug } from "@/lib/language-debug";

export function GlobalLanguageSync() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Make debug available in development
    if (process.env.NODE_ENV === "development") {
      (window as any).langDebug = languageDebug;
    }

    // Force sync on page load - check for any discrepancies
    const checkAndSync = () => {
      const stored = localStorage.getItem("manvaasam-language");
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('manvaasam-language='))
        ?.split('=')[1];
      
      // If localStorage has a different value than current context, sync it
      if (stored && stored !== selectedLanguage && stored !== "undefined" && stored !== "null") {
        console.log(`[GlobalLanguageSync] Syncing language from localStorage: ${stored}`);
        setSelectedLanguage(stored as any);
      }
      // If cookie has a different value than localStorage, update localStorage
      else if (cookieValue && cookieValue !== stored && cookieValue !== selectedLanguage) {
        console.log(`[GlobalLanguageSync] Syncing language from cookie: ${cookieValue}`);
        setSelectedLanguage(cookieValue as any);
      }
    };

    // Check immediately
    checkAndSync();

    // Check when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAndSync();
      }
    };

    // Check when window gains focus
    const handleFocus = () => {
      checkAndSync();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedLanguage, setSelectedLanguage]);

  return null;
}