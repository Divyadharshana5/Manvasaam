"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Carrot,
  Package,
  Bot,
  User,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgriLinkLogo } from "./icons";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Crop Market", icon: Carrot },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/matchmaking", label: "AI Matchmaking", icon: Bot },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div
            className={cn(
              "flex items-center gap-2 p-2 pl-3 transition-all duration-200",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            )}
          >
            <AgriLinkLogo className="size-7 shrink-0 text-primary" />
            <span
              className={cn(
                "text-lg font-bold text-primary",
                "group-data-[collapsible=icon]:hidden"
              )}
            >
              AgriLink
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div
            className={cn(
              "flex items-center gap-2 p-2 transition-all duration-200",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            )}
          >
            <Avatar className="size-8">
              <AvatarImage
                src="https://placehold.co/100x100.png"
                alt="User"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">User Name</span>
              <span className="text-xs text-muted-foreground">
                user@agrilink.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-40">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {menuItems.find((item) => item.href === pathname)?.label || "AgriLink"}
            </h1>
          </div>
          <Button>Get Support</Button>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
