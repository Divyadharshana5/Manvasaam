
import Link from "next/link";
import { ManvaasamLogo } from "@/components/icons";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center auth-layout-background">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <ManvaasamLogo width={40} height={40} />
        <span className="text-xl font-bold text-primary">Manvaasam</span>
      </Link>
      {children}
    </div>
  );
}
