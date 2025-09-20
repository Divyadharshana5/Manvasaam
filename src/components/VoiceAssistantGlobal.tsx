"use client";
import { useState, useRef, MutableRefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// List of known routes for navigation (add more as needed)
const KNOWN_ROUTES = [
  "/dashboard",
  "/dashboard/farmer",
  "/dashboard/customer",
  "/dashboard/hub",
  "/dashboard/restaurant",
  "/dashboard/orders",
  "/dashboard/products",
  "/dashboard/faq",
  "/dashboard/marketing",
  "/dashboard/matchmaking",
  "/dashboard/voice-assistant",
  "/dashboard/track",
  "/dashboard/profile",
  "/dashboard/contact",
  "/dashboard/hub/inventory",
  "/dashboard/hub/attendance",
  "/privacy",
  "/terms",
  "/support",
  "/test-dropdown",
  "/test-hub",
  "/test-email",
  "/voice-assistant-help",
];

const ROUTE_ALIASES = {
  dashboard: "/dashboard",
  farmer: "/login/farmer",
  customer: "/login/customer",
  hub: "/login/hub",
  restaurant: "/login/restaurant",
  orders: "/dashboard/orders",
  products: "/dashboard/products",
  faq: "/dashboard/faq",
  marketing: "/dashboard/marketing",
  matchmaking: "/dashboard/matchmaking",
  "voice assistant": "/dashboard/voice-assistant",
  track: "/dashboard/track",
  profile: "/dashboard/profile",
  contact: "/dashboard/contact",
  inventory: "/dashboard/hub/inventory",
  attendance: "/dashboard/hub/attendance",
  privacy: "/privacy",
  terms: "/terms",
  support: "/support",
  "test dropdown": "/test-dropdown",
  "test hub": "/test-hub",
  "test email": "/test-email",
  help: "/voice-assistant-help",
};

export function VoiceAssistantGlobal() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  const getRouteFromText = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Check exact matches first
    if (ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES]) {
      return ROUTE_ALIASES[lowerText as keyof typeof ROUTE_ALIASES];
    }
    
    // Check partial matches
    for (const [alias, route] of Object.entries(ROUTE_ALIASES)) {
      if (lowerText.includes(alias)) {
        return route;
      }
    }
    
    return null;
  };

  const handleVoiceCommand = async () => {
    try {
      if (!navigator.mediaDevices || !('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported');
        return;
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Transcript:', transcript);
        
        // Direct navigation based on keywords
        if (transcript.includes('farmer') || transcript.includes('farm')) {
          router.push('/login/farmer');
        } else if (transcript.includes('customer') || transcript.includes('buyer')) {
          router.push('/login/customer');
        } else if (transcript.includes('restaurant') || transcript.includes('hotel')) {
          router.push('/login/restaurant');
        } else if (transcript.includes('hub') || transcript.includes('center')) {
          router.push('/login/hub');
        } else if (transcript.includes('dashboard') || transcript.includes('home')) {
          router.push('/dashboard');
        } else if (transcript.includes('product') || transcript.includes('item')) {
          router.push('/dashboard/products');
        } else if (transcript.includes('order') || transcript.includes('purchase')) {
          router.push('/dashboard/orders');
        } else {
          const utterance = new SpeechSynthesisUtterance('Page not found');
          speechSynthesis.speak(utterance);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        const utterance = new SpeechSynthesisUtterance('Voice recognition failed');
        speechSynthesis.speak(utterance);
      };

      recognition.start();
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please allow microphone access for voice commands');
    }
  };

  return (
    <Button
      onClick={handleVoiceCommand}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white" : ""}
    >
      <Volume2 className="h-4 w-4 mr-1" />
      {isListening ? "Listening..." : "Voice"}
    </Button>
  );
}
