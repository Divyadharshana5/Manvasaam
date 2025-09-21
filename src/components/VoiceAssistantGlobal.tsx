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

  const handleClick = async () => {
    if (isListening) return;
    
    // Check browser support
    if (!window.webkitSpeechRecognition) {
      alert('Voice recognition requires Chrome browser');
      return;
    }

    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
    } catch (error) {
      alert('Please allow microphone access in your browser settings');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started - speak now!');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice heard:', transcript);
      
      // Process voice commands
      if (transcript.includes('dashboard')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard');
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      } else if (transcript.includes('orders')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard/orders');
          router.push('/');
        } else {
          router.push('/dashboard/orders');
        }
      } else if (transcript.includes('products')) {
        if (!isAuthenticated()) {
          sessionStorage.setItem('redirectAfterLogin', '/dashboard/products');
          router.push('/');
        } else {
          router.push('/dashboard/products');
        }
      } else if (transcript.includes('farmer')) {
        router.push('/login/farmer');
      } else if (transcript.includes('customer')) {
        router.push('/login/customer');
      } else if (transcript.includes('hub')) {
        router.push('/login/hub');
      } else if (transcript.includes('restaurant')) {
        router.push('/login/restaurant');
      } else {
        // Not found - speak in user's language
        const messages = {
          'Tamil': 'கிடைக்கவில்லை',
          'Hindi': 'नहीं मिला',
          'English': 'Not Found'
        };
        const message = messages[selectedLanguage as keyof typeof messages] || 'Not Found';
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please speak clearly and try again.');
      } else {
        alert('Voice recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      alert('Failed to start voice recognition. Please try again.');
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
