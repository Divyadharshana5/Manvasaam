
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
  SidebarGroup,
  SidebarGroupLabel,
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


const authPages = [
  "/",
  "/login/farmer-customer",
  "/login/hub",
  "/login/restaurant",
  "/voice-assistant",
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const isAuthPage = authPages.includes(pathname);
  
  const menuItems = [
    { href: "/dashboard", label: t.sidebar.dashboard, icon: LayoutDashboard, section: "General" },
    { href: "/dashboard/profile", label: t.sidebar.profile, icon: UserIcon, section: "General" },
    { href: "/dashboard/orders", label: t.sidebar.orders, icon: ShoppingCart, section: "Customer" },
    { href: "/dashboard/products", label: t.sidebar.products, icon: Package, section: "Customer" },
    { href: "/dashboard/track", label: t.sidebar.track, icon: Map, section: "Customer" },
    { href: "/dashboard/matchmaking", label: t.sidebar.matchmaking, icon: HeartHandshake, section: "Customer" },
    { href: "/dashboard/marketing", label: t.sidebar.marketing, icon: Megaphone, section: "Other" },
    { href: "/dashboard/faq", label: t.sidebar.faq, icon: HelpCircle, section: "Other" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: t.signOut.title, description: t.signOut.description });
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: t.signOut.errorTitle, description: error.message });
    }
  };


  if (isAuthPage) {
    return <>{children}</>;
  }
  
  const getPageTitle = () => {
    const currentItem = menuItems.find((item) => pathname.startsWith(item.href));
    return currentItem ? currentItem.label : t.sidebar.dashboard;
  }

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);


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
          {Object.entries(groupedMenuItems).map(([section, items]) => (
            <SidebarGroup key={section}>
              <SidebarGroupLabel>{section}</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
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
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
            <div className="p-2">
              <Button className="w-full" onClick={handleSignOut}>
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  {t.signOut.button}
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
