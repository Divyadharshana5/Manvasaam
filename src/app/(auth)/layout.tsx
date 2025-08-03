import { ManvaasamLogo } from "@/components/icons";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <ManvaasamLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-primary">Manvaasam</span>
      </Link>
      {children}
    </div>
  );
}
