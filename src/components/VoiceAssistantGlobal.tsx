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
    console.log("=== VOICE BUTTON CLICKED ===");

    if (isListening) {
      console.log("Already listening");
      return;
    }

    // Force check for webkitSpeechRecognition
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition NOT available");
      alert(
        "Speech recognition not available. Please use Chrome browser and ensure you are on HTTPS."
      );
      return;
    }

    console.log("Speech recognition available, creating instance...");

    const recognition = new SpeechRecognition();

    // Force basic settings
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    console.log("Recognition configured, setting up events...");

    recognition.onstart = function () {
      setIsListening(true);
      console.log("=== LISTENING STARTED ===");
      console.log("Speak now!");
    };

    recognition.onresult = function (event: SpeechRecognitionEvent) {
      console.log("=== RESULT RECEIVED ===");
      console.log("Event:", event);

      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        console.log("TRANSCRIPT:", transcript);
        alert("I heard: " + transcript);

        // Simple navigation
        const text = transcript.toLowerCase();
        if (text.includes("dashboard")) {
          router.push("/dashboard");
        } else if (text.includes("farmer")) {
          router.push("/login/farmer");
        } else if (text.includes("customer")) {
          router.push("/login/customer");
        }
      } else {
        console.log("No results in event");
        // No valid transcript was returned
        setIsListening(false);
        alert("No speech result detected.");
      }
    };

    // Proper error handler: SpeechRecognition onerror provides an error property.
    recognition.onerror = function (event: any) {
      console.log("=== ERROR OCCURRED ===");
      console.log("Error type:", (event && event.error) || "unknown");
      console.log("Error event:", event);
      setIsListening(false);
      alert("Speech error: " + ((event && event.error) || "unknown"));
    };

    recognition.onend = function () {
      console.log("=== LISTENING ENDED ===");
      setIsListening(false);
    };

    console.log("Starting recognition...");

    try {
      recognition.start();
      console.log("Recognition.start() called successfully");
    } catch (error) {
      console.log("Error calling start():", error);
      setIsListening(false);
      alert("Failed to start: " + error);
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
