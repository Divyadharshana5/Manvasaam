"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";

const routes = {
  "orders": "/dashboard/hub/orders",
  "deliveries": "/dashboard/hub/deliveries", 
  "farmers": "/dashboard/hub/farmers",
  "analytics": "/dashboard/hub/analytics",
  "inventory": "/dashboard/hub/inventory",
  "attendance": "/dashboard/hub/attendance",
  "settings": "/dashboard/hub/settings",
  "overview": "/dashboard/hub",
  "dashboard": "/dashboard/hub"
};

export function SimpleVoiceNav() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const processCommand = useCallback((text: string) => {
    const cleanText = text.toLowerCase()
      .replace(/^(go to|open|show|navigate to)\s+/i, "")
      .trim();

    const route = routes[cleanText as keyof typeof routes];
    
    if (route) {
      toast({
        title: "🎯 Navigating",
        description: `Going to ${cleanText}`,
      });
      router.push(route);
    } else {
      toast({
        variant: "destructive", 
        title: "❌ Not found",
        description: `Try: orders, deliveries, farmers, analytics`,
      });
    }
  }, [router, toast]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Voice recognition not available",
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        variant: "destructive",
        title: "Voice error",
        description: "Please try again",
      });
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  }, [processCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      size="sm"
      className={`${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-green-600 hover:bg-green-700'
      } text-white`}
    >
      {isListening ? (
        <><MicOff className="h-3 w-3 mr-1" />Stop</>
      ) : (
        <><Mic className="h-3 w-3 mr-1" />Voice</>
      )}
    </Button>
  );
}