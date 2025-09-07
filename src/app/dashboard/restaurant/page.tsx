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
  Leaf,
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

export default function RestaurantDashboard() {
  const [restaurantName] = useState("Spice Garden Restaurant");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const stats = {
    totalOrders: 45,
    pendingDeliveries: 8,
    totalSpent: 125000,
    activeListings: 156
  };

  const orders = [
    { id: "ORD001", farmer: "Green Valley Farm", items: "Organic Tomatoes - 50kg", status: "Delivered", amount: 4500, date: "2024-01-15" },
    { id: "ORD002", farmer: "Sunrise Organics", items: "Fresh Spinach - 25kg", status: "In Transit", amount: 1250, date: "2024-01-15" },
    { id: "ORD003", farmer: "Happy Cow Dairy", items: "Organic Milk - 100L", status: "Pending", amount: 3500, date: "2024-01-14" }
  ];

  const products = [
    { id: 1, name: "Organic Tomatoes", price: 90, quantity: 500, unit: "kg", farmer: "Green Valley Farm", category: "vegetables" },
    { id: 2, name: "Fresh Spinach", price: 50, quantity: 200, unit: "kg", farmer: "Sunrise Organics", category: "vegetables" },
    { id: 3, name: "Organic Apples", price: 150, quantity: 300, unit: "kg", farmer: "Mountain Fresh", category: "fruits" },
    { id: 4, name: "Fresh Milk", price: 35, quantity: 500, unit: "L", farmer: "Happy Cow Dairy", category: "dairy" }
  ];

  const notifications = [
    { id: 1, type: "order", message: "Order #ORD003 confirmed by Happy Cow Dairy", time: "10 min ago" },
    { id: 2, type: "payment", message: "Payment of ₹4,500 processed successfully", time: "1 hour ago" },
    { id: 3, type: "delivery", message: "Spinach delivery arriving in 30 minutes", time: "2 hours ago" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {restaurantName}! 🍽️</h1>
          <p className="text-muted-foreground">
            Manage your organic farm-to-table sourcing operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/dashboard/restaurant/orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wholesale Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total spending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Product Listings</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-muted-foreground">
              From farmers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wholesale Ordering */}
      <Card>
        <CardHeader>
          <CardTitle>Wholesale Ordering</CardTitle>
          <CardDescription>Browse and order products from farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vegetables, fruits, dairy, millets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-1">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{product.farmer}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">₹{product.price}/{product.unit}</span>
                  <span className="text-sm text-green-600">{product.quantity} available</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Button size="sm" variant="outline">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 border rounded">1</span>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm ml-2">{product.unit}</span>
                </div>
                <Button size="sm" className="w-full">
                  Add to Order
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Management & Payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders Management</CardTitle>
            <CardDescription>Track all your wholesale orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.farmer}</p>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'In Transit' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{order.items}</p>
                  <p className="text-xs text-muted-foreground mb-2">{order.date}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{order.amount.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/restaurant/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Communication</CardTitle>
            <CardDescription>Payment options and farmer communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Payment Integration</h4>
              <div className="flex gap-2 mb-2">
                <Button size="sm" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  UPI Pay
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Direct payments to farmers</p>
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Communication Tools</h4>
              <div className="flex gap-2 mb-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
              <Button size="sm" className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Voice Assistant
              </Button>
            </div>

            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Live Tracking</h4>
              <p className="text-sm text-muted-foreground mb-2">Real-time order tracking</p>
              <Button size="sm" variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Track Deliveries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages & Notifications + Profile Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages & Notifications</CardTitle>
            <CardDescription>Stay updated with alerts and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-2 border rounded">
                  <Bell className={`h-4 w-4 mt-1 ${
                    notification.type === 'order' ? 'text-blue-500' :
                    notification.type === 'payment' ? 'text-green-500' : 'text-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {notification.type === 'order' ? 'Order Update' :
                       notification.type === 'payment' ? 'Payment Confirmation' : 'Delivery Alert'}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View All Notifications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile & Settings</CardTitle>
            <CardDescription>Manage restaurant profile and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Restaurant Profile
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/restaurant/payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Details
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/restaurant/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Language & Voice
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/voice-assistant">
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Assistant
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}