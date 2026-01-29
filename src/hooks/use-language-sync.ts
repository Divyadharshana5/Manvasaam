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

    // Check localStorage and force sync if different
    const checkAndSync = () => {
      const stored = localStorage.getItem("manvaasam-language");
      if (stored && stored !== selectedLanguage) {
        console.log(`[useLanguageSync] Syncing language: ${stored}`);
        setSelectedLanguage(stored as any);
      }
    };

    // Check immediately
    checkAndSync();

    // Check on focus (when user returns to tab)
    const handleFocus = () => checkAndSync();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedLanguage, setSelectedLanguage]);

  return { selectedLanguage, setSelectedLanguage };
}