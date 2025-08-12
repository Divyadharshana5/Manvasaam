
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
  totalSales: "₹1,25,300.00",
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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{farmerStats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Total revenue from all sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Truck className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{farmerStats.pendingShipments}</div>
            <p className="text-xs text-muted-foreground">Orders awaiting shipment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Customers</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{farmerStats.customerCount}</div>
            <p className="text-xs text-muted-foreground">Total active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{farmerStats.totalProfit}</div>
            <p className="text-xs text-muted-foreground">Profit earned via the application</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the latest orders for your products.</CardDescription>
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
                                <TableCell className="font-medium">{order.id}</TableCell>
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
                <CardTitle>Out of Stock Products</CardTitle>
                <CardDescription>These products are currently unavailable to customers.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {farmerStats.outOfStock.map(product => (
                        <li key={product.name} className="flex items-center gap-3 text-sm font-medium">
                            <PackageX className="h-5 w-5 text-destructive" />
                            <span>{product.name}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/dashboard/products">Manage Product Inventory</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
  
  const renderCustomerDashboard = () => (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{customerStats.completedOrders}</div>
                    <p className="text-xs text-muted-foreground">Total successful orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{customerStats.pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">Orders being processed or shipped</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{customerStats.totalSpent}</div>
                    <p className="text-xs text-muted-foreground">Your total spending on the app</p>
                </CardContent>
            </Card>
       </div>
       
       <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A quick look at your recent buys.</CardDescription>
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
                            <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>
                            <TableCell className="text-right">{order.total}</TableCell>
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
            <CardTitle>New Product Updates</CardTitle>
            <CardDescription>
                Check out the latest fresh products available from our farmers!
            </CardDescription>
            </CardHeader>
            <CardContent>
            <ul className="space-y-3">
                {customerStats.newProducts.map((product) => (
                    <li key={product.name} className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">{product.name}</span>
                    </li>
                ))}
                </ul>
            </CardContent>
            <CardFooter>
            <Button asChild size="sm" className="w-full">
                <Link href="/dashboard/products"><ShoppingCart className="mr-2 h-4 w-4" />Browse All Products</Link>
            </Button>
            </CardFooter>
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

    