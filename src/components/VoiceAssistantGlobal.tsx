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

  const startVoice = async () => {
    if (isListening) return;

    // Check if browser supports speech recognition
    if (!window.webkitSpeechRecognition) {
      alert('Please use Chrome browser for voice features');
      return;
    }

    // Request microphone permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert('Microphone access required. Please allow and try again.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log('Voice input:', text);
      
      // Routes mapping
      const pages = {
        'dashboard': '/dashboard',
        'orders': '/dashboard/orders',
        'products': '/dashboard/products', 
        'profile': '/dashboard/profile',
        'track': '/dashboard/track',
        'farmer': '/login/farmer',
        'customer': '/login/customer',
        'hub': '/login/hub',
        'restaurant': '/login/restaurant'
      };
      
      const protected_pages = ['dashboard', 'orders', 'products', 'profile', 'track'];
      
      // Find page
      let route = null;
      let page = null;
      
      for (const [key, path] of Object.entries(pages)) {
        if (text.includes(key)) {
          route = path;
          page = key;
          break;
        }
      }
      
      if (route) {
        // Check auth for protected pages
        if (page && protected_pages.includes(page)) {
          if (!isAuthenticated()) {
            sessionStorage.setItem('redirectAfterLogin', route);
            router.push('/');
            return;
          }
        }
        router.push(route);
      } else {
        // Not found - speak in user language
        const msgs = {
          'English': 'Not Found',
          'Tamil': 'கிடைக்கவில்லை',
          'Hindi': 'नहीं मिला'
        };
        const msg = msgs[selectedLanguage as keyof typeof msgs] || 'Not Found';
        
        const speech = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(speech);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
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
