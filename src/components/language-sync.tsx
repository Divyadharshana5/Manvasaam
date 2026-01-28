"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";

/**
 * LanguageSync component ensures language preferences are synchronized
 * across all pages and components. It should be included in layouts
 * where language consistency is critical.
 */
export function LanguageSync() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const syncAttempts = useRef(0);
  const maxSyncAttempts = 5;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const aggressiveSync = () => {
      try {
        // Check localStorage first (most recent user preference)
        const storedLanguage = localStorage.getItem("manvaasam-language");
        
        // Check cookie as fallback
        const cookieLanguage = document.cookie
          .split('; ')
          .find(row => row.startsWith('manvaasam-language='))
          ?.split('=')[1];
        
        const preferredLanguage = storedLanguage || cookieLanguage;
        
        console.log("[LanguageSync] Current state:", {
          selected: selectedLanguage,
          stored: storedLanguage,
          cookie: cookieLanguage,
          preferred: preferredLanguage,
          attempts: syncAttempts.current
        });
        
        if (preferredLanguage && preferredLanguage !== selectedLanguage && syncAttempts.current < maxSyncAttempts) {
          console.log("[LanguageSync] FORCE syncing language:", preferredLanguage);
          setSelectedLanguage(preferredLanguage as any);
          syncAttempts.current++;
          
          // Try again after a short delay if sync didn't work
          setTimeout(() => {
            if (selectedLanguage !== preferredLanguage && syncAttempts.current < maxSyncAttempts) {
              aggressiveSync();
            }
          }, 100);
        }
      } catch (error) {
        console.warn("[LanguageSync] Error syncing language:", error);
      }
    };

    // Multiple sync attempts with different timings
    aggressiveSync(); // Immediate
    const timeout1 = setTimeout(aggressiveSync, 50);
    const timeout2 = setTimeout(aggressiveSync, 200);
    const timeout3 = setTimeout(aggressiveSync, 500);

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "manvaasam-language" && e.newValue) {
        console.log("[LanguageSync] Storage change detected:", e.newValue);
        setSelectedLanguage(e.newValue as any);
      }
    };

    // Listen for custom language change events
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent?.detail) {
        console.log("[LanguageSync] Custom event detected:", customEvent.detail);
        setSelectedLanguage(customEvent.detail as any);
      }
    };

    // Listen for focus events to sync when returning to tab
    const handleFocus = () => {
      syncAttempts.current = 0; // Reset attempts on focus
      aggressiveSync();
    };

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncAttempts.current = 0; // Reset attempts on visibility
        aggressiveSync();
      }
    };

    // Listen for navigation events
    const handlePopState = () => {
      syncAttempts.current = 0; // Reset attempts on navigation
      setTimeout(aggressiveSync, 100);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // No dependencies to avoid loops

  return null; // This component doesn't render anything
}