"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { Mic, MicOff, Volume2, X, Loader2, HelpCircle } from "lucide-react";

interface VoiceCommand {
  keywords: string[];
  route: string;
  description: string;
  category: string;
}

const hubCommands: VoiceCommand[] = [
  { keywords: ["overview", "dashboard", "home", "main"], route: "/dashboard/hub", description: "Overview", category: "Navigation" },
  { keywords: ["orders", "order", "purchase", "sales"], route: "/dashboard/hub/orders", description: "Orders", category: "Operations" },
  { keywords: ["deliveries", "delivery", "shipping", "transport"], route: "/dashboard/hub/deliveries", description: "Deliveries", category: "Operations" },
  { keywords: ["farmers", "farmer", "suppliers", "growers"], route: "/dashboard/hub/farmers", description: "Farmers", category: "Management" },
  { keywords: ["analytics", "reports", "stats", "data", "charts"], route: "/dashboard/hub/analytics", description: "Analytics", category: "Reports" },
  { keywords: ["inventory", "stock", "products", "items"], route: "/dashboard/hub/inventory", description: "Inventory", category: "Management" },
  { keywords: ["attendance", "workers", "staff", "employees"], route: "/dashboard/hub/attendance", description: "Attendance", category: "Management" },
  { keywords: ["settings", "preferences", "config"], route: "/dashboard/hub/settings", description: "Settings", category: "System" },
  { keywords: ["live tracking", "tracking", "location"], route: "/dashboard/hub/live-tracking", description: "Live Tracking", category: "Operations" },
  { keywords: ["voice help", "help", "commands"], route: "/dashboard/hub/voice-help", description: "Voice Help", category: "Support" },
];

export function HubVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (!lowerText) {
      toast({
        variant: "destructive",
        title: "🎤 No Speech Detected",
        description: "Please speak clearly and try again.",
      });
      return;
    }

    // Enhanced text cleaning
    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit|check|view|see)\s+/i, "")
      .replace(/\s+(page|section|area|dashboard)$/i, "")
      .replace(/the\s+/gi, "")
      .trim();

    // Exact match first
    let command = hubCommands.find(cmd => 
      cmd.keywords.some(keyword => keyword === cleanText)
    );
    
    // Partial match if no exact match
    if (!command) {
      command = hubCommands.find(cmd => 
        cmd.keywords.some(keyword => 
          cleanText.includes(keyword) || keyword.includes(cleanText)
        )
      );
    }

    if (command) {
      // Check if already on the page
      if (pathname === command.route) {
        toast({
          title: "📍 Already Here",
          description: `You're already on the ${command.description} page.`,
          duration: 2000,
        });
      } else {
        toast({
          title: "🎯 Voice Navigation",
          description: `Navigating to ${command.description}...`,
          duration: 2000,
        });
        setTimeout(() => {
          router.push(command.route);
        }, 800);
      }
    } else {
      // Suggest similar commands
      const suggestions = hubCommands
        .filter(cmd => cmd.keywords.some(k => k.includes(cleanText.split(' ')[0])))
        .slice(0, 3)
        .map(cmd => cmd.description)
        .join(", ");
      
      toast({
        variant: "destructive",
        title: "❌ Command Not Found",
        description: suggestions 
          ? `"${cleanText}" not recognized. Try: ${suggestions}`
          : `"${cleanText}" not recognized. Say "help" for available commands.`,
        duration: 5000,
      });
    }
  }, [router, toast, pathname]);

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
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript("");
      toast({
        title: "🎤 Listening...",
        description: "Speak your command now",
        duration: 1500,
      });
      
      // Auto-stop after 5 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 5000);
    };

    recognitionRef.current.onresult = (event) => {
      const results = event.results;
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = 0; i < results.length; i++) {
        if (results[i].isFinal) {
          finalTranscript += results[i][0].transcript;
        } else {
          interimTranscript += results[i][0].transcript;
        }
      }
      
      setTranscript(interimTranscript || finalTranscript);
      
      if (finalTranscript) {
        setIsProcessing(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setTimeout(() => {
          processCommand(finalTranscript);
          setIsProcessing(false);
          setIsListening(false);
        }, 500);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const errorMessages = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not accessible. Check permissions.',
        'not-allowed': 'Microphone access denied. Enable in browser settings.',
        'network': 'Network error. Check your connection.',
      };
      
      const message = errorMessages[event.error as keyof typeof errorMessages] || 'Speech recognition error. Please try again.';
      
      toast({
        variant: "destructive",
        title: "❌ Voice Error",
        description: message,
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current.start();
  }, [processCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  const toggleCommands = () => {
    setShowCommands(!showCommands);
  };

  return (
    <div className="relative">
      {/* Main Voice Button */}
      <div className="flex items-center gap-2">
        <Button 
          className={`font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : isProcessing
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600'
          } text-white`}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
          ) : isListening ? (
            <><MicOff className="mr-2 h-4 w-4" />Stop</>
          ) : (
            <><Mic className="mr-2 h-4 w-4" />Voice</>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCommands}
          className="h-8 px-2"
        >
          <HelpCircle className="h-3 w-3" />
        </Button>
      </div>

      {/* Live Transcript */}
      {(isListening || transcript) && (
        <div className="absolute top-12 right-0 z-50 min-w-64 max-w-80">
          <Card className="shadow-lg border-2 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {isProcessing ? "Processing..." : isListening ? "Listening..." : "Heard:"}
                </span>
              </div>
              <p className="text-sm text-gray-700 min-h-[20px]">
                {transcript || "Speak now..."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commands Help */}
      {showCommands && (
        <div className="absolute top-12 right-0 z-50 w-80">
          <Card className="shadow-xl border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800">Voice Commands</h3>
                <Button variant="ghost" size="sm" onClick={toggleCommands}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(
                  hubCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                  }, {} as Record<string, VoiceCommand[]>)
                ).map(([category, commands]) => (
                  <div key={category}>
                    <Badge variant="secondary" className="mb-2">{category}</Badge>
                    <div className="space-y-1 ml-2">
                      {commands.map((cmd, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-green-700">{cmd.description}:</span>
                          <span className="text-gray-600 ml-1">
                            "{cmd.keywords.slice(0, 2).join('", "')}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                💡 Say "go to [page]" or just the page name
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}