"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MicIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";

export function VoiceAssistantGlobal() {
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
      farmer: "/dashboard/farmer",
      transport: "/dashboard/transport",
      retail: "/dashboard/retail",
      privacy: "/privacy",
      terms: "/terms",
      support: "/support",
      // General routes
      inventory: "/dashboard/inventory",
      deliveries: "/dashboard/hub/deliveries",
      farmers: "/dashboard/hub/farmers",
      analytics: "/dashboard/hub/analytics",
      settings: "/dashboard/hub/settings",
      overview: "/dashboard/hub",
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
      "overview",
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
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
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
      dashboard: {
        English: "Going to dashboard",
        Tamil: "டாஷ்போர்டுக்கு செல்கிறேன்",
        Hindi: "डैशबोर्ड पर जा रहे हैं",
      },
      orders: {
        English: "Opening orders",
        Tamil: "ஆர்டர்களை திறக்கிறேன்",
        Hindi: "ऑर्डर खोल रहे हैं",
      },
      products: {
        English: "Going to products",
        Tamil: "தயாரிப்புகளுக்கு செல்கிறேன்",
        Hindi: "उत्पादों पर जा रहे हैं",
      },
      track: {
        English: "Opening track orders",
        Tamil: "ஆர்டர் கண்காணிப்பை திறக்கிறேன்",
        Hindi: "ऑर्डर ट्रैकिंग खोल रहे हैं",
      },
      profile: {
        English: "Going to profile",
        Tamil: "சுயவிவரத்திற்கு செல்கிறேன்",
        Hindi: "प्रोफाइल पर जा रहे हैं",
      },
      home: {
        English: "Going to home",
        Tamil: "முகப்புக்கு செல்கிறேன்",
        Hindi: "होम पर जा रहे हैं",
      },
      farmer: {
        English: "Going to farmer login",
        Tamil: "விவசாயி உள்நுழைவுக்கு செல்கிறேன்",
        Hindi: "किसान लॉगिन पर जा रहे हैं",
      },
      transport: {
        English: "Going to transport login",
        Tamil: "போக்குவரத்து உள்நுழைவுக்கு செல்கிறேன்",
        Hindi: "ट्रांसपोर्ट लॉगिन पर जा रहे हैं",
      },
      retail: {
        English: "Going to retail login",
        Tamil: "சில்லறை உள்நுழைவுக்கு செல்கிறேன்",
        Hindi: "रिटेल लॉगिन पर जा रहे हैं",
      },
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
        Tamil: "விநியோगங்களை திறக்கிறேன்",
        Hindi: "डिलीवरी खोल रहे हैं",
      },
      farmers: {
        English: "Opening farmers",
        Tamil: "விவசாயிகளை திறக்கிறேன்",
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
        Tamil: "மேலோட்டத்திற்கு செல்கிறேன்",
        Hindi: "ओवरव्यू पर जा रहे हैं",
      },

      privacy: {
        English: "Opening privacy policy",
        Tamil: "தனியுரிமை கொள்கையை திறக்கிறேன்",
        Hindi: "प्राइवेसी पॉलिसी खोल रहे हैं",
      },
      terms: {
        English: "Opening terms of service",
        Tamil: "சேவை விதிமுறைகளை திறக்கிறேன்",
        Hindi: "सेवा की शर्तें खोल रहे हैं",
      },
      support: {
        English: "Going to support",
        Tamil: "ஆதரவுக்கு செல்கிறேன்",
        Hindi: "सहायता पर जा रहे हैं",
      },
    };

    return (
      messages[page]?.[selectedLanguage] ||
      messages[page]?.["English"] ||
      `Going to ${page}`
    );
  };

  return (
    <Button
      onClick={startListening}
      variant="outline"
      size="sm"
      className={`hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90 ${
        isListening ? "bg-red-500 text-white border-red-500 animate-pulse" : ""
      }`}
      disabled={isListening}
    >
      <MicIcon className="h-4 w-4 mr-2" />
      <span className="font-medium">
        {isListening ? "Listening..." : "Voice Assistant"}
      </span>
    </Button>
  );
}
