import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic import with loading state for better performance
const HomePage = dynamic(() => import("@/components/home-page-optimized"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium text-primary">Loading Manvaasam...</p>
      </div>
    </div>
  ),
  ssr: true, // Enable SSR for better SEO
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-primary">Loading Manvaasam...</p>
        </div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}
