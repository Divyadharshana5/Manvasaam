"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onVoiceCommand?: (command: string) => void;
}

export function VoiceAssistantModal({
  isOpen,
  onClose,
  title = "Enhanced Voice Assistant",
  description = "Ask me anything! I can help you navigate, answer questions about Manvaasam, or provide information about our platform. Try saying \"What is Manvaasam?\" or \"Take me to the dashboard\".",
  onVoiceCommand
}: VoiceAssistantModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Common voice commands for uneducated users
  const voiceCommands = [
    { 
      hindi: "मैं किसान हूं", 
      english: "I am farmer", 
      action: () => router.push("/login/farmer"),
      response: "किसान पोर्टल पर जा रहे हैं / Going to farmer portal"
    },
    { 
      hindi: "मैं ग्राहक हूं", 
      english: "I am customer", 
      action: () => router.push("/login/customer"),
      response: "ग्राहक पोर्टल पर जा रहे हैं / Going to customer portal"
    },
    { 
      hindi: "मैं रेस्टोरेंट हूं", 
      english: "I am restaurant", 
      action: () => router.push("/login/restaurant"),
      response: "रेस्टोरेंट पोर्टल पर जा रहे हैं / Going to restaurant portal"
    },
    { 
      hindi: "मैं हब हूं", 
      english: "I am hub", 
      action: () => router.push("/login/hub"),
      response: "हब पोर्टल पर जा रहे हैं / Going to hub portal"
    },
    { 
      hindi: "सब्जी खरीदना है", 
      english: "buy vegetables", 
      action: () => router.push("/login/customer"),
      response: "सब्जी खरीदने के लिए ग्राहक पोर्टल पर जा रहे हैं / Going to customer portal to buy vegetables"
    },
    { 
      hindi: "सब्जी बेचना है", 
      english: "sell vegetables", 
      action: () => router.push("/login/farmer"),
      response: "सब्जी बेचने के लिए किसान पोर्टल पर जा रहे हैं / Going to farmer portal to sell vegetables"
    },
    { 
      hindi: "मदद चाहिए", 
      english: "help", 
      action: () => setShowHelp(true),
      response: "मदद दिखा रहे हैं / Showing help"
    }
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      if ("webkitSpeechRecognition" in window) {
        const speechRecognition = new (window as any).webkitSpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = true;
        speechRecognition.lang = "hi-IN"; // Hindi first, then English

        speechRecognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
          
          if (finalTranscript) {
            processVoiceCommand(finalTranscript);
          }
        };

        speechRecognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === 'no-speech') {
            speak("कुछ नहीं सुनाई दिया। फिर से कोशिश करें। / Nothing heard. Please try again.");
          }
        };

        speechRecognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(speechRecognition);
      }
    }
  }, []);

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      lowerCommand.includes(cmd.hindi.toLowerCase()) || 
      lowerCommand.includes(cmd.english.toLowerCase()) ||
      cmd.hindi.toLowerCase().includes(lowerCommand) ||
      cmd.english.toLowerCase().includes(lowerCommand)
    );

    if (matchedCommand) {
      setResponse(matchedCommand.response);
      speak(matchedCommand.response);
      
      setTimeout(() => {
        matchedCommand.action();
        onClose();
      }, 3000);
    } else {
      // Fallback responses
      const fallbackResponse = "समझ नहीं आया। कृपया फिर से कहें: मैं किसान हूं, मैं ग्राहक हूं, या मदद चाहिए। / Didn't understand. Please say again: I am farmer, I am customer, or help.";
      setResponse(fallbackResponse);
      speak(fallbackResponse);
    }
    
    onVoiceCommand?.(command);
  };

  const handleAskClick = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      setTranscript("");
      setResponse("");
      recognition.start();
      speak("बोलिए / Speak now");
    } else if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const quickActions = [
    { text: "किसान / Farmer", action: () => router.push("/login/farmer") },
    { text: "ग्राहक / Customer", action: () => router.push("/login/customer") },
    { text: "रेस्टोरेंट / Restaurant", action: () => router.push("/login/restaurant") },
    { text: "हब / Hub", action: () => router.push("/login/hub") }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mic className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 text-sm">{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Voice Input Section */}
          <div className="text-center mb-6">
            <button
              onClick={handleAskClick}
              disabled={false}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                isListening 
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                  : "bg-green-600 hover:bg-green-700 text-white hover:shadow-xl transform hover:scale-105"
              }`}
              style={{ minHeight: '64px' }}
            >
              {isListening ? (
                <>
                  <MicOff className="h-6 w-6 flex-shrink-0" />
                  <span>सुन रहे हैं... / Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6 flex-shrink-0" />
                  <span>बोलें / Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <Mic className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">आपने कहा / You said:</p>
                  <p className="text-blue-700">{transcript}</p>
                </div>
              </div>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <Volume2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">जवाब / Response:</p>
                  <p className="text-green-700">{response}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <HelpCircle className="h-4 w-4" />
              <span>या यहाँ दबाएं / Or click here:</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors duration-200 text-center"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Help Section */}
          {showHelp && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-800 mb-2">कैसे इस्तेमाल करें / How to use:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• "मैं किसान हूं" - किसान पोर्टल के लिए</li>
                <li>• "मैं ग्राहक हूं" - खरीदारी के लिए</li>
                <li>• "सब्जी बेचना है" - बेचने के लिए</li>
                <li>• "सब्जी खरीदना है" - खरीदने के लिए</li>
              </ul>
            </div>
          )}

          {/* Browser Support Check */}
          {typeof window !== "undefined" && !("webkitSpeechRecognition" in window) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 text-center">
                आवाज़ की सुविधा उपलब्ध नहीं है / Voice feature not available in this browser
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}