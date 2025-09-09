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
  const [isVisible, setIsVisible] = useState(false);
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
      setTimeout(() => {
        router.push(command.route);
        setIsVisible(false);
        setIsListening(false);
      }, 1500);
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
      setIsVisible(true);
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
        setTimeout(() => {
          processCommand(finalTranscript);
          setIsProcessing(false);
        }, 500);
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

  const closeWidget = () => {
    setIsVisible(false);
    setIsListening(false);
    setTranscript("");
    setResponse("");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

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

      {/* Voice Assistant Widget */}
      {isVisible && (
        <div className="fixed top-20 right-6 z-50 w-96">
          <Card className="shadow-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-green-600" />
                  <span className="font-bold text-green-800">Hub Voice Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeWidget}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {isListening && (
                  <div className="text-center py-3">
                    <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                      <Mic className="h-5 w-5 animate-pulse" />
                      <span className="font-semibold">Listening...</span>
                    </div>
                    <p className="text-sm text-gray-600">Speak your command now</p>
                  </div>
                )}

                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">You said:</span>
                    </div>
                    <p className="text-sm text-blue-700">"{transcript}"</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-green-600">Processing...</span>
                  </div>
                )}

                {response && !isProcessing && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Assistant:</span>
                    </div>
                    <p className="text-sm text-green-700">{response}</p>
                  </div>
                )}

                {!isListening && !transcript && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-3">Try these commands:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded px-2 py-1">"Show orders"</div>
                      <div className="bg-gray-50 rounded px-2 py-1">"Check deliveries"</div>
                      <div className="bg-gray-50 rounded px-2 py-1">"View farmers"</div>
                      <div className="bg-gray-50 rounded px-2 py-1">"Open analytics"</div>
                      <div className="bg-gray-50 rounded px-2 py-1">"Check inventory"</div>
                      <div className="bg-gray-50 rounded px-2 py-1">"Mark attendance"</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}