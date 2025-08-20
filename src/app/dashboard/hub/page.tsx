import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHubByManagerId, getHubStats } from "@/lib/hub-db";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Building2,
  Warehouse
} from "lucide-react";
import Link from "next/link";

async function getRecentActivities(hubId: string) {
  // Mock data - replace with actual database queries
  return [
    {
      id: 1,
      type: "stock_in",
      message: "Received 50kg tomatoes from Farmer Raj",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "order_out",
      message: "Dispatched order #ORD-001 to Customer Priya",
      timestamp: "3 hours ago",
      status: "in_transit"
    },
    {
      id: 3,
      type: "stock_low",
      message: "Low stock alert: Onions below threshold",
      timestamp: "5 hours ago",
      status: "warning"
    },
    {
      id: 4,
      type: "farmer_connect",
      message: "New farmer Kumar connected to hub",
      timestamp: "1 day ago",
      status: "completed"
    }
  ];
}

export default async function HubDashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  const mockMode = !isFirebaseInitialized || !adminAuth;

  let decodedToken: any;
  let hub: any;

  if (mockMode) {
    console.log("⚠️ Hub Dashboard running in mock mode");
    // Mock user and hub data
    decodedToken = { uid: "mock-hub-manager-uid" };
    hub = {
      id: "mock-hub-id",
      branchId: "HUB-MOCK123",
      branchName: "Mock Central Hub",
      location: "Chennai",
      address: "123 Mock Street, Chennai",
      phone: "9876543210",
      email: "hub@mock.com",
      capacity: 5000,
      currentLoad: 1250,
      status: "active",
      operatingHours: { open: "09:00", close: "18:00" },
      managerId: "mock-hub-manager-uid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    try {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      redirect("/");
    }

    // Get hub data for this manager
    hub = await getHubByManagerId(decodedToken.uid);

    if (!hub) {
      redirect("/dashboard");
    }
  }

  let hubStats: any;
  let recentActivities: any;

  if (mockMode) {
    // Mock stats data
    hubStats = {
      totalInventory: 1250,
      pendingDeliveries: 23,
      activeOrders: 45,
      connectedFarmers: 12,
      monthlyRevenue: 85000,
      inventoryValue: 125000,
      deliverySuccess: 98.5,
      avgDeliveryTime: "2.3 hours"
    };

    // Mock recent activities data
    recentActivities = [
      {
        id: 1,
        type: "stock_in",
        message: "Received 50kg tomatoes from Farmer Raj",
        timestamp: "2 hours ago",
        status: "completed"
      },
      {
        id: 2,
        type: "order_out",
        message: "Dispatched order #ORD-001 to Customer Priya",
        timestamp: "3 hours ago",
        status: "in_transit"
      },
      {
        id: 3,
        type: "stock_low",
        message: "Low stock alert: Onions below threshold",
        timestamp: "5 hours ago",
        status: "warning"
      },
      {
        id: 4,
        type: "farmer_connect",
        message: "New farmer Kumar connected to hub",
        timestamp: "1 day ago",
        status: "completed"
      }
    ];
  } else {
    hubStats = await getHubStats(hub.id);
    recentActivities = await getRecentActivities(hub.id);
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Mock Mode Warning */}
        {mockMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Demo Mode Active
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You're viewing the Hub Management System in demo mode.
                    Firebase is not configured, so this is using mock data for demonstration purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hub Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back to {hub.branchName} ({hub.branchId})
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hub.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Hub Manager
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.totalInventory}</div>
              <p className="text-xs text-muted-foreground">
                Items in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.pendingDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting dispatch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                In processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.connectedFarmers}</div>
              <p className="text-xs text-muted-foreground">
                Active suppliers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{hubStats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{hubStats.inventoryValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current stock value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Success</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.deliverySuccess}%</div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubStats.avgDeliveryTime}</div>
              <p className="text-xs text-muted-foreground">
                Average time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your hub operations efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard/hub/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/hub/deliveries">
                  <Truck className="mr-2 h-4 w-4" />
                  Track Deliveries
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/hub/farmers">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Farmers
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/hub/orders">
                  <Clock className="mr-2 h-4 w-4" />
                  Process Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest updates from your hub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {activity.status === "warning" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {activity.status === "in_transit" && (
                        <Truck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
