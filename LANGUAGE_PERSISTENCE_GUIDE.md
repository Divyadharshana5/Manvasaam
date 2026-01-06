# Language Persistence Implementation Guide

## Overview

The Manvaasam application has a complete language persistence system that automatically saves and retrieves the user's language preference across all pages and dashboards.

## How It Works

### 1. **Language Context Setup** (`src/context/language-context.tsx`)

- Provides a React Context for managing language state globally
- Exports `translations` object with 11 languages: English, Tamil, Malayalam, Telugu, Hindi, Kannada, Bengali, Arabic, Urdu, and Srilanka
- Creates `LanguageProvider` component that wraps the entire app

### 2. **Persistence Mechanism**

The language preference is saved in TWO places for redundancy:

- **localStorage**: `localStorage.setItem("manvaasam-language", language)`
- **Cookies**: `document.cookie = "manvaasam-language={language};path=/;max-age=31536000"`

### 3. **Initialization Flow**

When the app loads:

1. `initializeLanguage()` checks localStorage for stored language
2. If found and valid, returns the stored language
3. Otherwise, defaults to "English"
4. This happens automatically when `LanguageProvider` mounts

### 4. **Usage in Components**

Any component can access the current language using the `useLanguage()` hook:

```typescript
import { useLanguage } from "@/context/language-context";

export function MyComponent() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();

  return (
    <div>
      <h1>{t.sidebar.dashboard}</h1>
      <button onClick={() => setSelectedLanguage("Tamil")}>
        Switch to Tamil
      </button>
    </div>
  );
}
```

## Language Selection Flow

```
Home Page → Select Language → Stored in localStorage + Cookies
                                           ↓
                                    Navigate to Dashboard
                                           ↓
                                    LanguageProvider initializes
                                    with saved language
                                           ↓
                                    All dashboard pages use useLanguage()
                                    and display selected language
```

## Components Using Language Persistence

✅ **Home Page** (`src/components/home-page-optimized.tsx`)

- Language selector dropdown in header
- Sets language using `setSelectedLanguage()`

✅ **Dashboard Content** (`src/components/dashboard-content.tsx`)

- Uses `useLanguage()` hook
- Displays dashboard in selected language

✅ **Dashboard Pages**:

- `/dashboard/voice-assistant` - Has language selector
- `/dashboard/products` - Uses language context
- `/dashboard/profile` - Uses language context
- `/dashboard/orders` - Uses language context
- Other dashboard routes - All use language context

✅ **Other Pages**:

- `/privacy` - Uses language context
- `/support` - Uses language context
- `/terms` - Uses language context

## Key Features

### 1. **Automatic Persistence**

- No manual setup needed - just use `setSelectedLanguage()`
- Language automatically saves and persists

### 2. **Instant Updates**

- All components using `useLanguage()` instantly see language changes
- Works across route transitions

### 3. **Resilient**

- Falls back to "English" if stored language is invalid
- Works in mock mode and with Firebase

### 4. **Performance Optimized**

- Uses React Context for efficient updates
- Lazy initialization from localStorage
- SSR-safe with `isMounted` check

## Testing the Language Persistence

1. **On Home Page**:
   - Click the language selector in the header
   - Choose a language (e.g., "Tamil")
2. **Navigate to Dashboard**:
   - The selected language should be active
   - All text displays in the selected language
3. **Refresh the Page**:
   - The selected language persists
   - localStorage was used successfully
4. **Clear localStorage**:
   - App defaults to "English"
   - Selecting a new language re-saves preference

## Troubleshooting

### Language Not Persisting?

1. **Check LanguageProvider is at root**:
   - Verify `<LanguageProvider>` wraps entire app in `src/app/layout.tsx`
2. **Check useLanguage is in client component**:
   - Must use `"use client"` directive
3. **Check localStorage is enabled**:
   - Browser must allow localStorage
   - Some browsers block it in private mode

### Specific Dashboard Not Using Language?

1. **Verify the component uses the hook**:
   ```typescript
   const { t } = useLanguage();
   ```
2. **Check translations exist for that language**:
   - All needed keys must exist in `src/context/language-context.tsx`

## Adding New Languages

To add a new language:

1. **Add to translations object** in `src/context/language-context.tsx`:

   ```typescript
   export const translations = {
     // ... existing languages ...
     Newlanguage: {
       tagline: "...",
       // ... all translation keys ...
     },
   };
   ```

2. **Update languages array** (automatic - pulled from translations keys)

3. **Test**:
   - Selector should show new language
   - Selecting it should persist across pages

## Implementation Details

### Language Context Type

```typescript
interface LanguageContextType {
  selectedLanguage: Language; // Current selected language
  setSelectedLanguage: (language: Language) => void; // Change language
  t: (typeof translations)[Language]; // Current language translations
}
```

### Storage Keys

- **localStorage key**: `"manvaasam-language"`
- **Cookie name**: `"manvaasam-language"`
- **Cookie duration**: 1 year (31536000 seconds)

### Supported Languages

1. English
2. Tamil
3. Malayalam
4. Telugu
5. Hindi
6. Kannada
7. Bengali
8. Arabic
9. Urdu
10. Srilanka

## Summary

✨ **The language persistence system is fully implemented and working!**

Users can:

- ✅ Select language on home page
- ✅ See it persist across all pages
- ✅ Language survives page refreshes
- ✅ Language survives browser restarts (via localStorage + cookies)
