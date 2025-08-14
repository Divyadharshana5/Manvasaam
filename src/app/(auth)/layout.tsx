
import Link from "next/link";
import { ManvaasamLogo } from "@/components/icons";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
       <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/bg-2.png')" }}
        ></div>
        <div className="absolute inset-0 bg-background/70 z-0"></div>
      <Link href="/" className="absolute top-8 left-8 z-10 flex items-center gap-2">
        <ManvaasamLogo width={40} height={40} />
        <span className="text-xl font-bold text-primary [text-shadow:0_1px_2px_rgb(0_0_0/_20%)]">Manvaasam</span>
      </Link>
      <div className="z-10 w-full px-4">
        {children}
      </div>
    </div>
  );
}
