"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Package,
  Users,
  TrendingUp,
  Leaf,
  Apple,
  Wheat,
  Milk,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Mic,
  MessageCircle,
  Phone,
  MapPin,
  Bell,
  Download,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";

export default function FarmerDashboard() {
  const [farmerName, setFarmerName] = useState("Rajesh Kumar");
  const [upiId] = useState("farmer@paytm");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const name = storedEmail.split("@")[0];
      setFarmerName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, []);

  const products = [
    { id: 1, name: "Organic Tomatoes", price: "₹80/kg", quantity: "150 kg", category: "Vegetables" },
    { id: 2, name: "Fresh Spinach", price: "₹45/bunch", quantity: "50 bunches", category: "Vegetables" },
    { id: 3, name: "Organic Apples", price: "₹120/kg", quantity: "80 kg", category: "Fruits" },
    { id: 4, name: "Fresh Milk", price: "₹60/L", quantity: "100 L", category: "Dairy" },
  ];

  const orders = {
    customer: [
      { id: 1, buyer: "Priya Sharma", product: "Tomatoes 5kg", address: "Mumbai", status: "Pending" },
      { id: 2, buyer: "Amit Patel", product: "Spinach 2kg", address: "Pune", status: "Accepted" },
    ],
    hub: [
      { id: 3, buyer: "Central Hub Mumbai", product: "Mixed Vegetables 50kg", address: "Mumbai Hub", status: "In Transit" },
      { id: 4, buyer: "North Hub Delhi", product: "Fruits 30kg", address: "Delhi Hub", status: "Completed" },
    ],
    restaurant: [
      { id: 5, buyer: "Green Valley Restaurant", product: "Organic Vegetables 25kg", address: "Bangalore", status: "Accepted" },
      { id: 6, buyer: "Farm Fresh Cafe", product: "Dairy Products 20L", address: "Chennai", status: "Pending" },
    ]
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {farmerName}! 🌾</h1>
          <p className="text-muted-foreground mt-1">
            Manage your farm operations and connect with buyers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Received</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹18,450</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your farm products and inventory</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                <Leaf className="mr-1 h-4 w-4" />
                Vegetables
              </Button>
              <Button size="sm" variant="outline">
                <Apple className="mr-2 h-4 w-4" />
                Fruits
              </Button>
              <Button size="sm" variant="outline">
                <Wheat className="mr-2 h-4 w-4" />
                Millets
              </Button>
              <Button size="sm" variant="outline">
                <Milk className="mr-2 h-4 w-4" />
                Dairy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead>Quantity Available</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders/Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Orders & Requests</CardTitle>
          <CardDescription>Manage orders from customers, hubs, and restaurants</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customer">Customer Orders</TabsTrigger>
              <TabsTrigger value="hub">Hub Orders</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant Orders</TabsTrigger>
            </TabsList>
            {Object.entries(orders).map(([type, orderList]) => (
              <TabsContent key={type} value={type}>
                <div className="space-y-4">
                  {orderList.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{order.buyer}</h4>
                          <Badge variant={order.status === "Pending" ? "destructive" : order.status === "Completed" ? "secondary" : "outline"}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {order.address}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {order.status === "Pending" && (
                          <>
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">Reject</Button>
                          </>
                        )}
                        {order.status !== "Pending" && order.status !== "Completed" && (
                          <Button size="sm" variant="outline">Update Status</Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Integration & Communication */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Receive Payments Instantly
            </CardTitle>
            <CardDescription>QR & UPI payment integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium">UPI ID: {upiId}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
              </div>
              <Button className="w-full">
                View Transaction History
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Tools</CardTitle>
            <CardDescription>Voice assistant and live chat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Voice Assistant</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask for help, manage tasks by talking (Multi-language support)
                </p>
                <Button size="sm" className="w-full">
                  <Mic className="mr-2 h-4 w-4" />
                  Start Voice Command
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex-col h-16">
                  <MessageCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Live Chat</span>
                </Button>
                <Button variant="outline" className="flex-col h-16">
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs">Voice Call</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}