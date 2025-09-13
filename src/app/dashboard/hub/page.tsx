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
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SimpleVoiceNav } from "@/components/simple-voice-nav";

export default function HubDashboard() {
  const [hubManagerName] = useState("Rajesh Kumar");
  const { toast } = useToast();



  const handleMarkAttendance = () => {
    toast({
      title: "Mark Attendance",
      description: "Opening attendance marking interface...",
    });
  };

  const handleUpdateStock = (product: string) => {
    toast({
      title: "Update Stock",
      description: `Updating stock for ${product}...`,
    });
  };

  const handleViewDetails = (customer: string) => {
    toast({
      title: "View Details",
      description: `Opening details for ${customer}...`,
    });
  };
  
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
          <h1 className="text-4xl font-bold tracking-tight">{hubManagerName}</h1>
          <p className="text-sm text-muted-foreground">Hub Manager</p>

        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hub/attendance">
              <UserCheck className="mr-1 h-3 w-3" />
              Attendance
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hub/inventory">
              <Package className="mr-1 h-3 w-3" />
              Inventory
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Farmers</p>
              <p className="text-lg font-bold">{stats.totalFarmers}</p>
            </div>
            <Users className="h-4 w-4 text-green-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Deliveries</p>
              <p className="text-lg font-bold">{stats.activeDeliveries}</p>
            </div>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Workers</p>
              <p className="text-lg font-bold">{stats.workersPresent}</p>
            </div>
            <UserCheck className="h-4 w-4 text-orange-500" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Sales</p>
              <p className="text-lg font-bold">₹{stats.dailySales.toLocaleString()}</p>
            </div>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Attendance & Receipts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workers.slice(0, 3).map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <UserCheck className={`h-3 w-3 ${worker.status === 'Present' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm">{worker.name}</span>
                  </div>
                  <Badge variant={worker.status === 'Present' ? 'default' : 'destructive'} className="text-xs">
                    {worker.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-3" asChild>
              <Link href="/dashboard/hub/attendance">
                View All
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Product Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {productReceipts.slice(0, 3).map((receipt) => (
                <div key={receipt.id} className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{receipt.product}</p>
                      <p className="text-xs text-muted-foreground">{receipt.quantity}</p>
                    </div>
                    <span className="text-xs">{receipt.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3" asChild>
              <Link href="/dashboard/hub/inventory">
                Manage Inventory
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sales & Communication */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offlineSales.slice(0, 3).map((sale) => (
                <div key={sale.id} className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{sale.customer}</p>
                      <p className="text-xs text-muted-foreground">{sale.items}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">₹{sale.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-3">
              <FileText className="h-3 w-3 mr-1" />
              Daily Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href={{ pathname: "/dashboard/contact", query: { mode: "chat" } }}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href={{ pathname: "/dashboard/contact", query: { mode: "call" } }}>
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Link>
              </Button>
            </div>
            <Button size="sm" variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/hub/live-tracking">
                <MapPin className="h-3 w-3 mr-2" />
                Live Tracking
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Voice Navigation Card */}
      <Card className="bg-gradient-to-r from-green-50 to-lime-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-green-600" />
            Voice Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Use voice commands to navigate quickly</p>
            <SimpleVoiceNav />
          </div>
          <div className="mt-2 text-xs text-green-600">
            Say: "Go to orders", "Show inventory", "Check deliveries"
          </div>
        </CardContent>
      </Card>

      {/* Live Tracking Section */}
      <LiveTracking />

      {/* FAQ & Settings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="border rounded p-2">
                <p className="text-sm font-medium">Hours: 8 AM - 6 PM</p>
              </div>
              <div className="border rounded p-2">
                <p className="text-sm font-medium">Process: Receive → Sort → Dispatch</p>
              </div>
              <div className="border rounded p-2">
                <p className="text-sm font-medium">Settlement: Daily at 5 PM</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <Link href="/dashboard/faq">
                <HelpCircle className="h-3 w-3 mr-1" />
                More Info
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/dashboard/profile">
                  <Building2 className="mr-2 h-3 w-3" />
                  Hub Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/dashboard/hub/attendance">
                  <Users className="mr-2 h-3 w-3" />
                  Manage Workers
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-3 w-3" />
                Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
