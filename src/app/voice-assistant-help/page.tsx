"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Navigation, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VoiceAssistantHelpPage() {
  const voiceCommands = [
    { command: "Go to dashboard", description: "Navigate to main dashboard" },
    { command: "Open profile", description: "Go to your profile page" },
    { command: "Show orders", description: "View your orders" },
    { command: "Navigate to products", description: "Browse products" },
    { command: "Go to tracking", description: "Track your deliveries" },
    { command: "Open matchmaking", description: "Access matchmaking features" },
    { command: "Show marketing", description: "View marketing tools" },
    { command: "Go to FAQ", description: "Access help and FAQ" },
    { command: "Hub dashboard", description: "Navigate to hub dashboard (for hub users)" },
    { command: "Show inventory", description: "View inventory (for hub users)" },
    { command: "Go to farmers", description: "Manage farmers (for hub users)" },
    { command: "Show deliveries", description: "View deliveries (for hub users)" },
    { command: "Open analytics", description: "View analytics (for hub users)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Mic className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Voice Assistant Help</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how to navigate Manvaasam using voice commands
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                How to Use
              </CardTitle>
              <CardDescription>
                Follow these simple steps to use the voice assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Click the microphone button</p>
                    <p className="text-sm text-muted-foreground">
                      Look for the mic icon in the top navigation bar
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Speak your command</p>
                    <p className="text-sm text-muted-foreground">
                      Say a navigation command clearly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Wait for response</p>
                    <p className="text-sm text-muted-foreground">
                      The assistant will navigate you to the requested page
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Tips & Tricks
              </CardTitle>
              <CardDescription>
                Get the most out of your voice assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Speak clearly:</strong> Use a normal speaking pace and volume
                </p>
                <p className="text-sm">
                  <strong>Use keywords:</strong> You can say "go to", "open", "show", or "navigate to"
                </p>
                <p className="text-sm">
                  <strong>Browser permissions:</strong> Allow microphone access when prompted
                </p>
                <p className="text-sm">
                  <strong>Quiet environment:</strong> Works best in low-noise environments
                </p>
                <p className="text-sm">
                  <strong>Dedicated assistant:</strong> Only responds to navigation commands
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Available Voice Commands
            </CardTitle>
            <CardDescription>
              Here are all the voice commands you can use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {voiceCommands.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="shrink-0">
                    <Mic className="h-3 w-3" />
                  </Badge>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">"{item.command}"</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/dashboard">
            <Button>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}