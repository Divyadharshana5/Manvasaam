"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
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



export function VoiceAssistantGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide voice assistant only on login/register pages
  if (pathname?.startsWith("/login") || pathname?.includes("register")) {
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
          <Button
            variant="default"
            size={isHubPortal ? "sm" : "lg"}
            className={`rounded-full ${buttonSize} shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200`}
            aria-label="Open Voice Assistant"
          >
            <Volume2 className={iconSize} />
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
          <div className="flex justify-center p-8">
            <div className="text-center space-y-4">
              <Volume2 className="h-12 w-12 mx-auto text-green-500" />
              <p className="text-sm text-muted-foreground">
                Voice Assistant is available for navigation and support.
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
