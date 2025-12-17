"use client";

import { motion, AnimatePresence } from "framer-motion";
import "@/styles/transport-animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Package,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
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
  Calendar,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Target,
  Gauge,
  Timer,
  Shield,
  Award,
  Activity,
  Map,
  Wrench,
  Star,
  ThermometerSun,
  Battery,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TransportDashboard() {
  const [companyName] = useState("Swift Logistics");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced Mock data
  const stats = {
    activeDeliveries: 24,
    completedToday: 18,
    totalRevenue: 185000,
    activeVehicles: 12,
    monthlyDeliveries: 456,
    fuelEfficiency: 12.5,
    customerRating: 4.7,
    onTimeDelivery: 94,
  };

  const todayStats = {
    deliveriesToday: 18,
    revenueToday: 12500,
    distanceCovered: 850,
    fuelConsumed: 68,
  };

  const performanceMetrics = {
    deliverySuccess: 96,
    customerSatisfaction: 94,
    vehicleUtilization: 87,
    driverEfficiency: 91,
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
      distance: "45 km",
    },
    {
      id: "DEL-002",
      from: "Sunrise Dairy",
      to: "City Supermarket",
      items: "Dairy Products",
      status: "delivered",
      driver: "Amit Singh",
      eta: "Completed",
      distance: "32 km",
    },
    {
      id: "DEL-003",
      from: "Mountain Fruits",
      to: "Corner Store",
      items: "Seasonal Fruits",
      status: "pending",
      driver: "Suresh Patel",
      eta: "4:15 PM",
      distance: "28 km",
    },
  ];

  const vehicles = [
    {
      id: "TRK-001",
      driver: "Raj Kumar",
      status: "active",
      location: "Highway 45",
      fuel: 85,
      mileage: 12.5,
      lastService: "2024-01-10",
      nextService: "2024-02-10",
      temperature: 85,
      battery: 98,
    },
    {
      id: "TRK-002",
      driver: "Amit Singh",
      status: "available",
      location: "Depot",
      fuel: 92,
      mileage: 13.2,
      lastService: "2024-01-08",
      nextService: "2024-02-08",
      temperature: 78,
      battery: 100,
    },
    {
      id: "TRK-003",
      driver: "Suresh Patel",
      status: "maintenance",
      location: "Service Center",
      fuel: 45,
      mileage: 11.8,
      lastService: "2024-01-15",
      nextService: "2024-01-16",
      temperature: 65,
      battery: 85,
    },
    {
      id: "TRK-004",
      driver: "Vikram Yadav",
      status: "active",
      location: "City Center",
      fuel: 78,
      mileage: 12.8,
      lastService: "2024-01-12",
      nextService: "2024-02-12",
      temperature: 82,
      battery: 95,
    },
  ];

  const routes = [
    {
      name: "City Route A",
      distance: "45 km",
      avgTime: "2.5 hrs",
      efficiency: 92,
      vehicles: 3,
    },
    {
      name: "Highway Route B",
      distance: "85 km",
      avgTime: "4.2 hrs",
      efficiency: 88,
      vehicles: 2,
    },
    {
      name: "Rural Route C",
      distance: "65 km",
      avgTime: "3.8 hrs",
      efficiency: 85,
      vehicles: 4,
    },
    {
      name: "Express Route D",
      distance: "120 km",
      avgTime: "5.5 hrs",
      efficiency: 90,
      vehicles: 3,
    },
  ];

  const drivers = [
    {
      name: "Raj Kumar",
      rating: 4.8,
      deliveries: 156,
      experience: "5 years",
      status: "active",
    },
    {
      name: "Amit Singh",
      rating: 4.9,
      deliveries: 142,
      experience: "7 years",
      status: "available",
    },
    {
      name: "Suresh Patel",
      rating: 4.6,
      deliveries: 134,
      experience: "4 years",
      status: "break",
    },
    {
      name: "Vikram Yadav",
      rating: 4.7,
      deliveries: 128,
      experience: "6 years",
      status: "active",
    },
  ];

  const recentActivities = [
    {
      type: "delivery",
      message: "DEL-001 completed successfully",
      time: "15 min ago",
      icon: CheckCircle,
    },
    {
      type: "vehicle",
      message: "TRK-003 sent for maintenance",
      time: "1 hour ago",
      icon: Wrench,
    },
    {
      type: "route",
      message: "New route optimized for City Route A",
      time: "2 hours ago",
      icon: Route,
    },
    {
      type: "fuel",
      message: "Fuel alert: TRK-004 needs refueling",
      time: "3 hours ago",
      icon: Fuel,
    },
  ];

  const quickActions = [
    {
      name: "New Delivery",
      icon: Plus,
      href: "/dashboard/transport/deliveries/new",
      color: "bg-green-500",
    },
    {
      name: "Track Vehicle",
      icon: Navigation,
      href: "/dashboard/transport/tracking",
      color: "bg-blue-500",
    },
    {
      name: "Route Planning",
      icon: Map,
      href: "/dashboard/transport/routes",
      color: "bg-purple-500",
    },
    {
      name: "Maintenance",
      icon: Wrench,
      href: "/dashboard/transport/maintenance",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 page-transition">
      {/* Status and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-3 w-3 mr-1" />
            Fleet Active
          </Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Last update: 1 min ago
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <Shield className="h-3 w-3 mr-1" />
            Safety Certified
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search deliveries, vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/transport/notifications">
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Today's Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-500 stat-card card-glow animate-fade-in-up stagger-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today's Deliveries
                </p>
                <p className="text-2xl font-bold text-green-600 number-counter">
                  {todayStats.deliveriesToday}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 stat-card card-glow animate-fade-in-up stagger-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today's Revenue
                </p>
                <p className="text-2xl font-bold text-blue-600 number-counter">
                  ₹{todayStats.revenueToday.toLocaleString()}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 stat-card card-glow animate-fade-in-up stagger-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Distance Covered
                </p>
                <p className="text-2xl font-bold text-purple-600 number-counter">
                  {todayStats.distanceCovered} km
                </p>
              </div>
              <Route className="h-8 w-8 text-purple-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 stat-card card-glow animate-fade-in-up stagger-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fuel Consumed
                </p>
                <p className="text-2xl font-bold text-orange-600 number-counter">
                  {todayStats.fuelConsumed}L
                </p>
              </div>
              <Fuel className="h-8 w-8 text-orange-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 tab-content">
          {/* Monthly Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="animate-scale-in stagger-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Deliveries
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeDeliveries}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +3 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in stagger-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in stagger-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Customer Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customerRating}</div>
                <p className="text-xs text-muted-foreground">
                  <Star className="inline h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  Excellent service
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in stagger-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On-Time Delivery
                </CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.onTimeDelivery}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                  Above target
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="animate-fade-in-up stagger-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Frequently used actions for transport operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col"
                    asChild
                  >
                    <Link href={action.href}>
                      <div
                        className={`p-2 rounded-full ${action.color} text-white mb-2`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <span>{action.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4 tab-content">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fleet Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/transport/fleet/filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/transport/fleet/export">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {vehicles.map((vehicle, index) => (
              <Card className="animate-slide-in-left list-item"
                key={index}
                className={
                  vehicle.status === "maintenance"
                    ? "border-orange-200 bg-orange-50"
                    : ""
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          vehicle.status === "active"
                            ? "bg-green-100"
                            : vehicle.status === "available"
                            ? "bg-blue-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <Truck
                          className={`h-6 w-6 ${
                            vehicle.status === "active"
                              ? "text-green-600"
                              : vehicle.status === "available"
                              ? "text-blue-600"
                              : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{vehicle.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Driver: {vehicle.driver}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {vehicle.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Fuel className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {vehicle.fuel}%
                          </span>
                        </div>
                        <Progress value={vehicle.fuel} className="w-16 h-2" />
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <ThermometerSun className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {vehicle.temperature}°C
                          </span>
                        </div>
                        <Progress
                          value={(vehicle.temperature / 100) * 100}
                          className="w-16 h-2"
                        />
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Battery className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {vehicle.battery}%
                          </span>
                        </div>
                        <Progress
                          value={vehicle.battery}
                          className="w-16 h-2"
                        />
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            vehicle.status === "active"
                              ? "default"
                              : vehicle.status === "available"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {vehicle.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {vehicle.mileage} km/l
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4 tab-content">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Deliveries</h3>
            <Button asChild>
              <Link href="/dashboard/transport/deliveries/new">
                <Plus className="h-4 w-4 mr-2" />
                New Delivery
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="animate-fade-in-up list-item">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{delivery.id}</span>
                        <Badge
                          variant={
                            delivery.status === "delivered"
                              ? "default"
                              : delivery.status === "in-transit"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {delivery.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {delivery.from} → {delivery.to}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Items: {delivery.items}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Driver: {delivery.driver}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{delivery.eta}</p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.distance}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/dashboard/transport/deliveries/details?id=${delivery.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/dashboard/transport/deliveries/tracking?id=${delivery.id}`}
                          >
                            <Navigation className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/dashboard/transport/deliveries/contact?driver=${delivery.driver}&delivery=${delivery.id}`}
                          >
                            <Phone className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 tab-content">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-fade-in-up stagger-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delivery Success Rate</span>
                  <span className="font-semibold">
                    {performanceMetrics.deliverySuccess}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.deliverySuccess}
                  className="h-2"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="font-semibold">
                    {performanceMetrics.customerSatisfaction}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.customerSatisfaction}
                  className="h-2"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Vehicle Utilization</span>
                  <span className="font-semibold">
                    {performanceMetrics.vehicleUtilization}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.vehicleUtilization}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up stagger-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Monthly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Target</span>
                  <span className="font-semibold">₹200K</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  ₹185K achieved (92%)
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Delivery Target</span>
                  <span className="font-semibold">500</span>
                </div>
                <Progress value={91} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  456 deliveries completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Route Efficiency */}
          <Card className="animate-scale-in stagger-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Route Efficiency
              </CardTitle>
              <CardDescription>
                Performance analysis of different routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{route.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {route.distance} • {route.avgTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {route.efficiency}%
                        </p>
                        <Progress
                          value={route.efficiency}
                          className="w-16 h-2"
                        />
                      </div>
                      <Badge variant="outline">{route.vehicles} vehicles</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Section - Recent Activities, Drivers, and Fleet Health */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-slide-in-left stagger-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest fleet updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in stagger-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Driver Performance
            </CardTitle>
            <CardDescription>Top performing drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        driver.status === "active"
                          ? "bg-green-100"
                          : driver.status === "available"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <User
                        className={`h-4 w-4 ${
                          driver.status === "active"
                            ? "text-green-600"
                            : driver.status === "available"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {driver.experience}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{driver.rating}</span>
                    </div>
                    <Badge
                      variant={
                        driver.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {driver.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5" />
              Fleet Health
            </CardTitle>
            <CardDescription>Overall fleet performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Fuel Efficiency</span>
                <span className="font-semibold">
                  {stats.fuelEfficiency} km/l
                </span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Vehicle Uptime</span>
                <span className="font-semibold">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Safety Score</span>
                <span className="font-semibold">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Excellent Fleet</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your fleet is performing above industry standards!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
