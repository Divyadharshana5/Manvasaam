"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2 } from "lucide-react";
import { textToSpeech, TextToSpeechOutput } from "@/ai/flows/tts-flow";
import { useToast } from "@/hooks/use-toast";

export default function VoiceAssistantPage() {
  const [inputText, setInputText] = useState("");
  const [audioResult, setAudioResult] = useState<TextToSpeechOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSpeech = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter some text to generate speech.",
      });
      return;
    }

    setLoading(true);
    setAudioResult(null);

    try {
      const result = await textToSpeech(inputText);
      setAudioResult(result);
    } catch (error: any) {
      console.error("Error generating speech:", error);
      toast({
        variant: "destructive",
        title: "Speech Generation Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Voice Assistant</h2>
            <p className="text-muted-foreground">
              Convert text to speech for easy listening.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Text-to-Speech Converter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter the text you want to hear..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Button onClick={handleGenerateSpeech} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="mr-2 h-4 w-4" />
              )}
              Generate Speech
            </Button>
            
            {audioResult && audioResult.audioDataUri && (
                <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Generated Audio</h3>
                    <audio controls autoPlay src={audioResult.audioDataUri} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
