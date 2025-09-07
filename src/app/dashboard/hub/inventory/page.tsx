import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHubByManagerId, getHubInventory } from "@/lib/hub-db";
import AppLayout from "@/components/app-layout";
import InventoryManager from "@/components/inventory-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { HubInventory } from "@/types/hub";

export default async function HubInventoryPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  if (!isFirebaseInitialized || !adminAuth) {
    redirect("/");
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    redirect("/");
  }

  // Get hub data for this manager
  const hub = await getHubByManagerId(decodedToken.uid);
  
  if (!hub) {
    redirect("/dashboard");
  }

  const inventory = await getHubInventory(hub.id);

  // Calculate inventory stats
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const lowStockItems = inventory.filter(item => item.quantity < 10).length; // Threshold of 10
  const expiringSoon = inventory.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return expiryDate <= threeDaysFromNow;
  }).length;



  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage stock for {hub.branchName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button asChild>
              <Link href="/dashboard/hub/inventory/add">
                <Package className="mr-2 h-4 w-4" />
                Add Stock
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                Different products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                kg in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Inventory worth
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Items below threshold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiringSoon}</div>
              <p className="text-xs text-muted-foreground">
                Within 3 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <InventoryManager hubId={hub.id} initialInventory={inventory} />
      </div>
    </AppLayout>
  );
}
