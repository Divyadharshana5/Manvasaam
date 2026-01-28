/**
 * Language Debug Utilities
 * Use these functions in browser console to debug language issues
 */

export const languageDebug = {
  // Check current language state
  checkLanguageState: () => {
    const localStorage = window.localStorage.getItem("manvaasam-language");
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('manvaasam-language='))
      ?.split('=')[1];
    
    console.log("Language Debug State:", {
      localStorage,
      cookie,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    return { localStorage, cookie };
  },

  // Force set language
  forceSetLanguage: (language: string) => {
    localStorage.setItem("manvaasam-language", language);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `manvaasam-language=${language};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
    
    // Trigger events
    window.dispatchEvent(new CustomEvent("languageChange", { detail: language }));
    window.dispatchEvent(new CustomEvent("forceLanguageSync", { detail: language }));
    
    console.log(`Language force set to: ${language}`);
    return languageDebug.checkLanguageState();
  },

  // Clear all language data
  clearLanguageData: () => {
    localStorage.removeItem("manvaasam-language");
    document.cookie = "manvaasam-language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Language data cleared");
    return languageDebug.checkLanguageState();
  }
};

// Make available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).languageDebug = languageDebug;
}