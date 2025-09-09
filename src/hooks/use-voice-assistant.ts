"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantHook {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export function useVoiceAssistant(): VoiceAssistantHook {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getPageRoutes = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/farmer')) {
      return {
        'overview': '/dashboard/farmer',
        'dashboard': '/dashboard/farmer',
        'home': '/dashboard/farmer',
        'products': '/dashboard/farmer/products',
        'product': '/dashboard/farmer/products',
        'my products': '/dashboard/farmer/products',
        'orders': '/dashboard/orders',
        'order': '/dashboard/orders',
        'matchmaking': '/dashboard/farmer/matchmaking',
        'match': '/dashboard/farmer/matchmaking',
        'analytics': '/dashboard/farmer/analytics',
        'reports': '/dashboard/farmer/analytics',
        'profile': '/dashboard/profile',
        'faq': '/dashboard/faq',
        'help': '/dashboard/faq',
      };
    }
    
    if (currentPath.includes('/customer')) {
      return {
        'overview': '/dashboard/customer',
        'dashboard': '/dashboard/customer',
        'home': '/dashboard/customer',
        'products': '/dashboard/products',
        'product': '/dashboard/products',
        'browse': '/dashboard/products',
        'browse products': '/dashboard/products',
        'orders': '/dashboard/orders',
        'order': '/dashboard/orders',
        'my orders': '/dashboard/orders',
        'track': '/dashboard/track',
        'tracking': '/dashboard/track',
        'track orders': '/dashboard/track',
        'cart': '/dashboard/customer/cart',
        'shopping cart': '/dashboard/customer/cart',
        'profile': '/dashboard/profile',
        'faq': '/dashboard/faq',
        'help': '/dashboard/faq',
        'settings': '/dashboard/customer/settings',
      };
    }
    
    // Hub routes
    return {
      'overview': '/dashboard/hub',
      'dashboard': '/dashboard/hub',
      'home': '/dashboard/hub',
      'orders': '/dashboard/hub/orders',
      'order': '/dashboard/hub/orders',
      'deliveries': '/dashboard/hub/deliveries',
      'delivery': '/dashboard/hub/deliveries',
      'farmers': '/dashboard/hub/farmers',
      'farmer': '/dashboard/hub/farmers',
      'analytics': '/dashboard/hub/analytics',
      'reports': '/dashboard/hub/analytics',
      'settings': '/dashboard/hub/settings',
      'setting': '/dashboard/hub/settings',
      'profile': '/dashboard/profile',
      'inventory': '/dashboard/hub/inventory',
      'stock': '/dashboard/hub/inventory',
      'attendance': '/dashboard/hub/attendance',
    };
  };

  const processVoiceCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase().trim();
    
    // Extract navigation keywords
    const navigationWords = ['go to', 'navigate to', 'open', 'show', 'take me to', 'visit'];
    let targetPage = command;
    
    // Remove navigation words to get the target page
    navigationWords.forEach(word => {
      if (command.includes(word)) {
        targetPage = command.replace(word, '').trim();
      }
    });

    // Find matching route
    const pageRoutes = getPageRoutes();
    const route = pageRoutes[targetPage];
    
    if (route) {
      toast({
        title: "🎯 Navigating",
        description: `Going to ${targetPage}...`,
        duration: 2000,
      });
      router.push(route);
    } else {
      toast({
        variant: "destructive",
        title: "❌ Page Not Found",
        description: `Sorry, "${targetPage}" page doesn't exist. Try: orders, deliveries, farmers, analytics, settings.`,
        duration: 4000,
      });
    }
  }, [router, toast]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "❌ Not Supported",
        description: "Speech recognition is not supported in this browser.",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak your command now",
        duration: 2000,
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast({
        variant: "destructive",
        title: "❌ Voice Error",
        description: "Could not recognize speech. Please try again.",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [processVoiceCommand, toast]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
  };
}