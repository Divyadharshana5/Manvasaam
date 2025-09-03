import { Fingerprint, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FingerprintStatusProps {
  status: "ready" | "registering" | "authenticating" | "error" | "success";
  supported: boolean;
  registered: boolean;
  feedback: string;
  className?: string;
}

export function FingerprintStatus({ 
  status, 
  supported, 
  registered, 
  feedback, 
  className 
}: FingerprintStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "registering":
      case "authenticating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Fingerprint className={cn(
          "h-4 w-4",
          supported ? "text-emerald-500" : "text-gray-400"
        )} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "registering":
      case "authenticating":
        return "text-blue-600 dark:text-blue-400";
      default:
        return supported 
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {getStatusIcon()}
      <span className={cn("text-xs", getStatusColor())}>
        {feedback}
      </span>
    </div>
  );
}