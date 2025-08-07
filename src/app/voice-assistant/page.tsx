
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square, Volume2, ArrowLeft, MicOff } from "lucide-react";
import { speechToText } from "@/ai/flows/stt-flow";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { understandNavigation } from "@/ai/flows/navigation-flow";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "confirming_navigation";

interface NavigationConfirmation {
    page: string;
    message: string;
}

export default function VoiceAssistantPage() {
  const router = useRouter();
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [lastResponse, setLastResponse] = useState("");
  const [navigationConfirmation, setNavigationConfirmation] = useState<NavigationConfirmation | null>(null);

  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);

  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const { selectedLanguage } = useLanguage();
  
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        // Attempt to get user media to prompt for permission if not already granted
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicrophonePermission(true);
        // Stop the tracks immediately as we only needed to check for permission
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Microphone access denied:", error);
        setHasMicrophonePermission(false);
      }
    };
    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    setTranscribedText("");
    setLastResponse("");
    setAudioUrl("");
    setNavigationConfirmation(null);

    if (hasMicrophonePermission === false) {
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please allow microphone access in your browser settings to use this feature.",
        });
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = processAudio;
      
      mediaRecorderRef.current.start();
      setAssistantState("listening");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setHasMicrophonePermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && assistantState === "listening") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
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
        const sttResult = await speechToText({ audioDataUri: base64Audio, language: selectedLanguage });
        const transcript = sttResult.transcript;
        setTranscribedText(transcript);
        
        if (navigationConfirmation) {
            if (transcript.toLowerCase().includes('yes') || transcript.toLowerCase().includes('ஆமாம்')) {
                 router.push(navigationConfirmation.page);
                 return;
            } else {
                 setNavigationConfirmation(null);
            }
        }

        const navResult = await understandNavigation({ text: transcript, language: selectedLanguage });

        if (navResult.intent === 'navigate' || navResult.intent === 'faq') {
          setNavigationConfirmation({ page: navResult.page!, message: navResult.confirmationMessage! });
          await speak(navResult.confirmationMessage!);
          setAssistantState("confirming_navigation");
        } else {
          await speak(`I heard you say: "${transcript}". I can only help with navigation right now.`);
        }

      } catch (error: any) {
        console.error("Error during AI processing:", error);
        toast({
          variant: "destructive",
          title: "AI Processing Failed",
          description: error.message || "An unexpected error occurred.",
        });
        setAssistantState("idle");
      }
    };
  };

  const speak = async (text: string) => {
     if (!text.trim()) {
        setAssistantState("idle");
        return;
     };
    setAssistantState("speaking");
    setLastResponse(text);
    setAudioUrl("");
    try {
        const result = await textToSpeech(text);
        setAudioUrl(result.audioDataUri);
    } catch (error: any) {
        console.error("Error converting text to speech:", error);
        toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setAssistantState("idle");
    }
  }
  
  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        audioRef.current.onended = () => {
            if (assistantState !== 'confirming_navigation') {
                setAssistantState('idle');
            } else {
                // After confirmation question, go back to listening
                handleStartRecording();
            }
        };
    } else if(assistantState === 'speaking' && !audioUrl) {
       // If TTS fails, don't get stuck in speaking state
       setAssistantState('idle');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);


  const getButtonState = () => {
      if(hasMicrophonePermission === false) return { disabled: true, text: "Mic Disabled" };
      switch(assistantState) {
        case 'listening': return { disabled: false, text: "Stop", onClick: handleStopRecording, variant: "destructive", icon: <Square className="mr-2 h-6 w-6" /> };
        case 'thinking':
        case 'speaking': return { disabled: true, text: "Processing...", icon: <Loader2 className="h-6 w-6 animate-spin" /> };
        case 'confirming_navigation':
        case 'idle':
        default: return { disabled: false, text: "Ask", onClick: handleStartRecording, variant: "default", icon: <Mic className="mr-2 h-6 w-6" /> };
      }
  }

  const buttonState = getButtonState();

  return (
    <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Voice Assistant</CardTitle>
        <CardDescription>
          Ask me to navigate to a page, like "Go to the restaurant registration page".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasMicrophonePermission === false && (
            <Alert variant="destructive" className="mb-4">
              <MicOff className="h-4 w-4" />
              <AlertTitle>Microphone Access Denied</AlertTitle>
              <AlertDescription>
                You have denied microphone access. Please go to your browser settings to enable it for this site.
              </AlertDescription>
            </Alert>
        )}
       
        <div className="flex justify-center">
            <Button 
                onClick={buttonState.onClick} 
                disabled={buttonState.disabled} 
                variant={buttonState.variant as any}
                className="w-48 h-16 text-lg"
            >
                {buttonState.icon}
                {buttonState.text}
            </Button>
        </div>
        
        {assistantState === 'listening' && <div className="text-center text-destructive animate-pulse">Listening...</div>}
        
        <div className="min-h-[8rem] space-y-4">
            {transcribedText && (
                <Alert>
                    <Mic className="h-4 w-4" />
                    <AlertTitle>You Said:</AlertTitle>
                    <AlertDescription>
                    {transcribedText}
                    </AlertDescription>
                </Alert>
            )}

            {lastResponse && (
                <Alert>
                     <Volume2 className="h-4 w-4" />
                    <AlertTitle>Assistant Said:</AlertTitle>
                    <AlertDescription>
                        {lastResponse}
                        {audioUrl && <audio ref={audioRef} src={audioUrl} className="w-full mt-2" />}
                    </AlertDescription>
                </Alert>
            )}
        </div>
      
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild variant="outline">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
