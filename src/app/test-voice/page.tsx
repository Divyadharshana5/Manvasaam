"use client";

import InstantVoiceAssistant from "@/components/instant-voice-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestVoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">
              Voice Assistant Test
            </CardTitle>
            <CardDescription>
              Test the instant voice navigation feature. Click the microphone button and speak a page name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InstantVoiceAssistant size="lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Try saying:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• "Go to dashboard"</li>
                    <li>• "Open orders"</li>
                    <li>• "Show products"</li>
                    <li>• "Navigate to profile"</li>
                    <li>• "Take me to inventory"</li>
                    <li>• "Open matchmaking"</li>
                    <li>• "Go to FAQ"</li>
                    <li>• "Show marketing"</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How it works:</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm">
                    <li>1. Click the microphone button</li>
                    <li>2. Speak your command clearly</li>
                    <li>3. The system will process your voice</li>
                    <li>4. Navigate automatically or say "Not Found"</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>The voice assistant uses your selected language and will respond accordingly.</p>
              <p>If a page is not found, it will say "Not Found" in your selected language.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}