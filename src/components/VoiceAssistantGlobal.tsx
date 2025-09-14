"use client";
import { useState, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
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

export function VoiceAssistantGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600"
            aria-label="Open Voice Assistant"
          >
            {/* Speaker icon for voice assistant */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5v14a1 1 0 001.707.707l5.586-5.586A2 2 0 0020 13V11a2 2 0 00-.707-1.414l-5.586-5.586A1 1 0 0011 5z"
              />
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
          <DialogHeader className="text-center pt-4">
            <DialogTitle>Enhanced Voice Assistant</DialogTitle>
            <DialogDescription>
              Ask me anything! I can help you navigate, answer questions about
              Manvaasam, or provide information about our platform.
            </DialogDescription>
          </DialogHeader>
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <VoiceAssistant />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}
