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

  // Hide voice assistant on login/register pages and homepage
  if (
    pathname?.startsWith("/login") ||
    pathname?.includes("register") ||
    pathname === "/"
  ) {
    return null;
  }

  // Position in top-right for hub portal pages, bottom-right for others
  const isHubPortal = pathname?.startsWith("/dashboard/hub");
  console.log("isHubPortal:", isHubPortal);
  const positionClass = isHubPortal
    ? "fixed top-4 right-4 z-[9999]"
    : "fixed bottom-6 right-6 z-[9999]";
  console.log("positionClass:", positionClass);
  const buttonSize = isHubPortal ? "w-10 h-10" : "w-16 h-16";
  const iconSize = isHubPortal ? "h-4 w-4" : "h-7 w-7";

  return (
    <div className={positionClass}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size={buttonSize}
            className={`rounded-full ${buttonSize} shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200`}
            aria-label="Open Voice Assistant"
          >
            <Volume2 className={iconSize} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg w-full max-h-[92vh] sm:max-h-[96vh] overflow-y-auto rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-neutral-900/95">
          <DialogHeader>
            <DialogTitle>Voice Assistant</DialogTitle>
            <DialogDescription>
              Your personal AI assistant is ready to help you. What can I assist
              you with today?
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <p>Content of the dialog box goes here.</p>
            <div className="mt-4">
              <Button
                variant="default"
                size="sm"
                className="rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200"
                onClick={() => setIsOpen(false)}
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
