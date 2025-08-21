"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Leaf,
  Apple,
  Milk,
  Wheat,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function RestaurantDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your organic farm-to-table sourcing operations
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/restaurant/orders">
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Organic items in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
            <div className="text-2xl font-bold text-green-600">42</div>
            <p className="text-sm text-muted-foreground">Organic varieties</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/restaurant/products?category=vegetables">
                View All
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
            <div className="text-2xl font-bold text-orange-600">28</div>
            <p className="text-sm text-muted-foreground">Fresh seasonal</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/restaurant/products?category=fruits">
                View All
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Milk className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Dairy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">15</div>
            <p className="text-sm text-muted-foreground">Farm fresh</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/restaurant/products?category=dairy">
                View All
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Millets</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">8</div>
            <p className="text-sm text-muted-foreground">Ancient grains</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/restaurant/products?category=millets">
                View All
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
              Latest orders from contract farmers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Organic Tomatoes - 50kg</p>
                    <p className="text-sm text-muted-foreground">Green Valley Farm</p>
                  </div>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Fresh Spinach - 25kg</p>
                    <p className="text-sm text-muted-foreground">Sunrise Organics</p>
                  </div>
                </div>
                <Badge variant="outline">In Transit</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium">Organic Milk - 100L</p>
                    <p className="text-sm text-muted-foreground">Happy Cow Dairy</p>
                  </div>
                </div>
                <Badge variant="destructive">Delayed</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/restaurant/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used restaurant operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild className="justify-start">
                <Link href="/dashboard/restaurant/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place New Order
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/restaurant/farmers">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Farmers
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/restaurant/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Check Inventory
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/restaurant/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}