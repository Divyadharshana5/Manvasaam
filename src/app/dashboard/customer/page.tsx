"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  Heart,
  Star,
  Clock,
  AlertCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
          <p className="text-muted-foreground">
            Discover fresh products from local farmers
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Browse Products
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,450</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              In wishlist
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <CardTitle className="text-lg">Vegetables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45</div>
            <p className="text-sm text-muted-foreground">Fresh varieties</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/products?category=vegetables">
                Shop Now
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <CardTitle className="text-lg">Fruits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">32</div>
            <p className="text-sm text-muted-foreground">Seasonal picks</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/products?category=fruits">
                Shop Now
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <CardTitle className="text-lg">Dairy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">18</div>
            <p className="text-sm text-muted-foreground">Farm fresh</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/products?category=dairy">
                Shop Now
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <CardTitle className="text-lg">Grains</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">15</div>
            <p className="text-sm text-muted-foreground">Organic options</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/products?category=grains">
                Shop Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Track your latest purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Organic Tomatoes - 2kg</p>
                    <p className="text-sm text-muted-foreground">Green Valley Farm</p>
                  </div>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Fresh Milk - 1L</p>
                    <p className="text-sm text-muted-foreground">Happy Cow Dairy</p>
                  </div>
                </div>
                <Badge variant="outline">In Transit</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Mixed Vegetables - 3kg</p>
                    <p className="text-sm text-muted-foreground">Sunrise Organics</p>
                  </div>
                </div>
                <Badge>Processing</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Based on your purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-medium">Organic Spinach</p>
                    <p className="text-sm text-muted-foreground">₹45/bunch</p>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Fresh Carrots</p>
                    <p className="text-sm text-muted-foreground">₹60/kg</p>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium">Organic Apples</p>
                    <p className="text-sm text-muted-foreground">₹120/kg</p>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/dashboard/products">Browse All Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
