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

  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice input:', transcript);
      
      // Simple direct matching
      let route = null;
      if (transcript.includes('farmer')) route = '/login/farmer';
      else if (transcript.includes('customer')) route = '/login/customer';
      else if (transcript.includes('restaurant')) route = '/login/restaurant';
      else if (transcript.includes('hub')) route = '/login/hub';
      else if (transcript.includes('dashboard')) route = '/dashboard';
      else if (transcript.includes('product')) route = '/dashboard/products';
      else if (transcript.includes('order')) route = '/dashboard/orders';
      else if (transcript.includes('profile')) route = '/dashboard/profile';
      
      if (route) {
        console.log('Navigating to:', route);
        router.push(route);
      } else {
        console.log('No route found');
        const utterance = new SpeechSynthesisUtterance('Not Found');
        speechSynthesis.speak(utterance);
      }
    };

    recognition.onerror = () => {
      const utterance = new SpeechSynthesisUtterance('Not Found');
      speechSynthesis.speak(utterance);
    };

    recognition.start();
  };

  return (
    <Button
      onClick={handleVoiceCommand}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white" : ""}
    >
      <Volume2 className="h-4 w-4" />
      {isListening ? "Listening..." : "Voice"}
    </Button>
  );
}
