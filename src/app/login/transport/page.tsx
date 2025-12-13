"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function TransportLoginRedirect() {
  useEffect(() => {
    // Redirect to the actual transport login page
    redirect("/(auth)/login/transport");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting to transport login...</p>
      </div>
    </div>
  );
}