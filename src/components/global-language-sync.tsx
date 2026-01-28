"use client";

import { useEffect } from "react";

/**
 * GlobalLanguageSync - Forces language synchronization on every page load
 * This component runs client-side JavaScript to ensure language persistence
 */
export function GlobalLanguageSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Force language sync on page load
    const forceLanguageSync = () => {
      try {
        const storedLanguage = localStorage.getItem("manvaasam-language");
        if (storedLanguage) {
          console.log("[GlobalLanguageSync] Found stored language:", storedLanguage);
          
          // Dispatch custom event to notify all language contexts
          window.dispatchEvent(
            new CustomEvent("forceLanguageSync", { detail: storedLanguage })
          );
          
          // Also dispatch storage event for cross-component sync
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "manvaasam-language",
              newValue: storedLanguage,
              oldValue: null,
              storageArea: localStorage,
              url: window.location.href
            })
          );
        }
      } catch (error) {
        console.warn("[GlobalLanguageSync] Error:", error);
      }
    };

    // Run immediately and with delays
    forceLanguageSync();
    const timeout1 = setTimeout(forceLanguageSync, 100);
    const timeout2 = setTimeout(forceLanguageSync, 500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return null;
}