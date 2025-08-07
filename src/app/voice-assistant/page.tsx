
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
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { useRouter } from "next/navigation";


type RecordingStatus = "idle" | "recording" | "stopped";
type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "confirming_navigation";

interface NavigationConfirmation {
    page: string;
    message: string;
}

export default function VoiceAssistantPage() {
  const router = useRouter();
  // General state
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [lastResponse, setLastResponse] = useState("");
  const [navigationConfirmation, setNavigationConfirmation] = useState<NavigationConfirmation | null>(null);

  // Speech-to-Text states
  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);

  // Text-to-Speech states
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const { selectedLanguage } = useLanguage();
  
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasMicrophonePermission(permissionStatus.state !== 'denied');
        permissionStatus.onchange = () => {
          setHasMicrophonePermission(permissionStatus.state !== 'denied');
        };
      } catch (error) {
        setHasMicrophonePermission(true); 
        console.warn("Could not query microphone permission status:", error);
      }
    };
    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    setTranscribedText("");
    setLastResponse("");
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
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/wav' });
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
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const sttResult = await speechToText({ audioDataUri: base64Audio, language: selectedLanguage });
        const transcript = sttResult.transcript;
        setTranscribedText(transcript);
        
        // Handle confirmation logic
        if (navigationConfirmation && transcript.toLowerCase().includes('yes')) {
            router.push(navigationConfirmation.page);
            return;
        }

        const navResult = await understandNavigation({ text: transcript, language: selectedLanguage });

        if (navResult.intent === 'navigate' || navResult.intent === 'faq') {
          setNavigationConfirmation({ page: navResult.page!, message: navResult.confirmationMessage! });
          await speak(navResult.confirmationMessage!);
          setAssistantState("confirming_navigation");
        } else {
          // Handle other intents or simple TTS here in the future
          await speak(transcript); // For now, just repeat what was said
          setAssistantState("speaking");
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
     if (!text.trim()) return;
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
        audioRef.current.play();
        audioRef.current.onended = () => {
            if (assistantState !== 'confirming_navigation') {
                setAssistantState('idle');
            }
        };
    }
  }, [audioUrl, assistantState]);


  const isLoading = assistantState === 'thinking' || assistantState === 'speaking';
  const isRecording = assistantState === 'listening';

  return (
    <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Voice Assistant</CardTitle>
        <CardDescription>
          Ask me to navigate, or just talk and I'll repeat it back!
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
            {isRecording ? (
                <Button onClick={handleStopRecording} variant="destructive" className="w-48 h-16 text-lg">
                <Square className="mr-2 h-6 w-6" />
                Stop
                </Button>
            ) : (
                <Button onClick={handleStartRecording} disabled={isLoading || hasMicrophonePermission === false} className="w-48 h-16 text-lg">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Mic className="mr-2 h-6 w-6" />}
                {isLoading ? 'Processing...' : 'Ask'}
                </Button>
            )}
        </div>
        
        {isRecording && <div className="text-center text-destructive animate-pulse">Listening...</div>}
        
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
                        {audioUrl && <audio ref={audioRef} src={audioUrl} className="w-full mt-2" controls />}
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
