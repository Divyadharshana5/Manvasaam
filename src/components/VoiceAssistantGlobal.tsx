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
    // For testing, simulate voice commands with prompts
    const command = prompt('Say a command (farmer, customer, restaurant, hub, dashboard):');
    
    if (!command) {
      const utterance = new SpeechSynthesisUtterance('Not Found');
      speechSynthesis.speak(utterance);
      return;
    }

    const lowerCommand = command.toLowerCase().trim();
    
    if (lowerCommand.includes('farmer')) {
      router.push('/login/farmer');
    } else if (lowerCommand.includes('customer')) {
      router.push('/login/customer');
    } else if (lowerCommand.includes('restaurant')) {
      router.push('/login/restaurant');
    } else if (lowerCommand.includes('hub')) {
      router.push('/login/hub');
    } else if (lowerCommand.includes('dashboard')) {
      router.push('/dashboard');
    } else {
      const utterance = new SpeechSynthesisUtterance('Not Found');
      speechSynthesis.speak(utterance);
    }
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
