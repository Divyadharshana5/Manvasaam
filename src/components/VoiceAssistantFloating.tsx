"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MicIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";

export function VoiceAssistantFloating() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { selectedLanguage } = useLanguage();

  const startListening = async () => {
    if (isListening) return;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      if (!SpeechRecognition) {
        speak("Please use Chrome browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLanguageCode(selectedLanguage);

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        await processVoiceCommand(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        speak("Voice recognition error");
      };

      recognition.start();
    } catch (error) {
      speak("Microphone access denied");
    }
  };

  const processVoiceCommand = async (transcript: string) => {
    const routeMapping: Record<string, string> = {
      home: "/",
      dashboard: "/dashboard",
      orders: "/dashboard/orders",
      products: "/dashboard/products",
      track: "/dashboard/track",
      profile: "/dashboard/profile",
      matchmaking: "/dashboard/matchmaking",
      faq: "/dashboard/faq",
      help: "/dashboard/faq",
      marketing: "/dashboard/marketing",
      farmer: "/login/farmer",
      customer: "/login/customer",
      hub: "/login/hub",
      restaurant: "/login/restaurant",
      privacy: "/privacy",
      terms: "/terms",
      support: "/support",
      // Hub-specific routes
      inventory: "/dashboard/hub/inventory",
      attendance: "/dashboard/hub/attendance",
      deliveries: "/dashboard/hub/deliveries",
      farmers: "/dashboard/hub/farmers",
      analytics: "/dashboard/hub/analytics",
      settings: "/dashboard/hub/settings",
      overview: "/dashboard/hub"
    };

    const protectedRoutes = [
      "dashboard",
      "orders",
      "products",
      "track",
      "profile",
      "matchmaking",
      "marketing",
      "inventory",
      "attendance",
      "deliveries",
      "farmers",
      "analytics",
      "settings",
      "overview"
    ];

    // Extract page name from transcript - check for multi-word commands first
    const lowerTranscript = transcript.toLowerCase();
    let targetPage = "";

    // Check for exact matches first
    for (const [key, route] of Object.entries(routeMapping)) {
      if (lowerTranscript.includes(key)) {
        targetPage = key;
        break;
      }
    }

    // If no exact match, check individual words
    if (!targetPage) {
      const words = transcript.split(" ");
      for (const word of words) {
        if (routeMapping[word.toLowerCase()]) {
          targetPage = word.toLowerCase();
          break;
        }
      }
    }

    if (!targetPage) {
      speak(getNotFoundMessage());
      return;
    }

    const route = routeMapping[targetPage];
    const requiresAuth = protectedRoutes.includes(targetPage);

    if (requiresAuth && !user) {
      speak(getLoginMessage());
      router.push("/");
      return;
    }

    speak(getNavigationMessage(targetPage));
    router.push(route);
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      speechSynthesis.speak(utterance);
    }
  };

  const getLanguageCode = (language: string): string => {
    const codes: Record<string, string> = {
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
    return codes[language] || "en-US";
  };

  const getNotFoundMessage = (): string => {
    const messages: Record<string, string> = {
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
    return messages[selectedLanguage] || "Not Found";
  };

  const getLoginMessage = (): string => {
    const messages: Record<string, string> = {
      English: "Please login first",
      Tamil: "முதலில் உள்நுழையவும்",
      Hindi: "कृपया पहले लॉगिन करें",
      Malayalam: "ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക",
      Telugu: "దయచేసి మొదట లాగిన్ చేయండి",
      Kannada: "ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ",
      Bengali: "অনুগ্রহ করে প্রথমে লগইন করুন",
      Arabic: "يرجى تسجيل الدخول أولاً",
      Urdu: "پہلے لاگ ان کریں",
      Srilanka: "කරුණාකර මුලින්ම ලොගින් වන්න",
    };
    return messages[selectedLanguage] || "Please login first";
  };

  const getNavigationMessage = (page: string): string => {
    const messages: Record<string, Record<string, string>> = {
      inventory: {
        English: "Opening inventory",
        Tamil: "சரக்கு பட்டியலை திறக்கிறேன்",
        Hindi: "इन्वेंटरी खोल रहे हैं",
      },
      attendance: {
        English: "Opening attendance",
        Tamil: "வருகையை திறக்கிறேன்",
        Hindi: "उपस्थिति खोल रहे हैं",
      },
      deliveries: {
        English: "Opening deliveries",
        Tamil: "விநியோகங்களை திறக்கிறேन்",
        Hindi: "डिलीवरी खोल रहे हैं",
      },
      farmers: {
        English: "Opening farmers",
        Tamil: "விவசायிகளை திறக்கிறேன்",
        Hindi: "किसान खोल रहे हैं",
      },
      analytics: {
        English: "Opening analytics",
        Tamil: "பகுப्पाईवुகளை திறக்கிறேன்",
        Hindi: "एनालिटिक्स खोल रहे हैं",
      },
      settings: {
        English: "Opening settings",
        Tamil: "அமைப்புகளை திறக்கிறேன்",
        Hindi: "सेटिंग्स खोल रहे हैं",
      },
      overview: {
        English: "Going to overview",
        Tamil: "மேலோட्टத्திற्कு செல्கிறேன्",
        Hindi: "ओवरव्यू पर जा रहे हैं",
      },
      orders: {
        English: "Opening orders",
        Tamil: "ஆர்டர்களை திறக்கிறேன்",
        Hindi: "ऑर्डर खोल रहे हैं",
      },
    };

    return (
      messages[page]?.[selectedLanguage] ||
      messages[page]?.["English"] ||
      `Going to ${page}`
    );
  };

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200 ${ 
        isListening ? "bg-red-500/30 animate-pulse" : "hover:bg-white/20"
      }`}
      title={isListening ? "Listening..." : "Click to speak"}
    >
      <MicIcon 
        className={`h-6 w-6 text-white ${
          isListening ? "animate-pulse" : ""
        }`} 
      />
    </button>
  );
}