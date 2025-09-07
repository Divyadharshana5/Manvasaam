"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Settings, Languages, HelpCircle } from "lucide-react";

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = ["English", "Hindi", "Marathi", "Gujarati", "Tamil"];
  
  const commands = [
    { command: "Check inventory", description: "View current stock levels" },
    { command: "Show orders", description: "Display pending orders" },
    { command: "Attendance report", description: "Get today's attendance" },
    { command: "Sales summary", description: "View daily sales data" },
    { command: "Call farmer", description: "Connect with farmers" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Voice Assistant</h1>
          <p className="text-muted-foreground">Control your hub operations with voice commands</p>
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
            <div className="relative">
              <Button
                size="lg"
                className={`w-32 h-32 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? (
                  <MicOff className="h-12 w-12" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </Button>
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse"></div>
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium">
                {isListening ? "Listening..." : "Tap to speak"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Say your command now" : "Voice assistant is ready"}
              </p>
            </div>

            <Badge variant={isListening ? "destructive" : "secondary"}>
              {isListening ? "Recording" : "Ready"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
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
          <CardDescription>Try these voice commands to control your hub</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {commands.map((cmd, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">"{cmd.command}"</p>
                  <p className="text-sm text-muted-foreground">{cmd.description}</p>
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
                <p className="text-sm text-muted-foreground">Use clear pronunciation for better recognition</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Use keywords</p>
                <p className="text-sm text-muted-foreground">Include action words like "show", "check", "call"</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Wait for response</p>
                <p className="text-sm text-muted-foreground">Allow the assistant to process your command</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}