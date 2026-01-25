"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

/**
 * LanguageSync component ensures language preferences are synchronized
 * across all pages and components. It should be included in layouts
 * where language consistency is critical.
 */
export function LanguageSync() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncLanguage = () => {
      try {
        // Check localStorage first
        const storedLanguage = localStorage.getItem("manvaasam-language");
        
        // Check cookie as fallback
        const cookieLanguage = document.cookie
          .split('; ')
          .find(row => row.startsWith('manvaasam-language='))
          ?.split('=')[1];
        
        const preferredLanguage = storedLanguage || cookieLanguage;
        
        if (preferredLanguage && preferredLanguage !== selectedLanguage) {
          console.log("[LanguageSync] Syncing language:", preferredLanguage);
          setSelectedLanguage(preferredLanguage as any);
        }
      } catch (error) {
        console.warn("[LanguageSync] Error syncing language:", error);
      }
    };

    // Sync on mount
    syncLanguage();

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
      syncLanguage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedLanguage, setSelectedLanguage]);

  return null; // This component doesn't render anything
}