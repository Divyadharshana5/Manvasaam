"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ClientOnly } from "@/components/client-only";

const HomePage = dynamic(() => import("@/components/home-page-optimized"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientOnly>
        <HomePage />
      </ClientOnly>
    </Suspense>
  );
}
