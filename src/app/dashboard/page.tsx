
"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Package, Users, Activity, ShoppingCart, Truck, PackageX, ListOrdered, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage, LanguageProvider } from "@/context/language-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  username?: string;
  userType?: string;
  branchName?: string;
}

// Mock data for farmer dashboard
const farmerStats = {
  totalSales: 152,
  pendingShipments: 12,
  customerCount: 48,
  totalProfit: "₹95,600.50",
  recentOrders: [
    { id: "ORD006", customer: "Priya Sharma", status: "Processing" },
    { id: "ORD007", customer: "Amit Singh", status: "Processing" },
    { id: "ORD008", customer: "Sunita Rao", status: "Shipped" },
  ],
  outOfStock: [
    { name: "Organic Spinach" },
    { name: "Tomatoes" },
  ]
};

// Mock data for customer dashboard
const customerStats = {
  pendingOrders: 2,
  completedOrders: 18,
  totalSpent: "₹12,850.75",
  newProducts: [
      { name: "Organic Strawberries" },
      { name: "Fresh Basil" },
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


function DashboardComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error(error);
        } finally {
          setProfileLoading(false);
        }
      } else if (!loading) {
        setProfileLoading(false);
      }
    }
    fetchUserProfile();
  }, [user, loading]);

  const displayName = userProfile?.username || userProfile?.branchName || user?.email;

  const isLoading = loading || profileLoading;

  const renderGeneralDashboard = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.dashboard.totalRevenue}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% {t.dashboard.fromLastMonth}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.dashboard.newCustomers}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            +180.1% {t.dashboard.fromLastMonth}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.dashboard.productsSold}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">
            +19% {t.dashboard.fromLastMonth}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.dashboard.yourProfile}
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold capitalize">{userProfile?.userType}</div>
          <Link href="/dashboard/profile">
            <Button variant="link" className="p-0 text-xs text-muted-foreground">{t.dashboard.viewProfile}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  const renderFarmerDashboard = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerStats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Number of items sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerStats.pendingShipments}</div>
            <p className="text-xs text-muted-foreground">Orders to be shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerStats.customerCount}</div>
            <p className="text-xs text-muted-foreground">Customers linked to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerStats.totalProfit}</div>
            <p className="text-xs text-muted-foreground">Profit earned via the app</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>The latest orders for your products.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {farmerStats.recentOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell><Badge variant={order.status === 'Shipped' ? 'secondary' : 'default'}>{order.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                 <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/dashboard/orders">View All Orders</Link>
                </Button>
            </CardFooter>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Out of Stock</CardTitle>
                <CardDescription>These products are currently unavailable.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {farmerStats.outOfStock.map(product => (
                        <li key={product.name} className="flex items-center gap-2 text-sm">
                            <PackageX className="h-4 w-4 text-destructive" />
                            <span>{product.name}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/dashboard/products">Manage Products</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case "Delivered":
            return "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30";
        case "Shipped":
            return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30";
        case "Processing":
            return "bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30";
        default:
            return "";
    }
  }

  const renderCustomerDashboard = () => (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Orders being processed or shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders successfully delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">Your lifetime spending with Manvaasam</p>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Here's a quick look at your most recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerStats.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button asChild size="sm" className="w-full">
            <Link href="/dashboard/orders">View All Orders</Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
                <CardTitle>Ready for Something New?</CardTitle>
                <CardDescription>Explore fresh produce from local farmers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard/products"><ShoppingCart className="mr-2"/>Browse Products</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Find answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="outline">
                    <Link href="/dashboard/faq">Visit FAQ</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderContent = () => {
      if (isLoading) {
          return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
             </div>
          );
      }
      
      switch (userProfile?.userType) {
          case 'farmer':
              return renderFarmerDashboard();
          case 'customer':
              return renderCustomerDashboard();
          case 'restaurant':
          case 'hub':
          default:
              return renderGeneralDashboard();
      }
  }


  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isLoading ? t.dashboard.loading : t.dashboard.title}
            </h2>
            {!isLoading && (
              <p className="text-muted-foreground">
                {t.dashboard.welcome}, {displayName}!
              </p>
            )}
          </div>
        </div>
        {renderContent()}
      </div>
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardComponent />
    </LanguageProvider>
  )
}
