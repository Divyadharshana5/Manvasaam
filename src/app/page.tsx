import HomePage from "@/components/home-page-optimized";
import { ClientOnly } from "@/components/client-only";

export default function Page() {
  return (
    <ClientOnly>
      <HomePage />
    </ClientOnly>
  );
}
