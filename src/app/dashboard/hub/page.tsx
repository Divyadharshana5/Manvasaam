"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveTracking } from "@/components/live-tracking";
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
  UserCheck,
  DollarSign,
  Mic,
  MessageCircle,
  Phone,
  MapPin,
  HelpCircle,
  Settings,
  FileText,
  Calendar,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HubDashboard() {
  const [hubManagerName] = useState("Rajesh Kumar");
  
  // Mock data
  const stats = {
    totalFarmers: 12,
    activeDeliveries: 8,
    workersPresent: 15,
    dailySales: 25000
  };

  const workers = [
    { id: 1, name: "Amit Singh", status: "Present", checkIn: "09:00 AM", checkOut: "-" },
    { id: 2, name: "Priya Sharma", status: "Present", checkIn: "08:45 AM", checkOut: "-" },
    { id: 3, name: "Ravi Kumar", status: "Absent", checkIn: "-", checkOut: "-" },
    { id: 4, name: "Sunita Devi", status: "Present", checkIn: "09:15 AM", checkOut: "-" }
  ];

  const productReceipts = [
    { id: 1, product: "Organic Tomatoes", quantity: "50 kg", farmer: "Green Valley Farm", time: "10:30 AM" },
    { id: 2, product: "Fresh Spinach", quantity: "25 bunches", farmer: "Sunrise Organics", time: "11:15 AM" },
    { id: 3, product: "Carrots", quantity: "30 kg", farmer: "Happy Farm", time: "12:00 PM" }
  ];

  const offlineSales = [
    { id: 1, customer: "Walk-in Customer", items: "Tomatoes, Onions", amount: 250, time: "02:30 PM" },
    { id: 2, customer: "Local Vendor", items: "Mixed Vegetables", amount: 800, time: "01:45 PM" },
    { id: 3, customer: "Restaurant Order", items: "Bulk Potatoes", amount: 1200, time: "11:30 AM" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {hubManagerName}!</h1>
          <p className="text-muted-foreground">
            Manage distribution operations and logistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hub/attendance">
              <UserCheck className="mr-2 h-4 w-4" />
              Attendance
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/hub/inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Link>
          </Button>
          <Button disabled className="opacity-50">
            <Volume2 className="mr-2 h-4 w-4" />
            Voice Assistant
          </Button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers Registered</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFarmers}</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries in Hub</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance: Workers Present</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workersPresent}</div>
            <p className="text-xs text-muted-foreground">
              Present today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales for the Day</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.dailySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Today's revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Management & Product Receipts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Management</CardTitle>
            <CardDescription>Hub workers attendance tracker</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className={`h-4 w-4 ${worker.status === 'Present' ? 'text-green-500' : 'text-red-500'}`} />
                    <div>
                      <p className="font-medium">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        In: {worker.checkIn} | Out: {worker.checkOut}
                      </p>
                    </div>
                  </div>
                  <Badge variant={worker.status === 'Present' ? 'default' : 'destructive'}>
                    {worker.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1">
                <UserCheck className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href="/dashboard/hub/attendance">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Receipts from Farmers</CardTitle>
            <CardDescription>Products received today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productReceipts.map((receipt) => (
                <div key={receipt.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{receipt.product}</p>
                      <p className="text-sm text-muted-foreground">{receipt.farmer}</p>
                    </div>
                    <span className="text-sm font-medium">{receipt.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600">{receipt.quantity}</span>
                    <Button size="sm" variant="outline">
                      <Package className="h-3 w-3 mr-1" />
                      Update Stock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/hub/inventory">
                Manage Inventory
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sales Management & Communication */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Management (Offline Mode)</CardTitle>
            <CardDescription>In-hub offline sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offlineSales.map((sale) => (
                <div key={sale.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{sale.customer}</p>
                      <p className="text-sm text-muted-foreground">{sale.items}</p>
                    </div>
                    <span className="text-sm">{sale.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">₹{sale.amount}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Generate Daily Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Tools</CardTitle>
            <CardDescription>Voice assistant and farmer communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Voice Assistant</h4>
              <p className="text-sm text-muted-foreground mb-2">Check attendance, stock, and sales via voice</p>
              <Button size="sm" className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Activate Voice Commands
              </Button>
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Farmer Communication</h4>
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
              <h4 className="font-medium mb-2">Live Tracking</h4>
              <p className="text-sm text-muted-foreground mb-2">Track deliveries from farmers to hub</p>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/dashboard/hub/live-tracking">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Live Tracking
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Tracking Section */}
      <LiveTracking />

      {/* FAQ & Profile Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>FAQ Section</CardTitle>
            <CardDescription>Frequently asked questions and support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-1">Working Hours & Attendance</h4>
                <p className="text-sm text-muted-foreground">Hub operates 8 AM - 6 PM daily</p>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-1">Delivery Process</h4>
                <p className="text-sm text-muted-foreground">Receive → Sort → Dispatch within 2 hours</p>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-1">Payment Settlement</h4>
                <p className="text-sm text-muted-foreground">Daily settlements at 5 PM</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                View All FAQs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile & Settings</CardTitle>
            <CardDescription>Manage hub and worker profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/profile">
                  <Building2 className="mr-2 h-4 w-4" />
                  Edit Hub Profile
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/hub/attendance">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Workers
                </Link>
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Language & Voice
              </Button>
              <Button variant="outline" className="justify-start" disabled>
                <Volume2 className="mr-2 h-4 w-4" />
                Voice Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
