"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Building,
  Apple,
  Milk,
  Wheat,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Truck,
  Search,
  Plus,
  Minus,
  Mic,
  MessageCircle,
  Phone,
  QrCode,
  CreditCard,
  MapPin,
  Bell,
  Eye,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RetailDashboard() {
  const [shopName] = useState("Fresh Market Store");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const stats = {
    totalOrders: 89,
    pendingDeliveries: 12,
    totalSpent: 245000,
    activeProducts: 234
  };

  const orders = [
    {
      id: "ORD-001",
      supplier: "Green Valley Farm",
      items: "Fresh Vegetables",
      quantity: "50 kg",
      status: "delivered",
      amount: 2500,
      date: "2024-01-15"
    },
    {
      id: "ORD-002", 
      supplier: "Sunrise Dairy",
      items: "Organic Milk",
      quantity: "100 L",
      status: "pending",
      amount: 4500,
      date: "2024-01-14"
    },
    {
      id: "ORD-003",
      supplier: "Mountain Fruits",
      items: "Seasonal Fruits",
      quantity: "75 kg", 
      status: "processing",
      amount: 6750,
      date: "2024-01-13"
    }
  ];

  const suppliers = [
    { name: "Green Valley Farm", category: "Vegetables", rating: 4.8, orders: 23 },
    { name: "Sunrise Dairy", category: "Dairy", rating: 4.9, orders: 18 },
    { name: "Mountain Fruits", category: "Fruits", rating: 4.7, orders: 15 },
    { name: "Golden Grains", category: "Cereals", rating: 4.6, orders: 12 }
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retail Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {shopName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">+15 new this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20 flex-col" asChild>
          <Link href="/dashboard/retail/orders">
            <ShoppingCart className="h-6 w-6 mb-2" />
            <span>View Orders</span>
          </Link>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/retail/products">
            <Package className="h-6 w-6 mb-2" />
            <span>Manage Products</span>
          </Link>
        </Button>

        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/retail/suppliers">
            <Users className="h-6 w-6 mb-2" />
            <span>Suppliers</span>
          </Link>
        </Button>

        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/voice-assistant">
            <Mic className="h-6 w-6 mb-2" />
            <span>Voice Assistant</span>
          </Link>
        </Button>
      </div>

      {/* Recent Orders and Suppliers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.supplier}</p>
                    <p className="text-sm">{order.items} - {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <CardDescription>Your most reliable suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">{supplier.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">⭐ {supplier.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{supplier.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}