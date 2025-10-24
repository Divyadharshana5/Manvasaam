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
  Building,
  HelpCircle,
  Power,
  DoorOpen,
  ShoppingCart,
  Mic,
  TrendingUp,
  Warehouse,
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
              <h2 className="text-lg font-semibold">Retail Portal</h2>
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
    <div className={cn("pb-4 bg-gradient-to-b from-emerald-50/30 via-green-50/30 to-lime-50/30 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-lime-950/30 flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 border border-emerald-200 dark:border-emerald-700">
            <Building className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
              Retail Portal
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start hover:bg-emerald-100 dark:hover:bg-emerald-900",
                    pathname === item.href && "bg-gradient-to-r from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600"
                  )}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4",
                    pathname === item.href ? "text-emerald-700 dark:text-emerald-300" : "text-emerald-600 dark:text-emerald-400"
                  )} />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-3 border-t-2 border-gradient-to-r from-emerald-200 via-green-200 to-lime-200 dark:from-emerald-700 dark:via-green-700 dark:to-lime-700 bg-gradient-to-r from-emerald-50/50 via-green-50/50 to-lime-50/50 dark:from-emerald-950/50 dark:via-green-950/50 dark:to-lime-950/50">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start group relative overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white border-2 border-blue-200 dark:border-blue-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/50 rounded-xl p-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/30 group-hover:via-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-500 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 transition-all duration-300"></div>
          <Power className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10 transition-all duration-300" />
          <span className="relative z-10 font-bold text-sm group-hover:text-base transition-all duration-300">
            🚪 Sign Out
          </span>
          <DoorOpen className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:translate-x-1" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-200"></div>
          <div className="absolute bottom-1 left-8 w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-400"></div>
        </Button>
      </div>
    </div>
  );
}

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/retail",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/dashboard/retail/inventory",
    icon: Warehouse,
  },
  {
    title: "Orders",
    href: "/dashboard/retail/orders",
    icon: ShoppingCart,
  },
  {
    title: "Suppliers",
    href: "/dashboard/retail/suppliers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/retail/analytics",
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

export default function RetailLayout({ children }: { children: React.ReactNode }) {
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
          description: "Thank you for using Retail Portal",
          duration: 2000,
        });

        setTimeout(() => {
          router.push("/login/retail");
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
      <div className="hidden border-r border-blue-200 dark:border-blue-700 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 md:block">
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
                className="border-blue-200 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Sidebar onSignOut={handleSignOut} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Retail Dashboard</h1>
          </div>
        </div>
        
        <div className="border-b border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Retail Management Portal</h2>
            <Button 
              className={`font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
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