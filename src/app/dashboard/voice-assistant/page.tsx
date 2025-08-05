"use client";

import { useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square } from "lucide-react";
import { speechToText } from "@/ai/flows/stt-flow";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RecordingStatus = "idle" | "recording" | "stopped";

export default function VoiceAssistantPage() {
  const [transcribedText, setTranscribedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  const handleStartRecording = async () => {
    setTranscribedText("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await speechToText({ audioDataUri: base64Audio });
            setTranscribedText(result.transcript);
          } catch (error: any) {
            console.error("Error transcribing speech:", error);
            toast({
              variant: "destructive",
              title: "Transcription Failed",
              description: error.message || "An unexpected error occurred.",
            });
          } finally {
            setLoading(false);
          }
        };
      };

      mediaRecorderRef.current.start();
      setRecordingStatus("recording");
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
      // Stop microphone track
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Voice Assistant</h2>
            <p className="text-muted-foreground">
              Record your voice and see it transcribed into text.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Speech-to-Text Converter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {recordingStatus !== "recording" ? (
                <Button onClick={handleStartRecording} disabled={loading}>
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

            {loading && (
              <div className="flex items-center gap-2 pt-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Transcribing audio...</span>
              </div>
            )}
            
            {transcribedText && (
              <Alert className="mt-4">
                <AlertTitle>Transcription Result</AlertTitle>
                <AlertDescription className="pt-2">
                  <p className="text-base leading-relaxed">{transcribedText}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
