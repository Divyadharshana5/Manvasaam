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
  LogOut,
  LogIn,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ManvaasamLogo } from "./icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/voice-assistant", label: "Voice Assistant", icon: Volume2 },
  // Add other dashboard items here
];

const authPages = [
  "/",
  "/login/farmer-customer",
  "/login/hub"
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

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
            <ManvaasamLogo width={28} height={28} className="shrink-0 text-primary" />
            <span
              className={cn(
                "text-lg font-bold text-primary",
                "group-data-[collapsible=icon]:hidden"
              )}
            >
              Manvaasam
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
          {user ? (
            <div
              className={cn(
                "flex items-center gap-2 p-2 transition-all duration-200",
                "group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-stretch"
              )}
            >
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user.photoURL ?? "https://placehold.co/100x100.png"}
                    alt={user.displayName ?? "User"}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>
                    {user.email?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">
                    {user.displayName ?? "User Name"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={signOut}
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign Out
                </span>
              </Button>
            </div>
          ) : (
            <div className="p-2">
              <Link href="/" passHref>
                <Button className="w-full">
                  <LogIn />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Sign In
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/30 backdrop-blur-sm px-6 sticky top-0 z-40">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {menuItems.find((item) => item.href === pathname)?.label ||
                "Dashboard"}
            </h1>
          </div>
          <Button>Get Support</Button>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
