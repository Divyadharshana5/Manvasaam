"use client";
import { useState, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
const VoiceAssistant = lazy(() => import("@/components/voice-assistant"));

export function VoiceAssistantSidebarButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-2 text-green-700 hover:text-white hover:bg-green-500"
          aria-label="Open Voice Assistant"
        >
          <Volume2 className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
        <DialogHeader className="text-center pt-4">
          <DialogTitle>Enhanced Voice Assistant</DialogTitle>
          <DialogDescription>
            Ask me anything! I can help you navigate, answer questions about Manvaasam, or provide information about our platform.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <VoiceAssistant />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
