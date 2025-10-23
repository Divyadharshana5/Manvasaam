"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  Package,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Route,
  Search,
  Plus,
  Minus,
  Mic,
  MessageCircle,
  Phone,
  QrCode,
  CreditCard,
  Bell,
  Eye,
  Settings,
  User,
  Navigation,
  Fuel,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TransportDashboard() {
  const [companyName] = useState("Swift Logistics");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const stats = {
    activeDeliveries: 24,
    completedToday: 18,
    totalRevenue: 185000,
    activeVehicles: 12
  };

  const deliveries = [
    {
      id: "DEL-001",
      from: "Green Valley Farm",
      to: "Fresh Market Store",
      items: "Fresh Vegetables",
      status: "in-transit",
      driver: "Raj Kumar",
      eta: "2:30 PM",
      distance: "45 km"
    },
    {
      id: "DEL-002", 
      from: "Sunrise Dairy",
      to: "City Supermarket",
      items: "Dairy Products",
      status: "delivered",
      driver: "Amit Singh",
      eta: "Completed",
      distance: "32 km"
    },
    {
      id: "DEL-003",
      from: "Mountain Fruits",
      to: "Corner Store",
      items: "Seasonal Fruits",
      status: "pending",
      driver: "Suresh Patel",
      eta: "4:15 PM",
      distance: "28 km"
    }
  ];

  const vehicles = [
    { id: "TRK-001", driver: "Raj Kumar", status: "active", location: "Highway 45", fuel: 85 },
    { id: "TRK-002", driver: "Amit Singh", status: "available", location: "Depot", fuel: 92 },
    { id: "TRK-003", driver: "Suresh Patel", status: "maintenance", location: "Service Center", fuel: 45 },
    { id: "TRK-004", driver: "Vikram Yadav", status: "active", location: "City Center", fuel: 78 }
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {companyName}</p>
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
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">2 in maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20 flex-col" asChild>
          <Link href="/dashboard/transport/orders">
            <Package className="h-6 w-6 mb-2" />
            <span>View Orders</span>
          </Link>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/transport/vehicles">
            <Truck className="h-6 w-6 mb-2" />
            <span>Manage Vehicles</span>
          </Link>
        </Button>

        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/transport/routes">
            <Route className="h-6 w-6 mb-2" />
            <span>Routes</span>
          </Link>
        </Button>

        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link href="/dashboard/voice-assistant">
            <Mic className="h-6 w-6 mb-2" />
            <span>Voice Assistant</span>
          </Link>
        </Button>
      </div>

      {/* Active Deliveries and Vehicle Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Current delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{delivery.id}</span>
                      <Badge variant={
                        delivery.status === 'delivered' ? 'default' :
                        delivery.status === 'in-transit' ? 'secondary' : 'outline'
                      }>
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{delivery.from} → {delivery.to}</p>
                    <p className="text-sm">{delivery.items}</p>
                    <p className="text-xs text-muted-foreground">Driver: {delivery.driver}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{delivery.eta}</p>
                    <p className="text-xs text-muted-foreground">{delivery.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>Fleet management overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      vehicle.status === 'active' ? 'bg-green-100' :
                      vehicle.status === 'available' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <Truck className={`h-5 w-5 ${
                        vehicle.status === 'active' ? 'text-green-600' :
                        vehicle.status === 'available' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.id}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      vehicle.status === 'active' ? 'default' :
                      vehicle.status === 'available' ? 'secondary' : 'destructive'
                    }>
                      {vehicle.status}
                    </Badge>
                    <div className="flex items-center gap-1 mt-1">
                      <Fuel className="h-3 w-3" />
                      <span className="text-xs">{vehicle.fuel}%</span>
                    </div>
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