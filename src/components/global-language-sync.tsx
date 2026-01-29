"use client";

import { useEffect } from "react";

export function GlobalLanguageSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

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