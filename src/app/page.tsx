"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/home-page-optimized"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  return <HomePage />;
}
