"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import AI flows
const speechToText = async (params: any) => {
  const { speechToText } = await import("@/ai/flows/stt-flow");
  return speechToText(params);
};

const understandNavigation = async (params: any) => {
  const { understandNavigation } = await import("@/ai/flows/navigation-flow");
  return understandNavigation(params);
};

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
          
          // Convert speech to text
          const sttResult = await speechToText({
            audioDataUri: base64Audio,
            language: selectedLanguage,
          });
          
          const { transcript } = sttResult;
          
          if (!transcript || transcript.trim() === "") {
            speak(getNotFoundMessage());
            setVoiceState("idle");
            return;
          }

          // Understand navigation intent
          const navResult = await understandNavigation({
            text: transcript,
            language: selectedLanguage,
          });

          if (navResult.shouldNavigate && navResult.pageKey) {
            // Navigate to the requested page
            router.push(navResult.pageKey);
            setVoiceState("idle");
          } else {
            // Page not found - speak "Not Found" in user's language
            speak(getNotFoundMessage());
            setVoiceState("idle");
          }
          
        } catch (error) {
          console.error("AI processing error:", error);
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
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
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