"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFastNavigation } from "@/lib/fast-navigation";
import "@/styles/fast-transitions.css";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { SimpleVoiceNav } from "@/components/simple-voice-nav";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  BarChart3,
  Settings,
  Menu,
  HelpCircle,
  Power,
  DoorOpen,
  Clock,
  Mic,
  ShoppingCart,
  UserCheck,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/hub",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/hub/orders",
    icon: ShoppingCart,
  },
  {
    title: "Deliveries",
    href: "/dashboard/hub/deliveries",
    icon: Truck,
  },
  {
    title: "Farmers",
    href: "/dashboard/hub/farmers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/hub/analytics",
    icon: BarChart3,
  },
  {
    title: "Voice Help",
    href: "/dashboard/hub/voice-help",
    icon: Mic,
  },
  {
    title: "Settings",
    href: "/dashboard/hub/settings",
    icon: Settings,
  },
];

function Sidebar({ className, onSignOut }: { className?: string; onSignOut: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("pb-4 flex flex-col h-full", className)}>
        <div className="flex-1 space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg border">
              <h2 className="text-lg font-semibold">Hub Portal</h2>
            </div>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("pb-4 bg-gradient-to-b from-green-50/30 via-lime-50/30 to-yellow-50/30 dark:from-green-950/30 dark:via-lime-950/30 dark:to-yellow-950/30 flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900 dark:to-lime-900 border border-green-200 dark:border-green-700">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
              Hub Portal
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start fast-button hover:bg-green-100 dark:hover:bg-green-900",
                    pathname === item.href && "bg-gradient-to-r from-green-200 to-lime-200 dark:from-green-800 dark:to-lime-800 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600"
                  )}
                  onMouseEnter={() => preload(item.href)}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4",
                    pathname === item.href ? "text-green-700 dark:text-green-300" : "text-green-600 dark:text-green-400"
                  )} />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-3 py-3 border-t-2 border-gradient-to-r from-green-200 via-lime-200 to-yellow-200 dark:from-green-700 dark:via-lime-700 dark:to-yellow-700 bg-gradient-to-r from-green-50/50 via-lime-50/50 to-yellow-50/50 dark:from-green-950/50 dark:via-lime-950/50 dark:to-yellow-950/50">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start group relative overflow-hidden bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 dark:from-green-900 dark:via-lime-900 dark:to-yellow-900 hover:from-green-500 hover:via-lime-500 hover:to-yellow-500 dark:hover:from-green-600 dark:hover:via-lime-600 dark:hover:to-yellow-600 text-green-700 dark:text-green-300 hover:text-white dark:hover:text-white border-2 border-green-200 dark:border-green-700 hover:border-lime-400 dark:hover:border-lime-500 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-green-200 dark:hover:shadow-green-900/50 rounded-xl p-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-lime-500/0 to-yellow-500/0 group-hover:from-green-500/30 group-hover:via-lime-500/30 group-hover:to-yellow-500/30 transition-all duration-500 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-gradient-to-r from-green-400/20 via-lime-400/20 to-yellow-400/20 transition-all duration-300"></div>
          <Power className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10 transition-all duration-300" />
          <span className="relative z-10 font-bold text-base group-hover:text-lg transition-all duration-300">
            🚪 Sign Out
          </span>
          <DoorOpen className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { navigate, preload } = useFastNavigation();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("userType");
        localStorage.removeItem("userEmail");
        
        toast({
          title: "🏢 Signed Out Successfully",
          description: "🚚 Thank you for using Hub Management Portal",
          duration: 2000,
        });

        setTimeout(() => {
          router.push("/login/hub");
        }, 1000);
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Please try again or refresh the page",
      });
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-green-200 dark:border-green-700 bg-gradient-to-b from-green-50/50 to-lime-50/50 dark:from-green-950/50 dark:to-lime-950/50 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <Sidebar onSignOut={handleSignOut} />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="md:hidden p-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-green-200 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Sidebar onSignOut={handleSignOut} />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="border-b border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">Hub Management Portal</h2>
            <div className="flex items-center gap-3">
              {/* Voice Navigation text removed as requested */}
              <SimpleVoiceNav />
            </div>
          </div>
        </div>
        
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
        

      </div>
    </div>
  );
}