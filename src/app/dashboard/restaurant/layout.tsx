"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
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
  Leaf,
  HelpCircle,
  LogOut,
  Bell,
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
          <Button onClick={onSignOut} variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("pb-4 bg-gradient-to-b from-rose-50/30 via-pink-50/30 to-red-50/30 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 border border-rose-200 dark:border-rose-700">
            <ChefHat className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <h2 className="text-lg font-semibold text-rose-800 dark:text-rose-200">
              Restaurant Portal
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover:bg-rose-100 dark:hover:bg-rose-900",
                    pathname === item.href && "bg-gradient-to-r from-rose-200 to-pink-200 dark:from-rose-800 dark:to-pink-800 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-600"
                  )}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4",
                    pathname === item.href ? "text-rose-700 dark:text-rose-300" : "text-rose-600 dark:text-rose-400"
                  )} />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Signout Button at Bottom */}
      <div className="px-3 py-2 border-t border-rose-200 dark:border-rose-700">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
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
      <div className="hidden border-r border-rose-200 dark:border-rose-700 bg-gradient-to-b from-rose-50/50 to-pink-50/50 dark:from-rose-950/50 dark:to-pink-950/50 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <Sidebar onSignOut={handleSignOut} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gradient-to-r from-rose-50/50 via-pink-50/50 to-red-50/50 dark:from-rose-950/50 dark:via-pink-950/50 dark:to-red-950/50 px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden border-rose-200 hover:bg-rose-100 dark:border-rose-700 dark:hover:bg-rose-900"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Sidebar onSignOut={handleSignOut} />
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            <div className="flex items-center gap-2">
              <Leaf className={cn("h-5 w-5", mounted ? "text-rose-600 dark:text-rose-400" : "")} />
              <span className={cn("text-sm font-medium", mounted ? "text-rose-700 dark:text-rose-300" : "")}>
                {mounted ? "🍽️ " : ""}Organic Farm-to-Table Sourcing
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative", mounted ? "hover:bg-rose-100 dark:hover:bg-rose-900" : "")}
            >
              <Bell className={cn("h-4 w-4", mounted ? "text-rose-600 dark:text-rose-400" : "")} />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <Avatar className={cn("h-8 w-8 border-2", mounted ? "border-rose-200 dark:border-rose-700" : "border-gray-200")}>
                <AvatarImage src="/avatars/restaurant-chef.png" alt="Restaurant" />
                <AvatarFallback className={cn("text-xs font-bold", mounted ? "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 text-rose-700 dark:text-rose-300" : "")}>
                  {mounted ? "👨‍🍳" : "RC"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className={cn("text-sm font-medium", mounted ? "text-rose-800 dark:text-rose-200" : "")}>
                  {mounted ? "👨‍🍳 " : ""}Restaurant Chef
                </p>
                <p className={cn("text-xs", mounted ? "text-rose-600 dark:text-rose-400" : "text-gray-600")}>
                  {mounted ? "🍽️ " : ""}Farm-to-Table Manager
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}