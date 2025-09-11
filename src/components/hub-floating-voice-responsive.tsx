"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { Mic, MicOff, Volume2, X, Minimize2, Maximize2 } from "lucide-react";

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
  { keywords: ["analytics", "reports", "stats", "data"], route: "/dashboard/hub/analytics", description: "Analytics" },
  { keywords: ["inventory", "stock", "products", "items"], route: "/dashboard/hub/inventory", description: "Inventory" },
  { keywords: ["attendance", "workers", "staff", "employees"], route: "/dashboard/hub/attendance", description: "Attendance" },
  { keywords: ["settings", "preferences", "config"], route: "/dashboard/hub/settings", description: "Settings" },
  { keywords: ["live tracking", "tracking", "location"], route: "/dashboard/hub/live-tracking", description: "Live Tracking" },
];

export function HubFloatingVoiceResponsive() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (!lowerText) return;

    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit|check|view|see)\s+/i, "")
      .replace(/\s+(page|section|area|dashboard)$/i, "")
      .replace(/the\s+/gi, "")
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
      if (pathname === command.route) {
        toast({
          title: "📍 Already Here",
          description: `You're on ${command.description}`,
          duration: 2000,
        });
      } else {
        toast({
          title: "🎯 Navigating",
          description: `Going to ${command.description}`,
          duration: 2000,
        });
        setTimeout(() => {
          router.push(command.route);
        }, 800);
      }
    } else {
      toast({
        variant: "destructive",
        title: "❌ Not Found",
        description: `"${cleanText}" not recognized`,
        duration: 3000,
      });
    }
  }, [router, toast, pathname]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Speech recognition not available",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setIsMinimized(false);
      
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 4000);
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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setTimeout(() => {
          processCommand(finalTranscript);
          setIsListening(false);
          setTimeout(() => setIsMinimized(true), 2000);
        }, 500);
      }
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setTimeout(() => setIsMinimized(true), 1000);
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
  }, []);

  // Drag functionality
  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX - position.x;
      startY = e.clientY - position.y;
      element.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - startX));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - startY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'grab';
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  return (
    <div
      ref={dragRef}
      className="fixed z-50 cursor-grab"
      style={{ left: position.x, top: position.y }}
    >
      {isMinimized ? (
        // Minimized floating button
        <Button
          onClick={startListening}
          className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600'
          } text-white`}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      ) : (
        // Expanded voice interface
        <Card className="w-64 shadow-xl border-2 border-green-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Voice Assistant
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`w-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600'
                } text-white`}
              >
                {isListening ? (
                  <><MicOff className="mr-2 h-4 w-4" />Stop Listening</>
                ) : (
                  <><Mic className="mr-2 h-4 w-4" />Start Listening</>
                )}
              </Button>
              
              {(isListening || transcript) && (
                <div className="p-2 bg-green-50 rounded border">
                  <p className="text-xs text-green-700 mb-1">
                    {isListening ? "Listening..." : "You said:"}
                  </p>
                  <p className="text-sm text-gray-700 min-h-[20px]">
                    {transcript || "Speak now..."}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 Try saying:</p>
                <p>"Go to orders" • "Show inventory"</p>
                <p>"Open analytics" • "Check deliveries"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}