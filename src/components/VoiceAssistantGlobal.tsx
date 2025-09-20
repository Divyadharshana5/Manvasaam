"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, MicIcon } from "lucide-react";

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
  farmer: "/login/farmer",
  customer: "/login/customer",
  hub: "/login/hub",
  restaurant: "/login/restaurant",
  orders: "/dashboard/orders",
  products: "/dashboard/products",
  faq: "/dashboard/faq",
  marketing: "/dashboard/marketing",
  matchmaking: "/dashboard/matchmaking",
  "voice assistant": "/dashboard/voice-assistant",
  track: "/dashboard/track",
  profile: "/dashboard/profile",
  contact: "/dashboard/contact",
  inventory: "/dashboard/hub/inventory",
  attendance: "/dashboard/hub/attendance",
  privacy: "/privacy",
  terms: "/terms",
  support: "/support",
  help: "/voice-assistant-help",
};

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

  const getLanguage = () => navigator.language.split("-")[0] || "en";

  const analyzeWithAI = async (text: string) => {
    try {
      const response = await fetch("/api/voice-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, routes: Object.keys(ROUTE_ALIASES) }),
      });
      const data = await response.json();
      return data.route || null;
    } catch {
      return getRouteFromText(text);
    }
  };

  const getRouteFromText = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    if (ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES]) {
      return ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES];
    }
    for (const [alias, route] of Object.entries(ROUTE_ALIASES)) {
      if (lowerText.includes(alias)) return route;
    }
    return null;
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = navigator.language;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = navigator.language;

    recognitionRef.current.onstart = () => setIsListening(true);

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      alert(`Voice Input: ${transcript}`);

      const route = await analyzeWithAI(transcript);

      if (route) {
        router.push(route);
      } else {
        const lang = getLanguage();
        const message =
          NOT_FOUND_MESSAGES[lang as keyof typeof NOT_FOUND_MESSAGES] ||
          "Not Found";
        speak(message);
      }
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      alert("Voice recognition error");
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
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
