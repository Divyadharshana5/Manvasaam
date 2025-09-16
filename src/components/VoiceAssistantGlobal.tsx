"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

import { Mic, Volume2, Square, Loader2, MicOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// Safe fallback functions to prevent errors
const speechToText = async (params: any) => {
  try {
    const { speechToText } = await import("@/ai/flows/stt-flow");
    return speechToText(params);
  } catch {
    return { transcript: "Voice recognition unavailable" };
  }
};

const understandNavigation = async (params: any) => {
  try {
    const { understandNavigation } = await import("@/ai/flows/navigation-flow");
    return understandNavigation(params);
  } catch {
    return {
      shouldNavigate: false,
      message: "Navigation assistance unavailable",
    };
  }
};

const textToSpeech = async (text: string, language?: string) => {
  try {
    const { textToSpeech } = await import("@/ai/flows/tts-flow");
    return textToSpeech({ text, language });
  } catch {
    return { audioDataUri: "" };
  }
};

type AssistantState = "idle" | "listening" | "thinking" | "speaking";

export function VoiceAssistantGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const selectedLanguage = "English"; // Default language

  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [lastResponse, setLastResponse] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<
    boolean | null
  >(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hide voice assistant on login/register pages and homepage
  if (
    pathname?.startsWith("/login") ||
    pathname?.includes("register") ||
    pathname === "/"
  ) {
    return null;
  }

  // Position in top-right for hub portal pages, bottom-right for others
  const isHubPortal = pathname?.startsWith("/dashboard/hub");
  const positionClass = isHubPortal
    ? "fixed top-4 right-4 z-[9999]"
    : "fixed bottom-6 right-6 z-[9999]";
  const buttonSize = isHubPortal ? "w-10 h-10" : "w-16 h-16";
  const iconSize = isHubPortal ? "h-4 w-4" : "h-7 w-7";

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasMicrophonePermission(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setHasMicrophonePermission(false);
      }
    };
    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    setTranscribedText("");
    setLastResponse("");
    setAudioUrl("");

    if (hasMicrophonePermission === false) {
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description:
          "Please allow microphone access in your browser settings to use this feature.",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = processAudio;
      mediaRecorderRef.current.start();
      setAssistantState("listening");
    } catch {
      setHasMicrophonePermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description:
          "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && assistantState === "listening") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const processAudio = async () => {
    setAssistantState("thinking");
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const sttResult = await speechToText({
          audioDataUri: base64Audio,
          language: selectedLanguage,
        });
        const { transcript } = sttResult;
        setTranscribedText(transcript);

        const navResult = await understandNavigation({
          text: transcript,
          language: selectedLanguage,
        });

        // Narrow the union type before accessing pageKey
        if (
          navResult.shouldNavigate &&
          "pageKey" in navResult &&
          navResult.pageKey
        ) {
          const pageKey = navResult.pageKey!;
          await speak(navResult.message);
          setTimeout(() => {
            router.push(pageKey);
          }, 2500);
        } else {
          await speak(navResult.message);
        }
      } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "AI Processing Failed",
          description: "An unexpected error occurred.",
        });
        setAssistantState("idle");
      }
    };
  };

  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setAssistantState("idle");
        return;
      }
      setAssistantState("speaking");
      setLastResponse(text);
      setAudioUrl("");
      try {
        const result = await textToSpeech(text, selectedLanguage);
        setAudioUrl(result.audioDataUri);
      } catch {
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: "An unexpected error occurred.",
        });
        setAssistantState("idle");
      }
    },
    [selectedLanguage, toast]
  );

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => {
        setAssistantState("idle");
      };
    } else if (assistantState === "speaking" && !audioUrl) {
      setAssistantState("idle");
    }
  }, [audioUrl, assistantState]);

  const getButtonState = () => {
    if (hasMicrophonePermission === false)
      return {
        disabled: true,
        text: "Mic Disabled",
        icon: <MicOff className="mr-2 h-6 w-6" />,
      };
    switch (assistantState) {
      case "listening":
        return {
          disabled: false,
          text: "Stop",
          onClick: handleStopRecording,
          variant: "destructive",
          icon: <Square className="mr-2 h-6 w-6" />,
        };
      case "thinking":
      case "speaking":
        return {
          disabled: true,
          text: "Processing...",
          icon: <Loader2 className="h-6 w-6 animate-spin" />,
        };
      case "idle":
      default:
        return {
          disabled: false,
          text: "Ask",
          onClick: handleStartRecording,
          variant: "default",
          icon: <Mic className="mr-2 h-6 w-6" />,
        };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className={positionClass}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size={isHubPortal ? "sm" : "lg"}
            className={`rounded-full ${buttonSize} shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200`}
            aria-label="Open Voice Assistant"
          >
            <Volume2 className={iconSize} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Assistant</DialogTitle>
            <DialogDescription>
              Speak to navigate and get help with Manvaasam
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={buttonState.onClick}
                disabled={buttonState.disabled}
                variant={(buttonState.variant as any) || "default"}
                className="w-40 h-12 text-base font-medium rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {buttonState.icon}
                {buttonState.text}
              </Button>
            </div>

            {assistantState === "listening" && (
              <div className="text-center text-destructive animate-pulse">
                Listening...
              </div>
            )}

            <div className="min-h-[6rem] space-y-3">
              {transcribedText && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                    <Mic className="h-4 w-4" />
                    You Said:
                  </div>
                  <p className="text-gray-700 mt-1 text-sm">
                    {transcribedText}
                  </p>
                </div>
              )}

              {lastResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                    <Volume2 className="h-4 w-4" />
                    Assistant:
                  </div>
                  <p className="text-gray-700 mt-1 text-sm">{lastResponse}</p>
                  {audioUrl && (
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      className="w-full mt-2"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
