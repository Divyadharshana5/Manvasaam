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

  // Simple voice commands
  const voiceCommands = [
    {
      keywords: ["farmer", "किसान"],
      action: () => router.push("/login/farmer"),
      response: "Going to farmer portal"
    },
    {
      keywords: ["customer", "ग्राहक"],
      action: () => router.push("/login/customer"),
      response: "Going to customer portal"
    },
    {
      keywords: ["restaurant", "रेस्टोरेंट"],
      action: () => router.push("/login/restaurant"),
      response: "Going to restaurant portal"
    },
    {
      keywords: ["hub", "हब"],
      action: () => router.push("/login/hub"),
      response: "Going to hub portal"
    }
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
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
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
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
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Find matching command
    const matchedCommand = voiceCommands.find(cmd =>
      cmd.keywords.some(keyword => lowerCommand.includes(keyword.toLowerCase()))
    );

    if (matchedCommand) {
      setResponse(matchedCommand.response);
      setTimeout(() => {
        matchedCommand.action();
        onClose();
      }, 2000);
    } else {
      setResponse("Please say: farmer, customer, restaurant, or hub");
    }

    onVoiceCommand?.(command);
  };

  const handleAskClick = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      setTranscript("");
      setResponse("");
      recognition.start();
    } else if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {title}
          </h2>

          <p className="text-gray-600 text-sm mb-8">
            {description}
          </p>

          {/* Ask Button */}
          <button
            onClick={handleAskClick}
            disabled={isListening}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-3 ${isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            <Mic className="h-5 w-5" />
            {isListening ? "Listening..." : "Ask"}
          </button>

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                You said: "{transcript}"
              </p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                {response}
              </p>
            </div>
          )}

          {/* Browser Support Check */}
          {typeof window !== "undefined" && !("webkitSpeechRecognition" in window) && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-700">
                Voice feature not available in this browser
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}