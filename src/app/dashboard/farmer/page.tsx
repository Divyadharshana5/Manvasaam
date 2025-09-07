"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import Link from "next/link";

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

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Listen for product updates from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PRODUCT_ADDED') {
        fetchFarmerProducts(); // Refresh products when a new one is added
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchFarmerProducts = async () => {
    try {
      const response = await fetch('/api/farmer/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        
        // Calculate category counts
        const categoryCounts = data.products?.reduce((acc: any, product: Product) => {
          const category = product.category.toLowerCase();
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {}) || {};
        
        setStats(prev => ({
          ...prev,
          activeProducts: data.products?.length || 0,
          vegetables: categoryCounts.vegetables || 0,
          fruits: categoryCounts.fruits || 0,
          grains: categoryCounts.grains || 0,
          herbs: categoryCounts.herbs || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your crops and connect with buyers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFarmerProducts} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button asChild>
            <Link href="/dashboard/farmer/products">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts > 0 ? 'In your inventory' : 'No products yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectedBuyers}</div>
            <p className="text-xs text-muted-foreground">
              Active relationships
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Vegetables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.vegetables}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.vegetables > 0 ? 'Active crops' : 'No vegetables yet'}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory('vegetables').slice(0, 2).map((product) => (
                <div key={product.id} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
                  {product.productName} - {product.quantity}{product.unit}
                </div>
              ))}
              {getProductsByCategory('vegetables').length > 2 && (
                <div className="text-xs text-gray-500">+{getProductsByCategory('vegetables').length - 2} more</div>
              )}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
              <Link href="/dashboard/farmer/products?category=vegetables">
                Manage
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Fruits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.fruits}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.fruits > 0 ? 'Seasonal harvest' : 'No fruits yet'}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory('fruits').slice(0, 2).map((product) => (
                <div key={product.id} className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded">
                  {product.productName} - {product.quantity}{product.unit}
                </div>
              ))}
              {getProductsByCategory('fruits').length > 2 && (
                <div className="text-xs text-gray-500">+{getProductsByCategory('fruits').length - 2} more</div>
              )}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
              <Link href="/dashboard/farmer/products?category=fruits">
                Manage
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Grains</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.grains}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.grains > 0 ? 'Ready to harvest' : 'No grains yet'}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory('grains').slice(0, 2).map((product) => (
                <div key={product.id} className="text-xs text-gray-600 bg-amber-50 px-2 py-1 rounded">
                  {product.productName} - {product.quantity}{product.unit}
                </div>
              ))}
              {getProductsByCategory('grains').length > 2 && (
                <div className="text-xs text-gray-500">+{getProductsByCategory('grains').length - 2} more</div>
              )}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
              <Link href="/dashboard/farmer/products?category=grains">
                Manage
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Herbs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.herbs}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.herbs > 0 ? 'Organic varieties' : 'No herbs yet'}
            </p>
            <div className="mt-2 space-y-1">
              {getProductsByCategory('herbs').slice(0, 2).map((product) => (
                <div key={product.id} className="text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded">
                  {product.productName} - {product.quantity}{product.unit}
                </div>
              ))}
              {getProductsByCategory('herbs').length > 2 && (
                <div className="text-xs text-gray-500">+{getProductsByCategory('herbs').length - 2} more</div>
              )}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
              <Link href="/dashboard/farmer/products?category=herbs">
                Manage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Organic Tomatoes - 25kg</p>
                    <p className="text-sm text-muted-foreground">Green Valley Restaurant</p>
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
                    <p className="text-sm text-muted-foreground">Fresh Market</p>
                  </div>
                </div>
                <Badge>New Order</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used farmer operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild className="justify-start">
                <Link href="/dashboard/farmer/products">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/farmer/matchmaking">
                  <Users className="mr-2 h-4 w-4" />
                  Find Buyers
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/farmer/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}