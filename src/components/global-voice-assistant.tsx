"use client";

import { usePathname } from "next/navigation";
import SimpleVoiceNavigation from "./simple-voice-navigation";

export default function GlobalVoiceAssistant() {
  const pathname = usePathname();

  // Hide voice assistant on login/register pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.includes("register")
  ) {
    return null;
  }

  // Position based on current page
  const isHubPortal = pathname?.startsWith("/dashboard/hub");
  const positionClass = isHubPortal
    ? "fixed top-4 right-4 z-[9999]"
    : "fixed bottom-6 right-6 z-[9999]";
  
  const size = isHubPortal ? "sm" : "lg";

  return (
    <div className={positionClass}>
      <SimpleVoiceNavigation 
        size={size}
        className="shadow-lg transition-all duration-200 hover:scale-105"
      />
    </div>
  );
}