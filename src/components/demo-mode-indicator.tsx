"use client";

import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function DemoModeIndicator() {
  const { isDemoMode } = useAuth();

  if (!isDemoMode) return null;

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> Firebase is not available. All features work with mock data.
      </AlertDescription>
    </Alert>
  );
}