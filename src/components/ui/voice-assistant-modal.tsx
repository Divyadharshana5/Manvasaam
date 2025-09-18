"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          setTranscript(finalTranscript);
          onVoiceCommand?.(finalTranscript);
        }
      };

      speechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, [onVoiceCommand]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript("");
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleAskClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Content */}
              <div className="p-8 pt-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
                    {description}
                  </p>

                  {/* Voice button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleAskClick}
                      className={`w-full h-16 text-lg font-semibold rounded-xl transition-all duration-300 ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <motion.div
                        animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="flex items-center justify-center gap-3"
                      >
                        {isListening ? (
                          <>
                            <MicOff className="h-6 w-6" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <Mic className="h-6 w-6" />
                            Ask
                          </>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>

                  {/* Transcript display */}
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        "{transcript}"
                      </p>
                    </motion.div>
                  )}

                  {/* Listening indicator */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      <span className="text-sm">Listening...</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}