"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Sidebar />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
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
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Organic Farm-to-Table Sourcing
              </span>
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