"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Volume2, Bot, X, Loader2 } from "lucide-react";

interface VoiceCommand {
  keywords: string[];
  route: string;
  description: string;
}

const hubCommands: VoiceCommand[] = [
  { keywords: ["overview", "dashboard", "home"], route: "/dashboard/hub", description: "Go to overview" },
  { keywords: ["orders", "order"], route: "/dashboard/hub/orders", description: "View orders" },
  { keywords: ["deliveries", "delivery"], route: "/dashboard/hub/deliveries", description: "Check deliveries" },
  { keywords: ["farmers", "farmer"], route: "/dashboard/hub/farmers", description: "Manage farmers" },
  { keywords: ["analytics", "reports", "stats"], route: "/dashboard/hub/analytics", description: "View analytics" },
  { keywords: ["inventory", "stock"], route: "/dashboard/hub/inventory", description: "Check inventory" },
  { keywords: ["attendance", "workers"], route: "/dashboard/hub/attendance", description: "Mark attendance" },
  { keywords: ["settings", "preferences"], route: "/dashboard/hub/settings", description: "Open settings" },
  { keywords: ["live tracking", "tracking"], route: "/dashboard/hub/live-tracking", description: "Live tracking" },
];

export function HubVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Remove common navigation words
    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit)\s+/i, "")
      .trim();

    // Find matching command
    const command = hubCommands.find(cmd => 
      cmd.keywords.some(keyword => 
        cleanText.includes(keyword) || keyword.includes(cleanText)
      )
    );

    if (command) {
      setResponse(`Navigating to ${command.description.toLowerCase()}...`);
      router.push(command.route);
      setIsListening(false);
    } else {
      setResponse(`Sorry, I couldn't find "${cleanText}". Try: orders, deliveries, farmers, analytics, inventory, or attendance.`);
    }
  }, [router]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setResponse("");
    };

    recognitionRef.current.onresult = (event) => {
      const results = event.results;
      let finalTranscript = '';
      
      for (let i = 0; i < results.length; i++) {
        if (results[i].isFinal) {
          finalTranscript += results[i][0].transcript;
        } else {
          setTranscript(results[i][0].transcript);
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        setIsProcessing(true);
        processCommand(finalTranscript);
        setIsProcessing(false);
      }
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      setResponse("Sorry, I couldn't hear you clearly. Please try again.");
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (!transcript) {
        setResponse("No speech detected. Please try again.");
      }
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
    <>
      {/* Voice Assistant Button */}
      <Button 
        className={`font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600'
        } text-white`}
        onClick={isListening ? stopListening : startListening}
      >
        <Mic className="mr-2 h-5 w-5" />
        {isListening ? 'Listening...' : 'Voice Assistant'}
      </Button>


    </>
  );
}