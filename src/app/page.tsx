"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

const HomePage = dynamic(() => import("@/components/home-page-simple"), {
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePage />
    </Suspense>
  );
}
