
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square, Volume2, ArrowLeft, MicOff } from "lucide-react";
import { speechToText } from "@/ai/flows/stt-flow";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

type RecordingStatus = "idle" | "recording" | "stopped";

export default function VoiceAssistantPage() {
  // Speech-to-Text states
  const [transcribedText, setTranscribedText] = useState("");
  const [sttLoading, setSttLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);

  // Text-to-Speech states
  const [inputText, setInputText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [ttsLoading, setTtsLoading] = useState(false);
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
        // Permissions API might not be supported in all browsers (e.g., Firefox for 'microphone')
        // We'll rely on the getUserMedia catch block in that case.
        setHasMicrophonePermission(true); // Assume true and let getUserMedia handle it
        console.warn("Could not query microphone permission status:", error);
      }
    };
    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    setTranscribedText("");
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

      mediaRecorderRef.current.onstop = async () => {
        setSttLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await speechToText({ audioDataUri: base64Audio, language: selectedLanguage });
            setTranscribedText(result.transcript);
            setInputText(result.transcript); // auto-fill TTS input
          } catch (error: any) {
            console.error("Error transcribing speech:", error);
            toast({
              variant: "destructive",
              title: "Transcription Failed",
              description: error.message || "An unexpected error occurred.",
            });
          } finally {
            setSttLoading(false);
          }
        };
      };

      mediaRecorderRef.current.start();
      setRecordingStatus("recording");
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
    if (mediaRecorderRef.current && recordingStatus === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingStatus("stopped");
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTextToSpeech = async () => {
    if (!inputText.trim()) {
        toast({
            variant: "destructive",
            title: "Input Required",
            description: "Please enter some text to convert to speech.",
        });
        return;
    }
    setTtsLoading(true);
    setAudioUrl("");
    try {
        const result = await textToSpeech(inputText);
        setAudioUrl(result.audioDataUri);
    } catch (error: any) {
        console.error("Error converting text to speech:", error);
        toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setTtsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Voice Assistant</CardTitle>
        <CardDescription>
          Convert speech to text and text back to speech.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasMicrophonePermission === false && (
            <Alert variant="destructive" className="mb-4">
              <MicOff className="h-4 w-4" />
              <AlertTitle>Microphone Access Denied</AlertTitle>
              <AlertDescription>
                You have denied microphone access. Please go to your browser settings to enable it for this site.
              </AlertDescription>
            </Alert>
        )}
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-transparent border-0 shadow-none p-0">
                <CardHeader>
                    <CardTitle>Speech-to-Text</CardTitle>
                    <CardDescription>Record your voice and see the transcription below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        {recordingStatus !== "recording" ? (
                            <Button onClick={handleStartRecording} disabled={sttLoading || hasMicrophonePermission === false}>
                            <Mic className="mr-2 h-4 w-4" />
                            Start Recording
                            </Button>
                        ) : (
                            <Button onClick={handleStopRecording} variant="destructive">
                            <Square className="mr-2 h-4 w-4" />
                            Stop Recording
                            </Button>
                        )}
                        {recordingStatus === 'recording' && <div className="flex items-center gap-2 text-destructive"><div className="h-3 w-3 rounded-full bg-destructive animate-pulse"></div><span>Recording...</span></div>}
                    </div>

                    {sttLoading && (
                    <div className="flex items-center gap-2 pt-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Transcribing audio...</span>
                    </div>
                    )}
                    
                    {transcribedText && !sttLoading && (
                    <Alert className="mt-4">
                        <AlertTitle>Transcription Result</AlertTitle>
                        <AlertDescription className="pt-2">
                        <p className="text-base leading-relaxed">{transcribedText}</p>
                        </AlertDescription>
                    </Alert>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-transparent border-0 shadow-none p-0">
                <CardHeader>
                    <CardTitle>Text-to-Speech</CardTitle>
                    <CardDescription>Enter text to generate and play back audio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Type your message here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={5}
                        disabled={ttsLoading}
                    />
                    <Button onClick={handleTextToSpeech} disabled={ttsLoading}>
                        {ttsLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Volume2 className="mr-2 h-4 w-4" />
                        )}
                        Generate Speech
                    </Button>
                    
                    {audioUrl && !ttsLoading && (
                         <Alert className="mt-4">
                            <AlertTitle>Generated Audio</AlertTitle>
                            <AlertDescription className="pt-2">
                                <audio ref={audioRef} src={audioUrl} controls autoPlay className="w-full">
                                    Your browser does not support the audio element.
                                </audio>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
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
