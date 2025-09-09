"use client";

import { VoiceCommandsHelp } from "@/components/voice-commands-help";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic, Volume2, Headphones, Settings } from "lucide-react";
import Link from "next/link";

export default function VoiceHelpPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/hub">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Assistant Help</h1>
          <p className="text-muted-foreground">Learn how to navigate using voice commands</p>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mic className="h-4 w-4 text-green-600" />
              Step 1: Enable Microphone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Click the floating microphone button or the voice assistant button in the header. 
              Allow microphone access when prompted by your browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              Step 2: Speak Command
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Speak clearly using one of the supported voice commands. 
              The system will show what it heard and confirm the action.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Headphones className="h-4 w-4 text-purple-600" />
              Step 3: Navigate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              The system will automatically navigate to the requested page. 
              You'll see a confirmation message before navigation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Voice Commands Guide */}
      <VoiceCommandsHelp />

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Voice not recognized?</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Check if microphone permissions are enabled</li>
                <li>• Ensure you're in a quiet environment</li>
                <li>• Speak clearly and at normal pace</li>
                <li>• Try using exact phrases from the commands list</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Browser compatibility:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Works best in Chrome, Edge, and Safari</li>
                <li>• Firefox has limited support</li>
                <li>• Ensure your browser is up to date</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Voice recognition requires an internet connection and may not work in all browsers or environments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}