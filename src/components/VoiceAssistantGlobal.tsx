"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, MicIcon } from "lucide-react";
import { isAuthenticated } from "@/lib/auth-redirect";

const KNOWN_ROUTES = [
  "/dashboard",
  "/dashboard/farmer",
  "/dashboard/customer",
  "/dashboard/hub",
  "/dashboard/restaurant",
  "/dashboard/orders",
  "/dashboard/products",
  "/dashboard/faq",
  "/dashboard/marketing",
  "/dashboard/matchmaking",
  "/dashboard/voice-assistant",
  "/dashboard/track",
  "/dashboard/profile",
  "/dashboard/contact",
  "/dashboard/hub/inventory",
  "/dashboard/hub/attendance",
  "/privacy",
  "/terms",
  "/support",
  "/test-dropdown",
  "/test-hub",
  "/test-email",
  "/voice-assistant-help",
];

const ROUTE_ALIASES = {
  dashboard: "/dashboard",
  "go to dashboard": "/dashboard",
  "open dashboard": "/dashboard",
  farmer: "/login/farmer",
  "farmer login": "/login/farmer",
  customer: "/login/customer",
  "customer login": "/login/customer",
  hub: "/login/hub",
  "hub login": "/login/hub",
  restaurant: "/login/restaurant",
  "restaurant login": "/login/restaurant",
  orders: "/dashboard/orders",
  "my orders": "/dashboard/orders",
  "show orders": "/dashboard/orders",
  products: "/dashboard/products",
  "show products": "/dashboard/products",
  "view products": "/dashboard/products",
  faq: "/dashboard/faq",
  marketing: "/dashboard/marketing",
  matchmaking: "/dashboard/matchmaking",
  "voice assistant": "/dashboard/voice-assistant",
  track: "/dashboard/track",
  "track order": "/dashboard/track",
  "track orders": "/dashboard/track",
  profile: "/dashboard/profile",
  "my profile": "/dashboard/profile",
  contact: "/dashboard/contact",
  inventory: "/dashboard/hub/inventory",
  attendance: "/dashboard/hub/attendance",
  privacy: "/privacy",
  terms: "/terms",
  support: "/support",
  help: "/voice-assistant-help",
};

const PROTECTED_ROUTES = [
  "dashboard",
  "go to dashboard",
  "open dashboard",
  "orders",
  "my orders",
  "show orders",
  "products",
  "show products",
  "view products",
  "track",
  "track order",
  "track orders",
  "profile",
  "my profile",
  "inventory",
  "attendance",
  "marketing",
  "matchmaking",
  "contact",
];

const NOT_FOUND_MESSAGES = {
  en: "Not Found",
  hi: "नहीं मिला",
  te: "కనుగొనబడలేదు",
  ta: "கிடைக்கவில்லை",
  bn: "পাওয়া যায়নি",
};

export function VoiceAssistantGlobal() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Replace with your app's language selection logic if available
  const getLanguage = () => {
    // Try to get from localStorage or context if you have a language selector
    return (
      localStorage.getItem("selectedLanguage") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  };

  const checkAuth = () => {
    return isAuthenticated();
  };

  const isProtectedRoute = (routeKey: string) => {
    return PROTECTED_ROUTES.includes(routeKey);
  };

  const analyzeWithAI = async (text: string) => {
    try {
      const response = await fetch("/api/voice-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, routes: Object.keys(ROUTE_ALIASES) }),
      });
      const data = await response.json();
      const routeKey = data.route;
      if (routeKey && ROUTE_ALIASES[routeKey as keyof typeof ROUTE_ALIASES]) {
        return ROUTE_ALIASES[routeKey as keyof typeof ROUTE_ALIASES];
      }
      return null;
    } catch {
      return getRouteFromText(text);
    }
  };

  const getRouteFromText = (text: string) => {
    const lowerText = text.toLowerCase().trim();

    // Exact match first
    if (ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES]) {
      return ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES];
    }

    // Partial match - find the best match
    let bestMatch = null;
    let bestScore = 0;

    for (const [alias, route] of Object.entries(ROUTE_ALIASES)) {
      if (lowerText.includes(alias)) {
        const score = alias.length; // Longer matches are better
        if (score > bestScore) {
          bestMatch = route;
          bestScore = score;
        }
      }
    }

    return bestMatch;
  };

  const speak = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguage();
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLanguage() + "-" + getLanguage().toUpperCase();

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      // Try AI/alias matching first
      let route = await analyzeWithAI(transcript);
      if (!route) {
        route = getRouteFromText(transcript);
      }

      if (route) {
        const routeKey = Object.keys(ROUTE_ALIASES).find(
          (key) => ROUTE_ALIASES[key as keyof typeof ROUTE_ALIASES] === route
        );

        if (routeKey && isProtectedRoute(routeKey)) {
          if (!checkAuth()) {
            sessionStorage.setItem("redirectAfterLogin", route);
            router.push("/");
            return;
          }
        }
        router.push(route);
      } else {
        const lang = getLanguage();
        speak(
          NOT_FOUND_MESSAGES[lang as keyof typeof NOT_FOUND_MESSAGES] ||
            NOT_FOUND_MESSAGES["en"]
        );
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <Button
      onClick={startListening}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white animate-pulse" : ""}
      disabled={isListening}
    >
      {isListening ? (
        <MicIcon className="h-4 w-4 mr-1" />
      ) : (
        <Volume2 className="h-4 w-4 mr-1" />
      )}
      {isListening ? "Listening..." : "Voice"}
    </Button>
  );
}
