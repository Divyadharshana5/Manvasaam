"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, MicIcon } from "lucide-react";
import { isAuthenticated } from "@/lib/auth-redirect";
import ReliableVoiceNavigation from "./reliable-voice-navigation";

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

  const routes = {
    "dashboard": "/dashboard",
    "orders": "/dashboard/orders",
    "products": "/dashboard/products",
    "profile": "/dashboard/profile",
    "farmer": "/login/farmer",
    "customer": "/login/customer",
    "hub": "/login/hub",
    "restaurant": "/login/restaurant",
    "inventory": "/dashboard/hub/inventory",
    "attendance": "/dashboard/hub/attendance",
    "track": "/dashboard/track",
    "matchmaking": "/dashboard/matchmaking",
    "analytics": "/dashboard/hub/analytics",
    "farmers": "/dashboard/hub/farmers",
    "deliveries": "/dashboard/hub/deliveries",
    "settings": "/dashboard/hub/settings",
    "faq": "/dashboard/faq",
    "help": "/dashboard/faq",
    "support": "/support",
    "marketing": "/dashboard/marketing",
    "voice": "/dashboard/voice-assistant",
    "privacy": "/privacy",
    "terms": "/terms",
    "contact": "/dashboard/contact"
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Voice recognition requires Chrome browser. Please switch to Chrome.",
      });
      return;
    }

    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (!transcript) return;
        
        const text = transcript.toLowerCase().trim();
        console.log('Voice input:', text);
        
        // Remove common navigation words
        const cleanText = text
          .replace(/^(go to|navigate to|open|show|take me to|visit)\s+/i, '')
          .trim();
        
        // Find matching route
        let foundRoute = null;
        
        // Exact match first
        if (routes[cleanText]) {
          foundRoute = routes[cleanText];
        } else {
          // Partial match
          for (const [word, route] of Object.entries(routes)) {
            if (cleanText.includes(word) || text.includes(word)) {
              foundRoute = route;
              break;
            }
          }
        }
        
        if (foundRoute) {
          console.log('Navigating to:', foundRoute);
          router.push(foundRoute);
          
          // Provide audio feedback
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(`Going to ${cleanText}`);
            utterance.lang = 'en-US';
            utterance.rate = 1.2;
            utterance.volume = 0.7;
            window.speechSynthesis.speak(utterance);
          }
        } else {
          console.log('No route found for:', text);
          toast({
            variant: "destructive",
            title: "Command Not Found",
            description: `Could not find "${cleanText}". Try saying: dashboard, orders, products, farmer, customer, hub, or restaurant.`,
          });
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.error('Voice recognition error:', event.error);
        
        let errorMessage = 'Voice recognition failed. Please try again.';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow permissions.';
            break;
          case 'network':
            errorMessage = 'Network error. Check your connection.';
            break;
        }
        
        toast({
          variant: "destructive",
          title: "Voice Error",
          description: errorMessage,
        });
      };

      recognition.start();
    } catch (error) {
      setIsListening(false);
      console.error('Failed to start voice recognition:', error);
      toast({
        variant: "destructive",
        title: "Voice Error",
        description: 'Failed to start voice recognition. Please try again.',
      });
    }
  };

  return (
    <Button
      onClick={startVoice}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white animate-pulse" : ""}
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

// Keep the old implementation as a fallback
function VoiceAssistantGlobalOld() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Always create a new recognition instance for each click (most reliable)
  const createRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return null;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLocale();
    return recognition;
  };

  // Map language code to locale for speech recognition
  const getLocale = () => {
    const lang = getLanguage();
    switch (lang) {
      case "en":
        return "en-US";
      case "hi":
        return "hi-IN";
      case "te":
        return "te-IN";
      case "ta":
        return "ta-IN";
      case "bn":
        return "bn-IN";
      default:
        return lang + "-" + lang.toUpperCase();
    }
  };

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
    const recognition = createRecognition();
    if (!recognition) return;

    setIsListening(true);

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      console.log("Voice input:", transcript);
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
            setIsListening(false);
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
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === "not-allowed" || e.error === "denied") {
        alert(
          "Microphone access denied. Please allow microphone permissions in your browser settings."
        );
      }
      console.error("Recognition error", e);
    };
    recognition.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended");
    };

    try {
      recognition.start();
      console.log("Recognition started");
    } catch (err) {
      setIsListening(false);
      alert(
        "Could not start voice recognition. Please check your browser and microphone permissions."
      );
      console.error("Recognition start error", err);
    }
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
