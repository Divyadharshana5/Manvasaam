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
import { VoiceAssistantWidget } from "@/components/voice-assistant-widget";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Archive,
  BarChart3,
  Settings,
  Menu,
  ChefHat,
  HelpCircle,
  LogOut,
  Power,
  DoorOpen,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/restaurant",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/restaurant/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/dashboard/restaurant/products",
    icon: Package,
  },
  {
    title: "Farmers",
    href: "/dashboard/restaurant/farmers",
    icon: Users,
  },
  {
    title: "Matchmaking",
    href: "/dashboard/restaurant/matchmaking",
    icon: Users,
  },
  {
    title: "Payments",
    href: "/dashboard/restaurant/payments",
    icon: CreditCard,
  },
  {
    title: "Inventory",
    href: "/dashboard/restaurant/inventory",
    icon: Archive,
  },
  {
    title: "Reports",
    href: "/dashboard/restaurant/reports",
    icon: BarChart3,
  },
  {
    title: "FAQ",
    href: "/dashboard/restaurant/faq",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/dashboard/restaurant/settings",
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
              <ChefHat className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Restaurant Portal</h2>
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
        <div className="px-3 py-2 border-t">
          <Button onClick={onSignOut} variant="ghost" className="w-full justify-start group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 dark:hover:from-red-600 dark:hover:via-orange-600 dark:hover:to-yellow-600 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white border border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/0 to-yellow-500/0 group-hover:from-red-500/20 group-hover:via-orange-500/20 group-hover:to-yellow-500/20 transition-all duration-300"></div>
            <Power className="mr-2 h-4 w-4 group-hover:animate-pulse relative z-10" />
            <span className="relative z-10 font-medium">🚪 Sign Out</span>
            <DoorOpen className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("pb-4 bg-gradient-to-b from-green-50/30 via-lime-50/30 to-yellow-50/30 dark:from-green-950/30 dark:via-lime-950/30 dark:to-yellow-950/30 flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900 dark:to-lime-900 border border-green-200 dark:border-green-700">
            <ChefHat className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
              Restaurant Portal
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start fast-button hover:bg-green-100 dark:hover:bg-green-900",
                  pathname === item.href && "bg-gradient-to-r from-green-200 to-lime-200 dark:from-green-800 dark:to-lime-800 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600"
                )}
                onMouseEnter={() => preload(item.href)}
                onClick={() => navigate(item.href)}
              >
                <item.icon className={cn(
                  "mr-2 h-4 w-4",
                  pathname === item.href ? "text-green-700 dark:text-green-300" : "text-green-600 dark:text-green-400"
                )} />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Signout Button at Bottom */}
      <div className="px-3 py-3 border-t-2 border-gradient-to-r from-green-200 via-lime-200 to-yellow-200 dark:from-green-700 dark:via-lime-700 dark:to-yellow-700 bg-gradient-to-r from-green-50/50 via-lime-50/50 to-yellow-50/50 dark:from-green-950/50 dark:via-lime-950/50 dark:to-yellow-950/50">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start group relative overflow-hidden bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 dark:from-green-900 dark:via-lime-900 dark:to-yellow-900 hover:from-green-500 hover:via-lime-500 hover:to-yellow-500 dark:hover:from-green-600 dark:hover:via-lime-600 dark:hover:to-yellow-600 text-green-700 dark:text-green-300 hover:text-white dark:hover:text-white border-2 border-green-200 dark:border-green-700 hover:border-lime-400 dark:hover:border-lime-500 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-green-200 dark:hover:shadow-green-900/50 rounded-xl p-3"
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-lime-500/0 to-yellow-500/0 group-hover:from-green-500/30 group-hover:via-lime-500/30 group-hover:to-yellow-500/30 transition-all duration-500 rounded-xl"></div>
          
          {/* Pulsing effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-gradient-to-r from-green-400/20 via-lime-400/20 to-yellow-400/20 transition-all duration-300"></div>
          
          {/* Main content */}
          <Power className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10 transition-all duration-300" />
          <span className="relative z-10 font-bold text-base group-hover:text-lg transition-all duration-300">
            🚪 Sign Out
          </span>
          
          {/* Exit door animation */}
          <DoorOpen className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:translate-x-1" />
          
          {/* Sparkle effect */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-200"></div>
          <div className="absolute bottom-1 left-8 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700 delay-400"></div>
        </Button>
      </div>
    </div>
  );
}

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { navigate, preload } = useFastNavigation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      // Call logout API
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("userType");
        localStorage.removeItem("restaurantName");
        
        toast({
          title: "👨‍🍳 Signed Out Successfully",
          description: "🍽️ Thank you for using Farm-to-Table Restaurant Portal",
          duration: 2000,
        });

        // Redirect to restaurant login page
        setTimeout(() => {
          router.push("/login/restaurant");
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
        {/* Mobile menu button - only visible on mobile when sidebar is hidden */}
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
        
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      <VoiceAssistantWidget />
    </div>
  );
}