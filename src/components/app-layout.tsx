
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
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Mic,
  Package,
  ShoppingCart,
  User as UserIcon,
  HelpCircle,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ManvaasamLogo } from "./icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";


const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/track", label: "Track Order", icon: Map },
  { href: "/dashboard/matchmaking", label: "Matchmaking", icon: HeartHandshake },
  { href: "/dashboard/voice-assistant", label: "Voice Assistant", icon: Mic },
  { href: "/dashboard/marketing", label: "Marketing", icon: Megaphone },
  { href: "/dashboard/faq", label: "FAQ", icon: HelpCircle },
  // Add other dashboard items here
];

const authPages = [
  "/",
  "/login/farmer-customer",
  "/login/hub",
  "/login/restaurant"
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const isAuthPage = authPages.includes(pathname);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign Out Failed", description: error.message });
    }
  };


  if (isAuthPage) {
    return <>{children}</>;
  }
  
  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard/track')) {
      return "Track Order";
    }
    return menuItems.find((item) => pathname.startsWith(item.href))?.label || "Dashboard"
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
                    isActive={pathname.startsWith(item.href)}
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
            <div className="p-2">
              <Button className="w-full" onClick={handleSignOut}>
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign Out
                </span>
              </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/30 backdrop-blur-sm px-6 sticky top-0 z-40">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{user?.email}</span>
            <Avatar>
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
