"use client";

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
} from "lucide-react";
import Link from "next/link";

export default function FarmerDashboard() {
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
        <Button asChild>
          <Link href="/dashboard/farmer/products">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
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
            <div className="text-2xl font-bold">12</div>
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
            <div className="text-2xl font-bold">₹18,450</div>
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
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-sm text-muted-foreground">Active crops</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
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
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-sm text-muted-foreground">Seasonal harvest</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
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
            <div className="text-2xl font-bold text-amber-600">1</div>
            <p className="text-sm text-muted-foreground">Ready to harvest</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
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
            <div className="text-2xl font-bold text-emerald-600">3</div>
            <p className="text-sm text-muted-foreground">Organic varieties</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
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