"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import "@/styles/farmer-animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  TrendingUp,
  Leaf,
  Apple,
  Wheat,
  Sprout,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  Plus,
  Loader2,
  Bell,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  status: string;
  hubId: string;
  createdAt: string;
}

function AddProductButton({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  // try to pick a hubId from existing products (most recent with a hub)
  const defaultHubId = products?.find((p) => p.hubId)?.hubId || null;

  const href = `/dashboard/farmer/products?action=add${
    defaultHubId ? `&hubId=${encodeURIComponent(defaultHubId)}` : ""
  }`;

  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(href)}
      className={cn(buttonVariants(), className)}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Product
    </Button>
  );
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  const [stats, setStats] = useState({
    activeProducts: 0,
    totalOrders: 24,
    connectedBuyers: 12,
    monthlyRevenue: 18450,
    vegetables: 0,
    fruits: 0,
    grains: 0,
    herbs: 0,
  });

  useEffect(() => {
    if (user) {
      fetchFarmerProducts();
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PRODUCT_ADDED") {
        fetchFarmerProducts();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const fetchFarmerProducts = async () => {
    try {
      const response = await fetch("/api/farmer/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);

        const categoryCounts =
          data.products?.reduce((acc: any, product: Product) => {
            const category = product.category.toLowerCase();
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {}) || {};

        setStats((prev) => ({
          ...prev,
          activeProducts: data.products?.length || 0,
          vegetables: categoryCounts.vegetables || 0,
          fruits: categoryCounts.fruits || 0,
          grains: categoryCounts.grains || 0,
          herbs: categoryCounts.herbs || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 page-transition">
      {/* Status and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 badge-hover">
            <CheckCircle className="h-3 w-3 mr-1 checkmark-animate" />
            Farm Active
          </Badge>
          <Badge variant="secondary" className="badge-hover">
            <Clock className="h-3 w-3 mr-1" />
            Last update: 1 min ago
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-64 search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 elastic-bounce"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Link
            href="/dashboard/farmer/notifications"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "relative bell-ring"
            )}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium notification-badge">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchFarmerProducts}
            title="Refresh dashboard data"
            className="spin-on-hover"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between animate-fade-in-up stagger-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your crops and connect with buyers
          </p>
        </div>
        <div className="flex gap-2">
          <AddProductButton products={products} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up stagger-2">
        <Card className="stat-card card-glow card-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground icon-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">
              {stats.activeProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts > 0
                ? "In your inventory"
                : "No products yet"}
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card card-glow card-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground icon-float" style={{ animationDelay: '0.2s' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
        <Card className="stat-card card-glow card-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Buyers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground icon-float" style={{ animationDelay: '0.4s' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">{stats.connectedBuyers}</div>
            <p className="text-xs text-muted-foreground">
              Active relationships
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card card-glow card-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground icon-float" style={{ animationDelay: '0.6s' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold count-up">
              ₹{stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up stagger-3">
        <Card className="border-green-200 dashboard-card card-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600 icon-bounce" />
              <CardTitle className="text-lg">Vegetables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.vegetables}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.vegetables > 0 ? "Active crops" : "No vegetables yet"}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory("vegetables")
                .slice(0, 2)
                .map((product) => (
                  <div
                    key={product.id}
                    className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded"
                  >
                    {product.productName} - {product.quantity}
                    {product.unit}
                  </div>
                ))}
              {getProductsByCategory("vegetables").length > 2 && (
                <div className="text-xs text-gray-500">
                  +{getProductsByCategory("vegetables").length - 2} more
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() =>
                router.push("/dashboard/farmer/products?category=vegetables")
              }
            >
              Manage
            </Button>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dashboard-card card-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-orange-600 icon-bounce" />
              <CardTitle className="text-lg">Fruits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.fruits}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.fruits > 0 ? "Seasonal harvest" : "No fruits yet"}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory("fruits")
                .slice(0, 2)
                .map((product) => (
                  <div
                    key={product.id}
                    className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded"
                  >
                    {product.productName} - {product.quantity}
                    {product.unit}
                  </div>
                ))}
              {getProductsByCategory("fruits").length > 2 && (
                <div className="text-xs text-gray-500">
                  +{getProductsByCategory("fruits").length - 2} more
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() =>
                router.push("/dashboard/farmer/products?category=fruits")
              }
            >
              Manage
            </Button>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dashboard-card card-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-amber-600 icon-bounce" />
              <CardTitle className="text-lg">Grains</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.grains}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.grains > 0 ? "Ready to harvest" : "No grains yet"}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory("grains")
                .slice(0, 2)
                .map((product) => (
                  <div
                    key={product.id}
                    className="text-xs text-gray-600 bg-amber-50 px-2 py-1 rounded"
                  >
                    {product.productName} - {product.quantity}
                    {product.unit}
                  </div>
                ))}
              {getProductsByCategory("grains").length > 2 && (
                <div className="text-xs text-gray-500">
                  +{getProductsByCategory("grains").length - 2} more
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() =>
                router.push("/dashboard/farmer/products?category=grains")
              }
            >
              Manage
            </Button>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dashboard-card card-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-600 icon-bounce" />
              <CardTitle className="text-lg">Herbs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.herbs}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.herbs > 0 ? "Organic varieties" : "No herbs yet"}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory("herbs")
                .slice(0, 2)
                .map((product) => (
                  <div
                    key={product.id}
                    className="text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded"
                  >
                    {product.productName} - {product.quantity}
                    {product.unit}
                  </div>
                ))}
              {getProductsByCategory("herbs").length > 2 && (
                <div className="text-xs text-gray-500">
                  +{getProductsByCategory("herbs").length - 2} more
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() =>
                router.push("/dashboard/farmer/products?category=herbs")
              }
            >
              Manage
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up stagger-4">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Organic Tomatoes - 25kg</p>
                    <p className="text-sm text-muted-foreground">
                      Green Valley Restaurant
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Fresh Spinach - 15kg</p>
                    <p className="text-sm text-muted-foreground">City Hub</p>
                  </div>
                </div>
                <Badge variant="outline">Processing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Organic Carrots - 20kg</p>
                    <p className="text-sm text-muted-foreground">
                      Fresh Market
                    </p>
                  </div>
                </div>
                <Badge>New Order</Badge>
              </div>
            </div>
            <Link
              href="/dashboard/orders"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full mt-4"
              )}
            >
              View All Orders
            </Link>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used farmer operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <AddProductButton products={products} className="justify-start" />
              <Link
                href="/dashboard/orders"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-start"
                )}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Link>
              <Link
                href="/dashboard/farmer/matchmaking"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-start"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Find Buyers
              </Link>
              <Link
                href="/dashboard/farmer/analytics"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-start"
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
