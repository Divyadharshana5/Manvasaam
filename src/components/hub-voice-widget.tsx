"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHubVoiceNavigation } from "@/hooks/use-hub-voice-navigation";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Loader2, 
  HelpCircle, 
  X,
  Smartphone,
  Monitor
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface HubVoiceWidgetProps {
  variant?: "compact" | "full" | "floating";
  showHelp?: boolean;
  className?: string;
}

const quickCommands = [
  { text: "Go to orders", description: "View all orders" },
  { text: "Show deliveries", description: "Check delivery status" },
  { text: "Open inventory", description: "Manage stock" },
  { text: "View analytics", description: "See reports" },
  { text: "Check attendance", description: "Worker status" },
  { text: "Show farmers", description: "Manage suppliers" },
];

export function HubVoiceWidget({ 
  variant = "compact", 
  showHelp = false,
  className = ""
}: HubVoiceWidgetProps) {
  const [showCommands, setShowCommands] = useState(false);
  const isMobile = useMobile();
  
  const {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
    isSupported,
  } = useHubVoiceNavigation();

  if (!isSupported) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        🎤 Voice navigation not supported in this browser
      </div>
    );
  }

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {variant === "compact" ? "..." : "Processing..."}
        </>
      );
    }
    
    if (isListening) {
      return (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          {variant === "compact" ? "Stop" : "Stop Listening"}
        </>
      );
    }
    
    return (
      <>
        <Mic className="h-4 w-4 mr-2" />
        {variant === "compact" ? "Voice" : "Voice Navigation"}
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass = "font-semibold transition-all duration-300 hover:scale-105";
    
    if (isListening) {
      return `${baseClass} bg-red-500 hover:bg-red-600 animate-pulse text-white`;
    }
    
    if (isProcessing) {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white`;
    }
    
    return `${baseClass} bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 text-white shadow-lg`;
  };

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-14 h-14 rounded-full shadow-xl ${getButtonClass()}`}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          {/* Live transcript for floating variant */}
          {(isListening || transcript) && (
            <Card className="absolute bottom-16 right-0 w-64 shadow-xl border-2 border-green-200 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {isProcessing ? "Processing..." : isListening ? "Listening..." : "Heard:"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 min-h-[20px]">
                  {transcript || "Speak your command..."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-green-600" />
              Voice Navigation
            </div>
            {showHelp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommands(!showCommands)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex-1 ${getButtonClass()}`}
            >
              {getButtonContent()}
            </Button>
            
            {isMobile ? (
              <Smartphone className="h-4 w-4 text-gray-400" />
            ) : (
              <Monitor className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          {/* Live transcript */}
          {(isListening || transcript) && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {isProcessing ? "Processing..." : isListening ? "Listening..." : "You said:"}
                </span>
              </div>
              <p className="text-sm text-gray-700 min-h-[20px]">
                {transcript || "Speak now..."}
              </p>
            </div>
          )}
          
          {/* Quick commands */}
          {showCommands && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Quick Commands</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommands(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid gap-2">
                {quickCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="font-medium text-green-700">"{cmd.text}"</span>
                    <span className="text-gray-500">{cmd.description}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                💡 You can also say "go to [page]" or just the page name
              </div>
            </div>
          )}
          
          {/* Status indicators */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Badge variant={isSupported ? "default" : "destructive"} className="text-xs">
                {isSupported ? "Ready" : "Not Supported"}
              </Badge>
              {isMobile && (
                <Badge variant="outline" className="text-xs">
                  Mobile
                </Badge>
              )}
            </div>
            <span>🎤 Voice Navigation</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant (default)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        size="sm"
        className={getButtonClass()}
      >
        {getButtonContent()}
      </Button>
      
      {showHelp && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCommands(!showCommands)}
          className="h-8 px-2"
        >
          <HelpCircle className="h-3 w-3" />
        </Button>
      )}
      
      {/* Live transcript for compact variant */}
      {(isListening || transcript) && (
        <div className="absolute top-12 right-0 z-50 min-w-64 max-w-80">
          <Card className="shadow-lg border-2 border-green-200 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {isProcessing ? "Processing..." : isListening ? "Listening..." : "Heard:"}
                </span>
              </div>
              <p className="text-sm text-gray-700 min-h-[20px]">
                {transcript || "Speak now..."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Commands help for compact variant */}
      {showCommands && (
        <div className="absolute top-12 right-0 z-50 w-80">
          <Card className="shadow-xl border-2 border-green-200 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800">Voice Commands</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCommands(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {quickCommands.map((cmd, idx) => (
                  <div key={idx} className="text-xs p-2 bg-green-50 rounded">
                    <span className="font-medium text-green-700">"{cmd.text}"</span>
                    <span className="text-gray-600 ml-2">→ {cmd.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                💡 Say "go to [page]" or just the page name
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}