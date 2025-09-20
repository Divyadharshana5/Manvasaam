"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VoiceState = "idle" | "listening" | "processing";

interface ImprovedVoiceAssistantProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ImprovedVoiceAssistant({ 
  className = "", 
  size = "md" 
}: ImprovedVoiceAssistantProps) {
  const { selectedLanguage } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const recognitionRef = useRef<any>(null);

  // Protected routes that require authentication
  const protectedRoutes = [
    "dashboard", "orders", "products", "track", "profile", 
    "inventory", "matchmaking", "analytics", "reports", "settings"
  ];

  // Route mappings for different user types
  const getRouteMapping = useCallback(() => {
    const baseRoutes: Record<string, string> = {
      "home": "/",
      "dashboard": "/dashboard",
      "orders": "/dashboard/orders", 
      "products": "/dashboard/products",
      "track": "/dashboard/track",
      "profile": "/dashboard/profile",
      "faq": "/dashboard/faq",
      "help": "/dashboard/faq",
      "support": "/dashboard/faq"
    };

    // Add user-specific routes based on current path
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/restaurant')) {
      return {
        ...baseRoutes,
        "dashboard": "/dashboard/restaurant",
        "orders": "/dashboard/restaurant/orders",
        "products": "/dashboard/restaurant/products", 
        "inventory": "/dashboard/restaurant/inventory",
        "farmers": "/dashboard/restaurant/farmers",
        "reports": "/dashboard/restaurant/reports",
        "analytics": "/dashboard/restaurant/reports",
        "settings": "/dashboard/restaurant/settings"
      };
    }
    
    if (currentPath.includes('/farmer')) {
      return {
        ...baseRoutes,
        "dashboard": "/dashboard/farmer",
        "products": "/dashboard/farmer/products",
        "matchmaking": "/dashboard/farmer/matchmaking",
        "analytics": "/dashboard/farmer/analytics"
      };
    }
    
    if (currentPath.includes('/hub')) {
      return {
        ...baseRoutes,
        "dashboard": "/dashboard/hub",
        "orders": "/dashboard/hub/orders",
        "inventory": "/dashboard/hub/inventory",
        "attendance": "/dashboard/hub/attendance",
        "analytics": "/dashboard/hub/analytics"
      };
    }

    if (currentPath.includes('/customer')) {
      return {
        ...baseRoutes,
        "dashboard": "/dashboard/customer",
        "cart": "/dashboard/customer/cart",
        "settings": "/dashboard/customer/settings"
      };
    }

    return baseRoutes;
  }, []);

  // Get "Not Found" message in selected language
  const getNotFoundMessage = useCallback(() => {
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
      Srilanka: "හමු නොවීය"
    };
    return messages[selectedLanguage] || "Not Found";
  }, [selectedLanguage]);

  // Check if route requires authentication
  const isProtectedRoute = useCallback((routeKey: string) => {
    return protectedRoutes.includes(routeKey.toLowerCase());
  }, []);

  // Get login page based on current context
  const getLoginPage = useCallback(() => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/restaurant')) return '/login/restaurant';
    if (currentPath.includes('/farmer')) return '/login/farmer'; 
    if (currentPath.includes('/hub')) return '/login/hub';
    if (currentPath.includes('/customer')) return '/login/customer';
    
    // Default to home page which has login options
    return '/';
  }, []);

  // Process voice command and navigate
  const processVoiceCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase().trim();
    const routeMapping = getRouteMapping();
    
    // Remove common navigation words
    const navigationWords = ['go to', 'navigate to', 'open', 'show', 'take me to', 'visit'];
    let targetPage = command;
    
    navigationWords.forEach(word => {
      if (command.includes(word)) {
        targetPage = command.replace(word, '').trim();
      }
    });

    // Find matching route
    const route = routeMapping[targetPage];
    
    if (route) {
      // Check if route requires authentication
      if (isProtectedRoute(targetPage) && !user) {
        // Store the intended destination and redirect to login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', route);
        }
        
        speak(`Please login first. Taking you to login page.`);
        setTimeout(() => {
          router.push(getLoginPage());
        }, 2000);
      } else {
        // Navigate directly
        speak(`Going to ${targetPage}`);
        setTimeout(() => {
          router.push(route);
        }, 1500);
      }
    } else {
      // Page not found
      speak(getNotFoundMessage());
    }
  }, [user, router, getRouteMapping, isProtectedRoute, getLoginPage, getNotFoundMessage]);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selected language
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
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedLanguage]);

  // Start voice recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setVoiceState("listening");
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceState("processing");
      processVoiceCommand(transcript);
      setTimeout(() => setVoiceState("idle"), 3000);
    };

    recognitionRef.current.onerror = (event: any) => {
      setVoiceState("idle");
      toast({
        variant: "destructive",
        title: "Voice Error",
        description: "Could not recognize speech. Please try again.",
      });
    };

    recognitionRef.current.onend = () => {
      if (voiceState === "listening") {
        setVoiceState("idle");
      }
    };

    recognitionRef.current.start();
  }, [processVoiceCommand, toast, voiceState]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceState("idle");
    }
  }, []);

  // Handle button click
  const handleClick = useCallback(() => {
    if (voiceState === "idle") {
      startListening();
    } else if (voiceState === "listening") {
      stopListening();
    }
  }, [voiceState, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const getButtonProps = () => {
    const sizeClasses = {
      sm: "w-10 h-10",
      md: "w-12 h-12", 
      lg: "w-16 h-16"
    };
    
    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-7 w-7"
    };

    switch (voiceState) {
      case "listening":
        return {
          variant: "destructive" as const,
          className: `${sizeClasses[size]} rounded-full ${className} animate-pulse`,
          children: <Square className={iconSizes[size]} />,
          disabled: false
        };
      case "processing":
        return {
          variant: "secondary" as const,
          className: `${sizeClasses[size]} rounded-full ${className}`,
          children: <Loader2 className={`${iconSizes[size]} animate-spin`} />,
          disabled: true
        };
      default:
        return {
          variant: "default" as const,
          className: `${sizeClasses[size]} rounded-full ${className} bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600`,
          children: <Mic className={iconSizes[size]} />,
          disabled: false
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Button
      onClick={handleClick}
      {...buttonProps}
      aria-label={
        voiceState === "listening" 
          ? "Stop recording" 
          : voiceState === "processing"
          ? "Processing voice command"
          : "Start voice command"
      }
    />
  );
}