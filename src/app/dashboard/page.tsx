import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  IndianRupee,
  Package,
  Users,
  Activity,
  ShoppingCart,
  Truck,
  PackageX,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { translations } from "@/context/language-context";
import { DashboardContent } from "@/components/dashboard-content";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

interface UserProfile {
  username?: string;
  userType?: string;
  branchName?: string;
  email?: string;
}

// Mock data for farmer dashboard
const farmerStats = {
  totalSales: "₹1,25,300.00",
  pendingShipments: 12,
  customerCount: 48,
  totalProfit: "₹95,600.50",
  recentOrders: [
    { id: "ORD006", customer: "Priya Sharma", status: "Processing" },
    { id: "ORD007", customer: "Amit Singh", status: "Processing" },
    { id: "ORD008", customer: "Sunita Rao", status: "Shipped" },
  ],
  outOfStock: [{ name: "Organic Spinach" }, { name: "Tomatoes" }],
};

// Mock data for customer dashboard
const customerStats = {
  pendingOrders: 2,
  completedOrders: 18,
  totalSpent: "₹12,850.75",
  newProducts: [
    { name: "Organic Strawberries" },
    { name: "Fresh Basil" },
    { name: "Artisanal Cheese" },
  ],
  lastWeekPurchases: [
    { id: "ORD001", date: "2024-07-20", total: "₹150.75" },
    { id: "ORD002", date: "2024-07-19", total: "₹85.50" },
  ],
  recentOrders: [
    { id: "ORD001", date: "2024-07-20", status: "Delivered", total: "₹150.75" },
    { id: "ORD005", date: "2024-07-21", status: "Processing", total: "₹99.99" },
    { id: "ORD002", date: "2024-07-19", status: "Shipped", total: "₹85.50" },
  ],
};

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!adminDb) {
      console.warn("Firebase Admin DB not initialized");
      return null;
    }
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  let decodedToken;
  try {
    if (!adminAuth) {
      console.warn("Firebase Admin Auth not initialized");
      // In mock mode, continue without token verification
      decodedToken = { uid: "mock-user" };
    } else {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    }
  } catch (error) {
    redirect("/");
  }

  // Check if we're in mock mode (when Firebase is not configured)
  const mockMode = !adminAuth;
  let userProfile: any;

  if (mockMode) {
    // In mock mode, check if this is a hub user based on the session cookie
    if (sessionCookie && sessionCookie.includes("mock-session")) {
      // For demo purposes, redirect to hub dashboard in mock mode
      redirect("/dashboard/hub");
    }
    userProfile = null; // Default to customer view in mock mode
  } else {
    userProfile = await getUserProfile(decodedToken.uid);

    // Redirect hub users to their specific dashboard
    if (userProfile?.userType === "hub") {
      redirect("/dashboard/hub");
    }

    // Redirect customer users to their specific dashboard
    if (userProfile?.userType === "customer") {
      redirect("/dashboard/customer");
    }
  }

  const displayName =
    userProfile?.username || userProfile?.branchName || userProfile?.email;

  return (
    <AppLayout>
      <DashboardContent userProfile={userProfile} displayName={displayName} />
    </AppLayout>
  );
}
