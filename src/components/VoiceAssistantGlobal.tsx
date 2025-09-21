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

  const handleClick = () => {
    if (isListening) return;
    
    if (!('webkitSpeechRecognition' in window)) {
      alert('Use Chrome browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      
      if (text.includes('dashboard')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard');
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      } else if (text.includes('orders')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard/orders');
          router.push('/');
        } else {
          router.push('/dashboard/orders');
        }
      } else if (text.includes('products')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard/products');
          router.push('/');
        } else {
          router.push('/dashboard/products');
        }
      } else if (text.includes('farmer')) {
        router.push('/login/farmer');
      } else if (text.includes('customer')) {
        router.push('/login/customer');
      } else {
        const msg = selectedLanguage === 'Tamil' ? 'கிடைக்கவில்லை' : 
                   selectedLanguage === 'Hindi' ? 'नहीं मिला' : 'Not Found';
        const utterance = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(utterance);
      }
    };

    recognition.onerror = () => setIsListening(false);
    
    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className={isListening ? "bg-red-500 text-white animate-pulse" : ""}
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
