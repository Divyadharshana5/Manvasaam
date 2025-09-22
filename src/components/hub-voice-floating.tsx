"use client";

import { VoiceAssistantGlobal } from "@/components/VoiceAssistantGlobal";
import { Mic } from "lucide-react";

export function HubVoiceFloating() {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 group"
      style={{
        width: "60px",
        height: "60px",
      }}
    >
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-lime-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white hover:scale-110 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #22c55e 0%, #84cc16 100%)",
          boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
        }}
      >
        <VoiceAssistantGlobal />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Voice Assistant
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
}