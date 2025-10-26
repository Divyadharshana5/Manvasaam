"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Voice processing is now handled by the API route

type VoiceState = "idle" | "listening" | "processing";

interface InstantVoiceAssistantProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function InstantVoiceAssistant({ 
  className = "", 
  size = "md" 
}: InstantVoiceAssistantProps) {
  const { selectedLanguage } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  // Fallback keyword-based navigation
  const getRouteFromKeywords = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Common navigation keywords
    const routes: Record<string, string> = {
      "dashboard": "/dashboard",
      "home": "/dashboard",
      "orders": "/dashboard/orders",
      "order": "/dashboard/orders",
      "products": "/dashboard/products",
      "product": "/dashboard/products",
      "profile": "/dashboard/profile",
      "inventory": "/dashboard/farmer/products",
      "stock": "/dashboard/farmer/products",
      "matchmaking": "/dashboard/matchmaking",
      "match": "/dashboard/matchmaking",
      "track": "/dashboard/track",
      "tracking": "/dashboard/track",
      "faq": "/dashboard/faq",
      "help": "/dashboard/faq",
      "marketing": "/dashboard/marketing",
      "farmer": "/dashboard/farmer",
      "retail": "/dashboard/retail",
      "transport": "/dashboard/transport"
    };

    // Find matching route
    for (const [keyword, route] of Object.entries(routes)) {
      if (lowerText.includes(keyword)) {
        return route;
      }
    }
    
    return null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = processAudio;
      
      mediaRecorderRef.current.start();
      setVoiceState("listening");
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && voiceState === "listening") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  }, [voiceState]);

  const processAudio = useCallback(async () => {
    setVoiceState("processing");
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result as string;
          
          // Send to API route for processing
          const response = await fetch('/api/voice-navigation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioDataUri: base64Audio,
              language: selectedLanguage,
            }),
          });

          const result = await response.json();

          if (result.success && result.shouldNavigate && result.pageKey) {
            // Navigate to the requested page
            router.push(result.pageKey);
            setVoiceState("idle");
          } else if (result.success && result.transcript) {
            // Fallback to keyword matching
            const route = getRouteFromKeywords(result.transcript);
            if (route) {
              router.push(route);
              setVoiceState("idle");
            } else {
              speak(getNotFoundMessage());
              setVoiceState("idle");
            }
          } else {
            // No valid result - try keyword fallback or show not found
            speak(getNotFoundMessage());
            setVoiceState("idle");
          }
          
        } catch (error) {
          console.error("Voice processing error:", error);
          speak(getNotFoundMessage());
          setVoiceState("idle");
        }
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error("Audio processing error:", error);
      speak(getNotFoundMessage());
      setVoiceState("idle");
    }
  }, [selectedLanguage, router, getNotFoundMessage]);

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
      
      // Speak immediately
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [selectedLanguage]);

  const handleClick = useCallback(() => {
    if (voiceState === "idle") {
      startRecording();
    } else if (voiceState === "listening") {
      stopRecording();
    }
  }, [voiceState, startRecording, stopRecording]);

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