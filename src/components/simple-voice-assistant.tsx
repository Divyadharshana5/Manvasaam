"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic } from "lucide-react";

export default function SimpleVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceClick = () => {
    setIsListening(!isListening);
    // Simple demo functionality
    setTimeout(() => {
      setIsListening(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="text-center space-y-4">
        <Volume2 className="h-12 w-12 mx-auto text-green-500" />
        <p className="text-sm text-muted-foreground">
          Voice Assistant for navigation and support.
        </p>
        <Button 
          onClick={handleVoiceClick}
          disabled={isListening}
          className="w-full"
        >
          <Mic className="mr-2 h-4 w-4" />
          {isListening ? "Listening..." : "Start Voice Assistant"}
        </Button>
      </div>
    </div>
  );
}