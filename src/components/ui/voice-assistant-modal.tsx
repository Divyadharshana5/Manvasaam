"use client";

import { useState, useEffect } from "react";

import { X, Mic } from "lucide-react";

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

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onVoiceCommand?.(finalTranscript);
          onClose();
        }
      };

      speechRecognition.onerror = () => {
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, [onVoiceCommand, onClose]);

  const handleAskClick = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="px-8 py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {title}
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-8 px-2">
              {description}
            </p>

            {/* Ask Button */}
            <button
              onClick={handleAskClick}
              disabled={isListening}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <Mic className="h-5 w-5" />
              {isListening ? "Listening..." : "Ask"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}