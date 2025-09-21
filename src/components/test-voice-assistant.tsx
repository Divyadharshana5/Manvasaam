"use client";
import { VoiceAssistantGlobal } from "./VoiceAssistantGlobal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TestVoiceAssistant() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Voice Assistant Test</CardTitle>
        <CardDescription>
          Click the voice button and say commands like:
          <br />• "Dashboard" - Go to dashboard
          <br />• "Orders" - View orders
          <br />• "Products" - Browse products
          <br />• "Track" - Track orders
          <br />• "Profile" - View profile
          <br />• "Home" - Go to home page
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <VoiceAssistantGlobal />
      </CardContent>
    </Card>
  );
}