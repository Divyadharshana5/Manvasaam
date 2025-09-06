"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Warehouse,
  BarChart3,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function HubDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hub Dashboard</h1>
          <p className="text-muted-foreground">
            Manage distribution operations and logistics
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/hub/inventory">
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
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
            <div className="text-2xl font-bold">23</div>
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
            <div className="text-2xl font-bold">45</div>
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹85,000</div>
            <p className="text-sm text-muted-foreground">This month</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/hub/analytics">
                View Details
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Inventory Value</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">₹1,25,000</div>
            <p className="text-sm text-muted-foreground">Current stock</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/hub/inventory">
                Manage
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-sm text-muted-foreground">Delivery success</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/hub/orders">
                View Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Avg Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.3h</div>
            <p className="text-sm text-muted-foreground">Delivery time</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/hub/deliveries">
                Track All
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from your hub operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Received 50kg tomatoes</p>
                    <p className="text-sm text-muted-foreground">From Farmer Raj</p>
                  </div>
                </div>
                <Badge variant="secondary">2h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Dispatched order #ORD-001</p>
                    <p className="text-sm text-muted-foreground">To Customer Priya</p>
                  </div>
                </div>
                <Badge variant="outline">3h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Low stock alert</p>
                    <p className="text-sm text-muted-foreground">Onions below threshold</p>
                  </div>
                </div>
                <Badge variant="destructive">5h ago</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/hub/activities">View All Activities</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your hub operations efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild className="justify-start">
                <Link href="/dashboard/hub/inventory">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/hub/orders">
                  <Clock className="mr-2 h-4 w-4" />
                  Process Orders
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/hub/deliveries">
                  <Truck className="mr-2 h-4 w-4" />
                  Track Deliveries
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/hub/analytics">
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
