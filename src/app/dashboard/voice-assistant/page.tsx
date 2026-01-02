"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Volume2,
  Settings,
  Languages,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import VoiceAssistant from "@/components/voice-assistant";

export default function VoiceAssistantPage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Malayalam",
    "Telugu",
    "Kannada",
    "Bengali",
    "Arabic",
    "Urdu",
    "Srilanka",
  ] as const;

  const commands = [
    { command: "Dashboard", description: "Go to main dashboard" },
    { command: "Orders", description: "View and manage orders" },
    { command: "Products", description: "Browse product catalog" },
    { command: "Track", description: "Track order status" },
    { command: "Profile", description: "View user profile" },
    { command: "Inventory", description: "Check stock levels" },
    { command: "Reports", description: "View analytics and reports" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Voice Assistant</h1>
          <p className="text-muted-foreground">
            Control your hub operations with voice commands
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voice Control</CardTitle>
            <CardDescription>Tap to start voice commands</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative flex justify-center">
              <VoiceAssistant />
            </div>

            <div>
              <p className="text-lg font-medium">Voice Navigation</p>
              <p className="text-sm text-muted-foreground">
                Click the microphone and say where you want to go
              </p>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Try saying:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">"Dashboard"</Badge>
                <Badge variant="outline">"Orders"</Badge>
                <Badge variant="outline">"Products"</Badge>
                <Badge variant="outline">"Profile"</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {lang}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Commands</CardTitle>
          <CardDescription>
            Try these voice commands to control your hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {commands.map((cmd, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">"{cmd.command}"</p>
                  <p className="text-sm text-muted-foreground">
                    {cmd.description}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Help & Tips</CardTitle>
          <CardDescription>Get the most out of voice assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Speak clearly</p>
                <p className="text-sm text-muted-foreground">
                  Use clear pronunciation for better recognition
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Use keywords</p>
                <p className="text-sm text-muted-foreground">
                  Include action words like "show", "check", "call"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Wait for response</p>
                <p className="text-sm text-muted-foreground">
                  Allow the assistant to process your command
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
