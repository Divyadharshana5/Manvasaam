"use client";

import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";

/**
 * LanguageDebug component for development - shows current language state
 * Remove this component in production
 */
export function LanguageDebug() {
  const { selectedLanguage, t } = useLanguage();
  const [storageLanguage, setStorageLanguage] = useState<string | null>(null);
  const [cookieLanguage, setCookieLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check localStorage
      const stored = localStorage.getItem("manvaasam-language");
      setStorageLanguage(stored);

      // Check cookie
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('manvaasam-language='))
        ?.split('=')[1];
      setCookieLanguage(cookie || null);
    }
  }, [selectedLanguage]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Language Debug</div>
      <div>Context: {selectedLanguage}</div>
      <div>Storage: {storageLanguage || "null"}</div>
      <div>Cookie: {cookieLanguage || "null"}</div>
      <div>Sample Text: {t?.dashboard?.title || "Loading..."}</div>
    </div>
  );
}