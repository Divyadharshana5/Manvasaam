"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MicIcon } from "lucide-react";

export function VoiceAssistantGlobal() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  const startListening = async () => {
    if (isListening) return;

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Please use Chrome browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        if (transcript.includes("dashboard")) {
          router.push("/dashboard");
        } else if (transcript.includes("farmer")) {
          router.push("/login/farmer");
        } else if (transcript.includes("customer")) {
          router.push("/login/customer");
        } else if (transcript.includes("home")) {
          router.push("/");
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } catch (error) {
      alert("Microphone access denied");
    }
  };

  return (
    <Button
      onClick={startListening}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white animate-pulse" : ""}
    >
      <MicIcon className="h-4 w-4 mr-1" />
      {isListening ? "Listening..." : "Voice"}
    </Button>
  );
}
