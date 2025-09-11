"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Volume2 } from "lucide-react";

const routes = {
  "orders": "/dashboard/hub/orders",
  "order": "/dashboard/hub/orders",
  "deliveries": "/dashboard/hub/deliveries",
  "delivery": "/dashboard/hub/deliveries", 
  "farmers": "/dashboard/hub/farmers",
  "farmer": "/dashboard/hub/farmers",
  "analytics": "/dashboard/hub/analytics",
  "reports": "/dashboard/hub/analytics",
  "inventory": "/dashboard/hub/inventory",
  "stock": "/dashboard/hub/inventory",
  "attendance": "/dashboard/hub/attendance",
  "workers": "/dashboard/hub/attendance",
  "settings": "/dashboard/hub/settings",
  "overview": "/dashboard/hub",
  "dashboard": "/dashboard/hub",
  "home": "/dashboard/hub"
};

export function SimpleVoiceNav() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const processCommand = useCallback((text: string) => {
    const cleanText = text.toLowerCase()
      .replace(/^(go to|open|show|navigate to|take me to|visit)\s+/i, "")
      .replace(/\s+(page|section)$/i, "")
      .trim();

    const route = routes[cleanText as keyof typeof routes];
    
    if (route) {
      toast({
        title: "🎯 Voice Navigation",
        description: `Going to ${cleanText}...`,
        duration: 2000,
      });
      setTimeout(() => router.push(route), 500);
    } else {
      toast({
        variant: "destructive", 
        title: "❌ Command not recognized",
        description: `Try saying: orders, deliveries, farmers, analytics, inventory, attendance`,
        duration: 4000,
      });
    }
  }, [router, toast]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Voice recognition not available in this browser",
        duration: 3000,
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Say a command like 'orders' or 'deliveries'",
        duration: 2000,
      });
    };
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      const errorMsg = event.error === 'no-speech' ? 'No speech detected' : 'Voice recognition error';
      toast({
        variant: "destructive",
        title: "❌ Voice Error",
        description: `${errorMsg}. Please try again.`,
        duration: 3000,
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
    <div className="relative">
      <Button
        onClick={isListening ? stopListening : startListening}
        size="sm"
        className={`transition-all duration-300 hover:scale-105 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
            : 'bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-lg'
        } text-white font-semibold`}
      >
        {isListening ? (
          <><MicOff className="h-3 w-3 mr-1" />Stop</>
        ) : (
          <><Mic className="h-3 w-3 mr-1" />Voice Nav</>
        )}
      </Button>
      
      {isListening && (
        <div className="absolute top-10 right-0 z-50 bg-white border-2 border-green-200 rounded-lg p-2 shadow-xl min-w-48">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Volume2 className="h-3 w-3 animate-pulse" />
            <span>Listening for command...</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Try: "orders", "deliveries", "farmers"
          </div>
        </div>
      )}
    </div>
  );
}