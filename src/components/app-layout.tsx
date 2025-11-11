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
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManvaasamLogo } from "./icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import VoiceAssistant from "@/components/voice-assistant";

interface UserProfile {
  userType?: string;
  username?: string;
}

const authPages = [
  "/",
  "/login/farmer",
  "/login/retail",
  "/login/transport",
  "/voice-assistant",
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const isAuthPage = authPages.includes(pathname);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(
    null
  );

  React.useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (!response.ok) {
            // In mock mode, create a mock user profile
            if (pathname.includes("/hub")) {
              setUserProfile({ userType: "hub", username: "Hub Manager" });
            } else {
              setUserProfile({ userType: "customer", username: "Customer" });
            }
            return;
          }
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error(error);
          // Fallback to mock profile
          if (pathname.includes("/hub")) {
            setUserProfile({ userType: "hub", username: "Hub Manager" });
          } else {
            setUserProfile({ userType: "customer", username: "Customer" });
          }
        }
      }
    }
    fetchUserProfile();
  }, [user, pathname]);

  const allMenuItems = [
    {
      href: "/dashboard",
      label: t.sidebar.dashboard,
      icon: LayoutDashboard,
      section: "Customer",
    },
    {
      href: "/dashboard/profile",
      label: t.sidebar.profile,
      icon: UserIcon,
      section: "Customer",
    },
    {
      href: "/dashboard/orders",
      label: t.sidebar.orders,
      icon: ShoppingCart,
      section: "Customer",
    },
    {
      href: "/dashboard/products",
      label: t.sidebar.products,
      icon: Package,
      section: "Customer",
    },
    {
      href: "/dashboard/track",
      label: t.sidebar.track,
      icon: Map,
      section: "Customer",
    },
    {
      href: "/dashboard/matchmaking",
      label: t.sidebar.matchmaking,
      icon: HeartHandshake,
      section: "Customer",
    },
    {
      href: "/dashboard/marketing",
      label: t.sidebar.marketing,
      icon: Megaphone,
      section: "Customer",
    },
    {
      href: "/dashboard/faq",
      label: t.sidebar.faq,
      icon: HelpCircle,
      section: "Customer",
    },
  ];

  const hubMenuItems = [
    {
      href: "/dashboard/hub",
      label: "Hub Dashboard",
      icon: LayoutDashboard,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/hub/inventory",
      label: "Inventory",
      icon: Package,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/hub/farmers",
      label: "Farmers",
      icon: UserIcon,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/hub/deliveries",
      label: "Deliveries",
      icon: Map,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/hub/orders",
      label: "Orders",
      icon: ShoppingCart,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/hub/analytics",
      label: "Analytics",
      icon: Megaphone,
      section: "Hub Operations",
    },
    {
      href: "/dashboard/profile",
      label: t.sidebar.profile,
      icon: UserIcon,
      section: "Account",
    },
    {
      href: "/dashboard/faq",
      label: t.sidebar.faq,
      icon: HelpCircle,
      section: "Support",
    },
  ];

  const menuItems =
    userProfile?.userType === "hub" ? hubMenuItems : allMenuItems;

  const handleSignOut = async () => {
    try {
      if (!auth) {
        toast({
          variant: "destructive",
          title: t.signOut.errorTitle,
          description: "Authentication not initialized.",
        });
        return;
      }
      await signOut(auth);
      toast({ title: t.signOut.title, description: t.signOut.description });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.signOut.errorTitle,
        description: error.message,
      });
    }
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    const currentItem = menuItems.find((item) =>
      pathname.startsWith(item.href)
    );
    return currentItem ? currentItem.label : t.sidebar.dashboard;
  };

  const getSidebarHeading = () => {
    switch (userProfile?.userType) {
      case "farmer":
        return "Farmer";
      case "hub":
        return "Hub";
      case "restaurant":
        return "Restaurant";
      default:
        return "Customer";
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="hidden pointer-events-none w-0">
        <SidebarHeader>
          <div
            className={cn(
              "flex items-center gap-2 p-2 pl-3 transition-all duration-200",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            )}
          >
            <ManvaasamLogo
              width={28}
              height={28}
              className="shrink-0 text-primary"
            />
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
          <SidebarGroup>
            <SidebarGroupLabel>{getSidebarHeading()}</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="overflow-x-hidden w-full ml-0">
        <header className="flex h-14 items-center gap-4 border-b bg-background/30 backdrop-blur-sm px-6 sticky top-0 z-40">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <VoiceAssistant />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        user && "photoURL" in user
                          ? user.photoURL || undefined
                          : undefined
                      }
                    />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.username || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t.sidebar.profile}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/faq" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>{t.sidebar.faq}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.signOut.button}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto flex justify-center">
          <div className="w-full max-w-[1600px] px-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Add default export for compatibility
export default AppLayout;
