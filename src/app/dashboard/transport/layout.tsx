"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Menu,
  Truck,
  HelpCircle,
  Power,
  DoorOpen,
  Navigation,
  Mic,
  Route,
  Wrench,
  MapPin,
} from "lucide-react";

// Sidebar component
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
              <h2 className="text-lg font-semibold">Transport Portal</h2>
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
    <div className={cn("pb-4 bg-gradient-to-b from-orange-50/30 via-amber-50/30 to-yellow-50/30 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 border border-orange-200 dark:border-orange-700">
            <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
              Transport Portal
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start hover:bg-orange-100 dark:hover:bg-orange-900",
                    pathname === item.href && "bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-600"
                  )}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4",
                    pathname === item.href ? "text-orange-700 dark:text-orange-300" : "text-orange-600 dark:text-orange-400"
                  )} />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-3 border-t-2 border-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 dark:from-orange-700 dark:via-amber-700 dark:to-yellow-700 bg-gradient-to-r from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-950/50 dark:via-amber-950/50 dark:to-yellow-950/50">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start group relative overflow-hidden bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-orange-700 dark:text-orange-300 hover:text-white dark:hover:text-white border-2 border-orange-200 dark:border-orange-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-200 dark:hover:shadow-orange-900/50 rounded-xl p-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-amber-500/0 to-yellow-500/0 group-hover:from-orange-500/30 group-hover:via-amber-500/30 group-hover:to-yellow-500/30 transition-all duration-500 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-yellow-400/20 transition-all duration-300"></div>
          <Power className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10 transition-all duration-300" />
          <span className="relative z-10 font-bold text-sm group-hover:text-base transition-all duration-300">
            🚪 Sign Out
          </span>
          <DoorOpen className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:translate-x-1" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-200"></div>
          <div className="absolute bottom-1 left-8 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-400"></div>
        </Button>
      </div>
    </div>
  );
}

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/transport",
    icon: LayoutDashboard,
  },
  {
    title: "Deliveries",
    href: "/dashboard/transport/deliveries",
    icon: Package,
  },
  {
    title: "Fleet Tracking",
    href: "/dashboard/transport/tracking",
    icon: Navigation,
  },
  {
    title: "Routes",
    href: "/dashboard/transport/routes",
    icon: Route,
  },
  {
    title: "Maintenance",
    href: "/dashboard/transport/maintenance",
    icon: Wrench,
  },
  {
    title: "Analytics",
    href: "/dashboard/transport/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: Settings,
  },
  {
    title: "FAQ",
    href: "/dashboard/faq",
    icon: HelpCircle,
  },
];

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isListening, startListening } = useVoiceAssistant();

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
          title: "Signed Out Successfully",
          description: "Thank you for using Transport Portal",
          duration: 2000,
        });

        setTimeout(() => {
          router.push("/login/transport");
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
      <div className="hidden border-r border-orange-200 dark:border-orange-700 bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-orange-950/50 dark:to-amber-950/50 md:block">
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
                className="border-orange-200 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Sidebar onSignOut={handleSignOut} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Transport Dashboard</h1>
          </div>
        </div>
        
        <div className="border-b border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-orange-800 dark:text-orange-200">Transport Management Portal</h2>
            <Button 
              className={`font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600'
              } text-white`}
              onClick={startListening}
              disabled={isListening}
            >
              <Mic className="mr-2 h-5 w-5" />
              {isListening ? 'Listening...' : 'Voice Assistant'}
            </Button>
          </div>
        </div>
        
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}