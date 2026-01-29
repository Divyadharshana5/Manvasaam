/**
 * Language Debug Utilities - Simplified
 */

export const languageDebug = {
  // Check current language state
  check: () => {
    const stored = localStorage.getItem("manvaasam-language");
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('manvaasam-language='))
      ?.split('=')[1];
    
    console.log("Language State:", { stored, cookie });
    return { stored, cookie };
  },

  // Set language and verify
  set: (language: string) => {
    localStorage.setItem("manvaasam-language", language);
    document.cookie = `manvaasam-language=${language};path=/;max-age=31536000`;
    
    // Trigger storage event
    window.dispatchEvent(new StorageEvent("storage", {
      key: "manvaasam-language",
      newValue: language,
      storageArea: localStorage,
    }));
    
    console.log(`Language set to: ${language}`);
    return languageDebug.check();
  },

  // Clear language
  clear: () => {
    localStorage.removeItem("manvaasam-language");
    document.cookie = "manvaasam-language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Language cleared");
    return languageDebug.check();
  }
};

// Make available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).langDebug = languageDebug;
  console.log("Language debug available at: window.langDebug");
}