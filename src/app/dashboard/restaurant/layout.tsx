"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  User,
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

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Restaurant Portal</h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-green-100 text-green-700"
                  )}
                >
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

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Sidebar />
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
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                🍽️ Organic Farm-to-Table Sourcing
              </span>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Notifications - Hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex relative hover:bg-rose-100 dark:hover:bg-rose-900"
            >
              <Bell className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900">
                  <Avatar className="h-8 w-8 border-2 border-rose-200 dark:border-rose-700">
                    <AvatarImage src="/avatars/restaurant-chef.png" alt="Restaurant" />
                    <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      👨‍🍳
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-rose-200 dark:border-rose-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-rose-800 dark:text-rose-200">
                      👨‍🍳 Restaurant Chef
                    </p>
                    <p className="text-xs leading-none text-rose-600 dark:text-rose-400">
                      🍽️ Farm-to-Table Manager
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-rose-200 dark:bg-rose-700" />
                <DropdownMenuItem asChild className="hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer">
                  <Link href="/dashboard/restaurant/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span>👤 Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer">
                  <Link href="/dashboard/restaurant/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span>⚙️ Restaurant Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-rose-200 dark:bg-rose-700" />
                <DropdownMenuItem 
                  className="hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>🚪 Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}