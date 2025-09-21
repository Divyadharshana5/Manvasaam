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

  const testVoice = () => {
    if (isListening) return;

    if (!('webkitSpeechRecognition' in window)) {
      alert('Please use Chrome browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('STARTED LISTENING');
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log('HEARD:', text);
      alert('You said: ' + text);
      
      // Simple navigation
      if (text.toLowerCase().includes('dashboard')) {
        router.push('/dashboard');
      } else if (text.toLowerCase().includes('farmer')) {
        router.push('/login/farmer');
      }
    };

    recognition.onerror = (event: any) => {
      console.log('ERROR:', event.error);
      setIsListening(false);
      alert('Error: ' + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('ENDED');
    };

    recognition.start();
  };

  return (
    <Button
      onClick={testVoice}
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
