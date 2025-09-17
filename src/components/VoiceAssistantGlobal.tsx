"use client";
import { useState, useRef, MutableRefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
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

// List of known routes for navigation (add more as needed)
const KNOWN_ROUTES = [
  "/dashboard",
  "/dashboard/farmer",
  "/dashboard/customer",
  "/dashboard/hub",
  "/dashboard/restaurant",
  "/dashboard/orders",
  "/dashboard/products",
  "/dashboard/faq",
  "/dashboard/marketing",
  "/dashboard/matchmaking",
  "/dashboard/voice-assistant",
  "/dashboard/track",
  "/dashboard/profile",
  "/dashboard/contact",
  "/dashboard/hub/inventory",
  "/dashboard/hub/attendance",
  "/privacy",
  "/terms",
  "/support",
  "/test-dropdown",
  "/test-hub",
  "/test-email",
  "/voice-assistant-help",
];

const ROUTE_ALIASES = {
  dashboard: "/dashboard",
  farmer: "/dashboard/farmer",
  customer: "/dashboard/customer",
  hub: "/dashboard/hub",
  restaurant: "/dashboard/restaurant",
  orders: "/dashboard/orders",
  products: "/dashboard/products",
  faq: "/dashboard/faq",
  marketing: "/dashboard/marketing",
  matchmaking: "/dashboard/matchmaking",
  "voice assistant": "/dashboard/voice-assistant",
  track: "/dashboard/track",
  profile: "/dashboard/profile",
  contact: "/dashboard/contact",
  inventory: "/dashboard/hub/inventory",
  attendance: "/dashboard/hub/attendance",
  privacy: "/privacy",
  terms: "/terms",
  support: "/support",
  "test dropdown": "/test-dropdown",
  "test hub": "/test-hub",
  "test email": "/test-email",
  help: "/voice-assistant-help",
};

export function VoiceAssistantGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const recognitionRef: MutableRefObject<any> = useRef(null);

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
  const positionClass = isHubPortal
    ? "fixed top-4 right-4 z-[9999]"
    : "fixed bottom-6 right-6 z-[9999]";
  const buttonSize = isHubPortal ? "icon" : "default";
  const buttonSizeClass = isHubPortal ? "w-10 h-10" : "w-16 h-16";
  const iconSize = isHubPortal ? "h-4 w-4" : "h-7 w-7";

  // --- Voice Assistant Logic ---
  function speak(text: string) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-IN";
      window.speechSynthesis.speak(utter);
    }
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  function findRouteFromSpeech(speech: string) {
    if (!speech) return null;
    const lower = speech.toLowerCase();
    // Try direct match
    for (const route of KNOWN_ROUTES) {
      if (lower.includes(route.replace("/dashboard/", "").replace("/", ""))) {
        return route;
      }
    }
    // Try alias match
    for (const [alias, path] of Object.entries(ROUTE_ALIASES)) {
      if (lower.includes(alias)) return path;
    }
    return null;
  }

  function listenForPageCommand() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak("Sorry, your browser does not support voice recognition.");
      return;
    }
    stopSpeaking();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const route = findRouteFromSpeech(transcript);
      if (route) {
        speak(
          "Navigating to " + route.replace("/dashboard/", "").replace("/", " ")
        );
        setTimeout(() => {
          router.push(route);
        }, 1200);
      } else {
        speak("Sorry, page not found. Please try again.");
      }
    };
    recognition.onerror = () => {
      speak("Sorry, I didn't catch that. Please try again.");
    };
    recognition.onend = () => {
      // Optionally, you can restart listening here for continuous mode
    };
    recognition.start();
    recognitionRef.current = recognition;
  }

  function handleVoiceButtonClick() {
    setIsOpen(true);
    setTimeout(() => {
      speak("Which page do you want to go to?");
      listenForPageCommand();
    }, 400); // Give dialog time to open
  }

  return (
    <div className={positionClass}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size={buttonSize}
            className={`rounded-full ${buttonSizeClass} shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200`}
            aria-label="Open Voice Assistant"
            onClick={handleVoiceButtonClick}
          >
            <Volume2 className={iconSize} />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-lg w-full max-h-[92vh] sm:max-h-[96vh] overflow-y-auto rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-neutral-900/95"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 2147483647,
            pointerEvents: "auto",
          }}
        >
          <DialogHeader>
            <DialogTitle>Voice Assistant</DialogTitle>
            <DialogDescription>
              <span className="font-semibold">
                Speak the page name you want to visit.
              </span>
              <br />
              For example: "Go to orders", "Open products", "Show hub", "Help"
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <p className="mb-2">Listening for your command...</p>
            <div className="mt-4">
              <Button
                variant="default"
                size="sm"
                className="rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-200"
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                  if (recognitionRef.current) {
                    recognitionRef.current.abort();
                  }
                }}
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
