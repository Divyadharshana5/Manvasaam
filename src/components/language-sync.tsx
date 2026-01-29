"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

export function LanguageSync() {
  const { setSelectedLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Simple sync on mount
    const stored = localStorage.getItem("manvaasam-language");
    if (stored) {
      setSelectedLanguage(stored as any);
    }
  }, [setSelectedLanguage]);

  return null;
}