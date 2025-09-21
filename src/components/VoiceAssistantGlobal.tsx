"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, MicIcon } from "lucide-react";
import { isAuthenticated } from "@/lib/auth-redirect";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export function VoiceAssistantGlobal() {
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const { selectedLanguage } = useLanguage();

  const handleVoiceClick = () => {
    if (isListening) return;

    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition requires Chrome browser');
      return;
    }

    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      
      // Basic settings
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Voice heard:', transcript);
        
        const routes = {
          'dashboard': '/dashboard',
          'orders': '/dashboard/orders', 
          'products': '/dashboard/products',
          'profile': '/dashboard/profile',
          'track': '/dashboard/track',
          'inventory': '/dashboard/hub/inventory',
          'analytics': '/dashboard/hub/analytics',
          'farmer': '/login/farmer',
          'customer': '/login/customer',
          'hub': '/login/hub',
          'restaurant': '/login/restaurant'
        };
        
        const protectedPages = ['dashboard', 'orders', 'products', 'profile', 'track', 'inventory', 'analytics'];
        
        // Find matching page
        let foundRoute = null;
        let pageKey = null;
        
        for (const [page, route] of Object.entries(routes)) {
          if (transcript.includes(page)) {
            foundRoute = route;
            pageKey = page;
            break;
          }
        }
        
        if (foundRoute) {
          console.log('Found route:', foundRoute);
          
          // Check authentication for protected pages
          if (pageKey && protectedPages.includes(pageKey)) {
            if (!isAuthenticated()) {
              console.log('Not authenticated, redirecting to login');
              sessionStorage.setItem('redirectAfterLogin', foundRoute);
              router.push('/');
              return;
            }
          }
          
          // Navigate to page
          router.push(foundRoute);
        } else {
          console.log('Page not found for:', transcript);
          
          // Speak "Not Found" in selected language
          const messages = {
            'English': 'Not Found',
            'Tamil': 'கிடைக்கவில்லை',
            'Hindi': 'नहीं मिला',
            'Malayalam': 'കണ്ടെത്തിയില്ല',
            'Telugu': 'కనుగొనబడలేదు',
            'Kannada': 'ಸಿಗಲಿಲ್ಲ',
            'Bengali': 'পাওয়া যায়নি'
          };
          
          const message = messages[selectedLanguage as keyof typeof messages] || 'Not Found';
          
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access and try again');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try again');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      // Start recognition
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsListening(false);
      alert('Voice recognition failed. Please try again');
    }
  };

  return (
    <Button
      onClick={handleVoiceClick}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white animate-pulse" : ""}
      disabled={isListening}
    >
      {isListening ? (
        <MicIcon className="h-4 w-4 mr-1" />
      ) : (
        <Volume2 className="h-4 w-4 mr-1" />
      )}
      {isListening ? "Listening..." : "Voice"}
    </Button>
  );
}
// removed duplicate/erroneous trailing voice-navigation helpers
