"use client";

import { useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface VoiceNavigationHook {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

interface HubRoute {
  keywords: string[];
  route: string;
  description: string;
  shortcut?: string;
}

const hubRoutes: HubRoute[] = [
  { 
    keywords: ["overview", "dashboard", "home", "main", "hub"], 
    route: "/dashboard/hub", 
    description: "Overview",
    shortcut: "Alt+H"
  },
  { 
    keywords: ["orders", "order", "purchase", "sales", "buy"], 
    route: "/dashboard/hub/orders", 
    description: "Orders",
    shortcut: "Alt+O"
  },
  { 
    keywords: ["deliveries", "delivery", "shipping", "transport", "deliver"], 
    route: "/dashboard/hub/deliveries", 
    description: "Deliveries",
    shortcut: "Alt+D"
  },
  { 
    keywords: ["farmers", "farmer", "suppliers", "growers", "producer"], 
    route: "/dashboard/hub/farmers", 
    description: "Farmers",
    shortcut: "Alt+F"
  },
  { 
    keywords: ["analytics", "reports", "stats", "data", "charts", "analysis"], 
    route: "/dashboard/hub/analytics", 
    description: "Analytics",
    shortcut: "Alt+A"
  },
  { 
    keywords: ["inventory", "stock", "products", "items", "warehouse"], 
    route: "/dashboard/hub/inventory", 
    description: "Inventory",
    shortcut: "Alt+I"
  },
  { 
    keywords: ["attendance", "workers", "staff", "employees", "team"], 
    route: "/dashboard/hub/attendance", 
    description: "Attendance",
    shortcut: "Alt+T"
  },
  { 
    keywords: ["settings", "preferences", "config", "configuration"], 
    route: "/dashboard/hub/settings", 
    description: "Settings",
    shortcut: "Alt+S"
  },
  { 
    keywords: ["live tracking", "tracking", "location", "map", "gps"], 
    route: "/dashboard/hub/live-tracking", 
    description: "Live Tracking",
    shortcut: "Alt+L"
  },
];

export function useHubVoiceNavigation(): VoiceNavigationHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const processVoiceCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (!lowerText) {
      toast({
        variant: "destructive",
        title: "🎤 No Speech",
        description: "Please speak clearly and try again.",
        duration: 2000,
      });
      return;
    }

    // Enhanced text cleaning with more patterns
    const cleanText = lowerText
      .replace(/^(go to|navigate to|open|show|take me to|visit|check|view|see|display)\s+/i, "")
      .replace(/\s+(page|section|area|dashboard|screen|panel)$/i, "")
      .replace(/\b(the|my|our)\s+/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // Exact match first (highest priority)
    let matchedRoute = hubRoutes.find(route => 
      route.keywords.some(keyword => keyword === cleanText)
    );
    
    // Partial match with word boundaries
    if (!matchedRoute) {
      matchedRoute = hubRoutes.find(route => 
        route.keywords.some(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'i');
          return regex.test(cleanText);
        })
      );
    }
    
    // Fuzzy match (contains)
    if (!matchedRoute) {
      matchedRoute = hubRoutes.find(route => 
        route.keywords.some(keyword => 
          cleanText.includes(keyword) || keyword.includes(cleanText)
        )
      );
    }

    if (matchedRoute) {
      // Check if already on the target page
      if (pathname === matchedRoute.route) {
        toast({
          title: "📍 Already Here",
          description: `You're already on the ${matchedRoute.description} page.`,
          duration: 2000,
        });
      } else {
        toast({
          title: "🎯 Voice Navigation",
          description: `Navigating to ${matchedRoute.description}...`,
          duration: 2000,
        });
        
        // Navigate with a slight delay for better UX
        setTimeout(() => {
          router.push(matchedRoute.route);
        }, 800);
      }
    } else {
      // Provide intelligent suggestions
      const suggestions = hubRoutes
        .filter(route => {
          const firstWord = cleanText.split(' ')[0];
          return route.keywords.some(keyword => 
            keyword.includes(firstWord) || firstWord.includes(keyword)
          );
        })
        .slice(0, 3)
        .map(route => route.description)
        .join(", ");
      
      toast({
        variant: "destructive",
        title: "❌ Command Not Found",
        description: suggestions 
          ? `"${cleanText}" not recognized. Try: ${suggestions}`
          : `"${cleanText}" not recognized. Available pages: Orders, Deliveries, Farmers, Analytics, Inventory, Attendance.`,
        duration: 5000,
      });
    }
  }, [router, toast, pathname]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Speech recognition is not available in this browser. Try Chrome or Edge.",
        duration: 4000,
      });
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Optimized settings for better accuracy
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setIsProcessing(false);
        
        toast({
          title: "🎤 Listening...",
          description: "Speak your navigation command now",
          duration: 1500,
        });
        
        // Auto-stop after 6 seconds for better UX
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 6000);
      };

      recognitionRef.current.onresult = (event) => {
        const results = event.results;
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = 0; i < results.length; i++) {
          const transcript = results[i][0].transcript;
          if (results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript for live feedback
        setTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript) {
          setIsProcessing(true);
          
          // Clear timeout since we got final result
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Process command with slight delay for better UX
          setTimeout(() => {
            processVoiceCommand(finalTranscript);
            setIsProcessing(false);
            setIsListening(false);
            setTranscript("");
          }, 600);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setIsProcessing(false);
        setTranscript("");
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not accessible. Check your microphone permissions.',
          'not-allowed': 'Microphone access denied. Please enable microphone access in your browser settings.',
          'network': 'Network error occurred. Check your internet connection.',
          'service-not-allowed': 'Speech recognition service not allowed.',
          'bad-grammar': 'Speech not recognized. Please speak more clearly.',
        };
        
        const message = errorMessages[event.error] || 'Speech recognition error. Please try again.';
        
        toast({
          variant: "destructive",
          title: "❌ Voice Error",
          description: message,
          duration: 4000,
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Clear transcript after a delay if no processing
        if (!isProcessing) {
          setTimeout(() => setTranscript(""), 2000);
        }
      };

      recognitionRef.current.start();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Initialization Error",
        description: "Failed to start speech recognition. Please try again.",
      });
    }
  }, [isSupported, processVoiceCommand, toast, isProcessing]);

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

  return {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
    isSupported,
  };
}