"use client";

import Link from "next/link";
import { ManvaasamLogo } from "@/components/icons";
import VoiceAssistant from "@/components/voice-assistant";
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
import { useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 mobile-container bg-gradient-to-br from-background via-background to-primary/5">
      {/* Voice Assistant */}
      <div className="fixed top-4 right-4 z-50">
        <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.sidebar.voiceAssistant}</DialogTitle>
              <DialogDescription>
                Ask me anything about Manvaasam or get help navigating!
              </DialogDescription>
            </DialogHeader>
            <VoiceAssistant />
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <ManvaasamLogo width={32} height={32} />
            <span className="text-xl font-bold text-primary">Manvaasam</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
