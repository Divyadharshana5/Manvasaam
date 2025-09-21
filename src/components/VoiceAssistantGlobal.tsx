"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, MicIcon } from "lucide-react";
import { isAuthenticated } from "@/lib/auth-redirect";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";


export function VoiceAssistantGlobal() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { selectedLanguage } = useLanguage();

  const routes: Record<string, string> = {
    dashboard: "/dashboard",
    orders: "/dashboard/orders",
    products: "/dashboard/products",
    profile: "/dashboard/profile",
    track: "/dashboard/track",
    inventory: "/dashboard/hub/inventory",
    attendance: "/dashboard/hub/attendance",
    matchmaking: "/dashboard/matchmaking",
    analytics: "/dashboard/hub/analytics",
    farmers: "/dashboard/hub/farmers",
    deliveries: "/dashboard/hub/deliveries",
    settings: "/dashboard/hub/settings",
    faq: "/dashboard/faq",
    help: "/dashboard/faq",
    marketing: "/dashboard/marketing",
    contact: "/dashboard/contact",
    farmer: "/login/farmer",
    customer: "/login/customer",
    hub: "/login/hub",
    restaurant: "/login/restaurant",
    support: "/support",
    privacy: "/privacy",
    terms: "/terms"
  };

  const protectedRoutes = [
    "dashboard", "orders", "products", "profile", "track", "inventory",
    "attendance", "matchmaking", "analytics", "farmers", "deliveries",
    "settings", "faq", "help", "marketing", "contact"
  ];

  const notFoundMessages: Record<string, string> = {
    English: "Not Found",
    Tamil: "கிடைக்கவில்லை",
    Hindi: "नहीं मिला",
    Malayalam: "കണ്ടെത്തിയില്ല",
    Telugu: "కనుగొనబడలేదు",
    Kannada: "ಸಿಗಲಿಲ್ಲ",
    Bengali: "পাওয়া যায়নি",
    Arabic: "غير موجود",
    Urdu: "نہیں ملا",
    Srilanka: "හමු නොවීය"
  };

  const speak = (text: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const languageCodes: Record<string, string> = {
        English: "en-US",
        Tamil: "ta-IN",
        Hindi: "hi-IN",
        Malayalam: "ml-IN",
        Telugu: "te-IN",
        Kannada: "kn-IN",
        Bengali: "bn-IN",
        Arabic: "ar-SA",
        Urdu: "ur-PK",
        Srilanka: "si-LK"
      };
      utterance.lang = languageCodes[selectedLanguage] || "en-US";
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Voice recognition requires Chrome browser.",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (!transcript) return;

      const text = transcript.toLowerCase().trim();
      console.log("Voice:", text);

      // Clean the text
      const cleanText = text
        .replace(/^(go to|navigate to|open|show|take me to|visit)\s+/i, "")
        .trim();

      // Find route
      let foundRoute = null;
      let routeKey = null;

      if (routes[cleanText]) {
        foundRoute = routes[cleanText];
        routeKey = cleanText;
      } else {
        for (const [word, route] of Object.entries(routes)) {
          if (cleanText.includes(word)) {
            foundRoute = route;
            routeKey = word;
            break;
          }
        }
      }

      if (foundRoute) {
        // Check if route needs authentication
        if (routeKey && protectedRoutes.includes(routeKey)) {
          if (!isAuthenticated()) {
            // Store intended route and go to login
            sessionStorage.setItem("redirectAfterLogin", foundRoute);
            router.push("/");
            return;
          }
        }
        
        router.push(foundRoute);
      } else {
        // Not found - speak in selected language
        const message = notFoundMessages[selectedLanguage] || "Not Found";
        speak(message);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Please allow microphone access.",
        });
      }
    };

    recognition.start();
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
