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

    if (!window.webkitSpeechRecognition) {
      alert('Voice recognition not supported. Use Chrome browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice:', transcript);
      
      const routes = {
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
      
      const protectedPages = ['dashboard', 'orders', 'products', 'profile', 'track'];
      
      let foundPage = null;
      for (const [page, route] of Object.entries(routes)) {
        if (transcript.includes(page)) {
          foundPage = { page, route };
          break;
        }
      }
      
      if (foundPage) {
        if (protectedPages.includes(foundPage.page)) {
          if (!isAuthenticated()) {
            sessionStorage.setItem('redirectAfterLogin', foundPage.route);
            router.push('/');
            return;
          }
        }
        router.push(foundPage.route);
      } else {
        const messages = {
          'English': 'Not Found',
          'Tamil': 'கிடைக்கவில்லை',
          'Hindi': 'नहीं मिला'
        };
        const msg = messages[selectedLanguage as keyof typeof messages] || 'Not Found';
        
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(msg);
          window.speechSynthesis.speak(utterance);
        }
      }
    };
    
    recognition.onerror = () => setIsListening(false);
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
