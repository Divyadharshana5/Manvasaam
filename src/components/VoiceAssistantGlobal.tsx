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
    terms: "/terms",
  };

  const protectedRoutes = [
    "dashboard",
    "orders",
    "products",
    "profile",
    "track",
    "inventory",
    "attendance",
    "matchmaking",
    "analytics",
    "farmers",
    "deliveries",
    "settings",
    "faq",
    "help",
    "marketing",
    "contact",
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
    Srilanka: "හමු නොවීය",
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
        Srilanka: "si-LK",
      };
      utterance.lang = languageCodes[selectedLanguage] || "en-US";
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition only works in Chrome browser");
      return;
    }

    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      
      // Essential settings only
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log("Started listening");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Heard:", transcript);
        
        // Simple word matching
        let targetRoute = null;
        let routeWord = null;
        
        // Check each word in the transcript
        const words = transcript.split(" ");
        for (const word of words) {
          if (routes[word]) {
            targetRoute = routes[word];
            routeWord = word;
            break;
          }
        }
        
        // If no exact word match, check partial matches
        if (!targetRoute) {
          for (const [key, route] of Object.entries(routes)) {
            if (transcript.includes(key)) {
              targetRoute = route;
              routeWord = key;
              break;
            }
          }
        }
        
        if (targetRoute) {
          // Check authentication for protected routes
          if (routeWord && protectedRoutes.includes(routeWord)) {
            if (!isAuthenticated()) {
              sessionStorage.setItem("redirectAfterLogin", targetRoute);
              router.push("/");
              return;
            }
          }
          
          console.log("Navigating to:", targetRoute);
          router.push(targetRoute);
        } else {
          // Page not found - speak in user's language
          const message = notFoundMessages[selectedLanguage] || "Not Found";
          speak(message);
        }
        
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
        
        if (event.error === "not-allowed") {
          alert("Please allow microphone access and try again");
        } else if (event.error === "no-speech") {
          alert("No speech detected. Please try again");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Stopped listening");
      };

      // Start recognition
      recognition.start();
      
    } catch (error) {
      console.error("Recognition failed:", error);
      setIsListening(false);
      alert("Voice recognition failed. Please try again");
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
// removed duplicate/erroneous trailing voice-navigation helpers
