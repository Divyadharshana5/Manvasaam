
import Link from "next/link";
import { ManvaasamLogo } from "@/components/icons";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
                <ManvaasamLogo width={40} height={40} />
                <span className="text-2xl font-bold text-primary">Manvaasam</span>
            </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
