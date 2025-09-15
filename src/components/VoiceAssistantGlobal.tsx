"use client";
import { useState, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { FastNavButton } from "@/components/ui/fast-nav-button";
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

export function VoiceAssistantGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide voice assistant on hub login page
  if (pathname === "/login/hub") {
    return null;
  }
  
  // Position in top-right for hub portal pages, bottom-right for others
  const isHubPortal = pathname?.startsWith("/dashboard/hub");
  const positionClass = isHubPortal ? "fixed top-4 right-4 z-[9999]" : "fixed bottom-6 right-6 z-[9999]";
  const buttonSize = isHubPortal ? "w-10 h-10" : "w-16 h-16";
  const iconSize = isHubPortal ? "h-4 w-4" : "h-7 w-7";
  
  return (
    <div className={positionClass}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FastNavButton
            href="#"
            variant="default"
            size={isHubPortal ? "sm" : "lg"}
            className={`rounded-full ${buttonSize} shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600`}
            aria-label="Open Voice Assistant"
            onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
          >
            <Volume2 className={iconSize} />
          </FastNavButton>
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
