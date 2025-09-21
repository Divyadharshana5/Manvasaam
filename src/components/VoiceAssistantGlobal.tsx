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

  const testVoice = async () => {
    console.log('Voice button clicked');
    
    if (isListening) {
      console.log('Already listening, returning');
      return;
    }

    // Check browser support
    if (!window.webkitSpeechRecognition) {
      console.log('webkitSpeechRecognition not supported');
      alert('Voice recognition not supported. Please use Chrome browser.');
      return;
    }

    // Request microphone permission first
    try {
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.log('Microphone permission denied:', error);
      alert('Microphone access required. Please allow microphone access in your browser.');
      return;
    }

    try {
      console.log('Creating speech recognition...');
      const recognition = new window.webkitSpeechRecognition();
      
      // Basic configuration
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('STARTED LISTENING - Speak now!');
      };

      recognition.onresult = (event) => {
        try {
          const transcript = event.results[0][0].transcript;
          console.log('HEARD:', transcript);
          alert('You said: ' + transcript);
          
          const text = transcript.toLowerCase().trim();
          
          // Navigation logic
          if (text.includes('dashboard')) {
            console.log('Navigating to dashboard');
            if (!isAuthenticated()) {
              sessionStorage.setItem('redirectAfterLogin', '/dashboard');
              router.push('/');
            } else {
              router.push('/dashboard');
            }
          } else if (text.includes('orders')) {
            console.log('Navigating to orders');
            if (!isAuthenticated()) {
              sessionStorage.setItem('redirectAfterLogin', '/dashboard/orders');
              router.push('/');
            } else {
              router.push('/dashboard/orders');
            }
          } else if (text.includes('products')) {
            console.log('Navigating to products');
            if (!isAuthenticated()) {
              sessionStorage.setItem('redirectAfterLogin', '/dashboard/products');
              router.push('/');
            } else {
              router.push('/dashboard/products');
            }
          } else if (text.includes('farmer')) {
            console.log('Navigating to farmer login');
            router.push('/login/farmer');
          } else if (text.includes('customer')) {
            console.log('Navigating to customer login');
            router.push('/login/customer');
          } else {
            console.log('No matching command found for:', text);
            const messages = {
              'Tamil': 'கிடைக்கவில்லை',
              'Hindi': 'नहीं मिला',
              'English': 'Not Found'
            };
            const message = messages[selectedLanguage as keyof typeof messages] || 'Not Found';
            
            const utterance = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(utterance);
          }
        } catch (error) {
          console.error('Error processing speech result:', error);
        }
      };

      recognition.onerror = (event) => {
        console.log('ERROR:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Voice recognition error: ' + event.error;
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try speaking again.';
        }
        
        alert(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('ENDED');
      };

      console.log('Starting speech recognition...');
      recognition.start();
      
    } catch (error) {
      console.error('Failed to create or start speech recognition:', error);
      setIsListening(false);
      alert('Failed to start voice recognition: ' + error);
    }
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
