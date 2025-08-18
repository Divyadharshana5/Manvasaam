import Link from "next/link";
import { ManvaasamLogo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 mobile-container bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 touch-target"
          >
            <ManvaasamLogo width={32} height={32} className="sm:w-10 sm:h-10" />
            <span className="text-xl sm:text-2xl font-bold text-primary">
              Manvaasam
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
