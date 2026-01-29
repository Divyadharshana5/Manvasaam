"use client";

import { useEffect } from "react";
import { languageDebug } from "@/lib/language-debug";

export function GlobalLanguageSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Make debug available in development
    if (process.env.NODE_ENV === "development") {
      (window as any).langDebug = languageDebug;
    }

    // Simple force sync on page load
    const stored = localStorage.getItem("manvaasam-language");
    if (stored) {
      // Dispatch storage event to notify language context
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "manvaasam-language",
          newValue: stored,
          storageArea: localStorage,
        })
      );
    }
  }, []);

  return null;
}