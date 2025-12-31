"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/home-page-optimized"), {
  ssr: false,
});

export default function Page() {
  return <HomePage />;
}
