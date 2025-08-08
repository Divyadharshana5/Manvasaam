
import Link from "next/link";
import { AgriLinkLogo } from "@/components/icons";


export default function VoiceAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <AgriLinkLogo width={40} height={40} />
        <span className="text-xl font-bold text-primary">AgriLink</span>
      </Link>
      {children}
    </div>
  );
}
