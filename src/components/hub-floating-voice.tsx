"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Bot, X, Volume2, Headphones } from "lucide-react";

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
  { keywords: ["voice help", "help", "commands", "guide"], route: "/dashboard/hub/voice-help", description: "Voice Help" },
  { keywords: ["settings", "preferences", "config", "configuration"], route: "/dashboard/hub/settings", description: "Settings" },
];

export function HubFloatingVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (!lowerText) return;
    
    // Handle stop command
    if (lowerText.includes('stop') || lowerText.includes('cancel')) {
      setResponse("⏹️ Stopped listening.");
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }
    
    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit|check|view|see)\s+/i, "")
      .replace(/\s+(page|section|area)$/i, "")
      .trim();

    // Find exact matches first, then partial matches
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
      setResponse(`🎯 Navigating to ${command.description}...`);
      toast({
        title: "🎤 Voice Navigation",
        description: `Going to ${command.description}`,
        duration: 2000,
      });
      setTimeout(() => {
        router.push(command.route);
        setIsVisible(false);
        setIsListening(false);
        setTranscript("");
        setResponse("");
      }, 1500);
    } else {
      setResponse(`❌ "${cleanText}" not recognized. Try: orders, deliveries, farmers, analytics, inventory, attendance, or help.`);
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
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setIsVisible(true);
      setTranscript("");
      setResponse("");
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
      
      if (finalTranscript.trim()) {
        setTimeout(() => {
          processCommand(finalTranscript);
        }, 500);
      }
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      setResponse("❌ Couldn't hear clearly. Try again.");
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (!transcript) {
        setResponse("❌ No speech detected. Click mic and speak clearly.");
      }
    };

    recognitionRef.current.start();
  }, [processCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (transcript.trim()) {
      processCommand(transcript);
    }
  }, [transcript, processCommand]);

  const toggleWidget = () => {
    if (isListening) {
      return; // Don't toggle when listening, use stop button instead
    } else {
      setTranscript("");
      setResponse("");
      startListening();
    }
  };

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
      {/* Floating Voice Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={toggleWidget}
            size="lg"
            className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600'
            } text-white`}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          {isListening && (
            <Button
              onClick={stopListening}
              size="sm"
              variant="destructive"
              className="text-xs px-3 py-1 h-7"
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Voice Assistant Widget */}
      {isVisible && (
        <div className="fixed bottom-32 right-6 z-40 w-80">
          <Card className="shadow-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Bot className="h-5 w-5 text-green-600" />
                    <Headphones className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-bold text-green-800">🎤 Hub Voice</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeWidget}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {isListening ? (
                  <div className="text-center py-3">
                    <div className="animate-pulse text-red-600 mb-2 flex items-center justify-center gap-2">
                      <Mic className="h-5 w-5" />
                      <span className="font-semibold">🎤 Listening...</span>
                    </div>
                    <p className="text-sm text-gray-600">Speak your command or click Stop</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {transcript && <span className="text-blue-600">Hearing: "{transcript}"</span>}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-2">Click mic to start voice navigation</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="bg-green-100 rounded px-2 py-1 text-green-700">"Orders"</div>
                      <div className="bg-blue-100 rounded px-2 py-1 text-blue-700">"Deliveries"</div>
                      <div className="bg-orange-100 rounded px-2 py-1 text-orange-700">"Farmers"</div>
                      <div className="bg-purple-100 rounded px-2 py-1 text-purple-700">"Analytics"</div>
                      <div className="bg-yellow-100 rounded px-2 py-1 text-yellow-700">"Inventory"</div>
                      <div className="bg-pink-100 rounded px-2 py-1 text-pink-700">"Help"</div>

                    </div>
                  </div>
                )}

                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Volume2 className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-800">You said:</span>
                    </div>
                    <p className="text-sm text-blue-700">"{transcript}"</p>
                  </div>
                )}

                {response && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-semibold text-green-800">Response:</span>
                    </div>
                    <p className="text-sm text-green-700">{response}</p>
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