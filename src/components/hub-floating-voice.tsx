"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";

interface VoiceCommand {
  keywords: string[];
  route: string;
  description: string;
}

const hubCommands: VoiceCommand[] = [
  { keywords: ["overview", "dashboard", "home", "main"], route: "/dashboard/hub", description: "Overview" },
  { keywords: ["orders", "order", "purchase", "sales"], route: "/dashboard/hub/orders", description: "Orders" },
  { keywords: ["deliveries", "delivery", "shipping", "transport"], route: "/dashboard/hub/deliveries", description: "Deliveries" },
  { keywords: ["farmers", "farmer", "suppliers", "growers"], route: "/dashboard/hub/farmers", description: "Farmers" },
  { keywords: ["analytics", "reports", "stats", "data", "charts"], route: "/dashboard/hub/analytics", description: "Analytics" },
  { keywords: ["inventory", "stock", "products", "items"], route: "/dashboard/hub/inventory", description: "Inventory" },
  { keywords: ["attendance", "workers", "staff", "employees"], route: "/dashboard/hub/attendance", description: "Attendance" },
  { keywords: ["settings", "preferences", "config", "configuration"], route: "/dashboard/hub/settings", description: "Settings" },
];

export function HubFloatingVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (!lowerText) return;
    
    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit|check|view|see)\s+/i, "")
      .replace(/\s+(page|section|area)$/i, "")
      .trim();

    let command = hubCommands.find(cmd => 
      cmd.keywords.some(keyword => keyword === cleanText)
    );
    
    if (!command) {
      command = hubCommands.find(cmd => 
        cmd.keywords.some(keyword => 
          cleanText.includes(keyword) || keyword.includes(cleanText)
        )
      );
    }

    if (command) {
      toast({
        title: "🎯 Voice Navigation",
        description: `Going to ${command.description}`,
        duration: 2000,
      });
      setTimeout(() => {
        router.push(command.route);
      }, 1000);
    } else {
      toast({
        variant: "destructive",
        title: "❌ Command Not Found",
        description: `"${cleanText}" not recognized. Try: orders, deliveries, farmers, analytics.`,
        duration: 4000,
      });
    }
  }, [router, toast]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Speech recognition not available in this browser.",
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
      setTranscript("");
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      processCommand(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        variant: "destructive",
        title: "❌ Voice Error",
        description: "Could not recognize speech. Try again.",
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  }, [processCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={isListening ? stopListening : startListening}
        size="sm"
        variant={isListening ? "destructive" : "default"}
        className="h-8 px-3 text-xs"
      >
        {isListening ? (
          <><MicOff className="h-3 w-3 mr-1" />Stop</>
        ) : (
          <><Mic className="h-3 w-3 mr-1" />Voice</>
        )}
      </Button>
      {transcript && (
        <div className="mt-2 p-2 bg-white border rounded shadow-sm text-xs max-w-48">
          "{transcript}"
        </div>
      )}
    </div>
  );
}