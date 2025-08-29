"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Mic, Volume2, Square, Loader2, MicOff } from "lucide-react";

// Dynamic imports for AI flows to reduce initial bundle size
const speechToText = async (params: any) => {
  const { speechToText } = await import("@/ai/flows/stt-flow");
  return speechToText(params);
};

const understandNavigation = async (params: any) => {
  const { understandNavigation } = await import("@/ai/flows/navigation-flow");
  return understandNavigation(params);
};

const textToSpeech = async (text: string) => {
  const { textToSpeech } = await import("@/ai/flows/tts-flow");
  return textToSpeech(text);
};

type AssistantState = "idle" | "listening" | "thinking" | "speaking";

export default function VoiceAssistant() {
  const { selectedLanguage } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

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

        if (navResult.shouldNavigate && navResult.pageKey) {
          await speak(navResult.message);
          setTimeout(() => {
            router.push(navResult.pageKey!);
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
        const result = await textToSpeech(text);
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
    <div className="space-y-6 py-4">
      <div className="flex justify-center">
        <Button
          onClick={buttonState.onClick}
          disabled={buttonState.disabled}
          variant={(buttonState.variant as any) || "default"}
          className="w-48 h-16 text-lg"
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

      <div className="min-h-[8rem] space-y-4 px-2">
        {transcribedText && (
          <Alert className="no-animation">
            <Mic className="h-4 w-4" />
            <AlertTitle>You Said:</AlertTitle>
            <AlertDescription>{transcribedText}</AlertDescription>
          </Alert>
        )}

        {lastResponse && (
          <Alert className="no-animation">
            <Volume2 className="h-4 w-4" />
            <AlertTitle>Assistant Response:</AlertTitle>
            <AlertDescription>
              {lastResponse}
              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} className="w-full mt-2" />
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
