"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Mic,
  QrCode,
  CreditCard,
  Bell,
  User,
  Settings,
  Eye,
  CancelledPlanIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CustomerDashboard() {
  const [customerName] = useState("Priya Sharma");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = {
    activeOrders: 2,
    deliveredOrders: 28,
    pendingPayments: 1,
    totalSpent: 8450
  };

  const recentOrders = [
    { id: "ORD001", farmer: "Green Valley Farm", products: "Organic Tomatoes - 2kg", address: "123 Main St", status: "Delivered", amount: 150 },
    { id: "ORD002", farmer: "Happy Cow Dairy", products: "Fresh Milk - 1L", address: "123 Main St", status: "In Transit", amount: 45 },
    { id: "ORD003", farmer: "Sunrise Organics", products: "Mixed Vegetables - 3kg", address: "123 Main St", status: "Processing", amount: 280 }
  ];

  const products = [
    { id: 1, name: "Organic Spinach", price: 45, quantity: 20, farmer: "Green Valley Farm" },
    { id: 2, name: "Fresh Carrots", price: 60, quantity: 15, farmer: "Sunrise Organics" },
    { id: 3, name: "Organic Apples", price: 120, quantity: 25, farmer: "Mountain Fresh" },
    { id: 4, name: "Fresh Milk", price: 55, quantity: 10, farmer: "Happy Cow Dairy" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {customerName}! 🌾</h1>
          <p className="text-muted-foreground">
            Discover fresh products from local farmers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/dashboard/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Search & Browse */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Products</CardTitle>
          <CardDescription>Search and order fresh products directly from farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vegetables, fruits, dairy, grains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-3">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.farmer}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">₹{product.price}/kg</span>
                  <span className="text-sm text-green-600">{product.quantity} available</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="flex-1">Add to Cart</Button>
                  <Button size="sm" variant="outline">Order Now</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Orders & Payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>Track your current and past orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
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
                  <p className="text-sm mb-2">{order.products}</p>
                  <p className="text-xs text-muted-foreground mb-2">{order.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{order.amount}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Communication</CardTitle>
            <CardDescription>Easy payment options and farmer communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Quick Payment</h4>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  UPI Pay
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Communication</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Voice Assistant</h4>
              <Button size="sm" className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Ask Voice Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Order Tracking & Notifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Order Tracking</CardTitle>
            <CardDescription>Real-time delivery status and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Order #ORD002</span>
                  <Badge variant="secondary">In Transit</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Fresh Milk - 1L from Happy Cow Dairy</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>5 km away • Estimated arrival: 2:30 PM</span>
                </div>
                <Button size="sm" className="w-full mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Delivery Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Order Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Picked from Farm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">On the Way</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-muted-foreground">Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages & Notifications</CardTitle>
            <CardDescription>Stay updated with alerts and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 border rounded">
                <Bell className="h-4 w-4 text-blue-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Confirmed</p>
                  <p className="text-xs text-muted-foreground">Your order #ORD003 has been confirmed</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 border rounded">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment Successful</p>
                  <p className="text-xs text-muted-foreground">₹150 paid for Order #ORD001</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 border rounded">
                <Star className="h-4 w-4 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Products Available</p>
                  <p className="text-xs text-muted-foreground">Fresh strawberries now available from Mountain Fresh</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile & Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/profile">
                <User className="h-6 w-6 mb-2" />
                <span>Edit Profile</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/customer/settings">
                <CreditCard className="h-6 w-6 mb-2" />
                <span>Payment Methods</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/customer/settings">
                <Settings className="h-6 w-6 mb-2" />
                <span>Language & Voice</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/voice-assistant">
                <Mic className="h-6 w-6 mb-2" />
                <span>Voice Assistant</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
