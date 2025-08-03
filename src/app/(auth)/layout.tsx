import { AgriLinkLogo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <AgriLinkLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-primary">AgriLink</span>
      </div>
      {children}
    </div>
  );
}
