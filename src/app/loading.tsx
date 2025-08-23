import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-full shadow-lg">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-primary">Loading Manvaasam</h2>
        <p className="mt-2 text-sm text-muted-foreground">Preparing your agricultural marketplace...</p>
        
        {/* Progress indicator */}
        <div className="mt-4 w-48 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{
              animation: "loading-progress 2s ease-in-out infinite"
            }}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}