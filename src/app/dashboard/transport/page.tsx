"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        onTimeDelivery: 94
    };

    const todayStats = {
        deliveriesToday: 18,
        revenueToday: 12500,
        distanceCovered: 850,
        fuelConsumed: 68
    };

    const performanceMetrics = {
        deliverySuccess: 96,
        customerSatisfaction: 94,
        vehicleUtilization: 87,
        driverEfficiency: 91
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
            battery: 98
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
            battery: 100
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
            battery: 85
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
            battery: 95
        }
    ];

    const routes = [
        { name: "City Route A", distance: "45 km", avgTime: "2.5 hrs", efficiency: 92, vehicles: 3 },
        { name: "Highway Route B", distance: "85 km", avgTime: "4.2 hrs", efficiency: 88, vehicles: 2 },
        { name: "Rural Route C", distance: "65 km", avgTime: "3.8 hrs", efficiency: 85, vehicles: 4 },
        { name: "Express Route D", distance: "120 km", avgTime: "5.5 hrs", efficiency: 90, vehicles: 3 }
    ];

    const drivers = [
        { name: "Raj Kumar", rating: 4.8, deliveries: 156, experience: "5 years", status: "active" },
        { name: "Amit Singh", rating: 4.9, deliveries: 142, experience: "7 years", status: "available" },
        { name: "Suresh Patel", rating: 4.6, deliveries: 134, experience: "4 years", status: "break" },
        { name: "Vikram Yadav", rating: 4.7, deliveries: 128, experience: "6 years", status: "active" }
    ];

    const recentActivities = [
        { type: "delivery", message: "DEL-001 completed successfully", time: "15 min ago", icon: CheckCircle },
        { type: "vehicle", message: "TRK-003 sent for maintenance", time: "1 hour ago", icon: Wrench },
        { type: "route", message: "New route optimized for City Route A", time: "2 hours ago", icon: Route },
        { type: "fuel", message: "Fuel alert: TRK-004 needs refueling", time: "3 hours ago", icon: Fuel }
    ];

    const quickActions = [
        { name: "New Delivery", icon: Plus, href: "/dashboard/transport/deliveries/new", color: "bg-green-500" },
        { name: "Track Vehicle", icon: Navigation, href: "/dashboard/transport/tracking", color: "bg-blue-500" },
        { name: "Route Planning", icon: Map, href: "/dashboard/transport/routes", color: "bg-purple-500" },
        { name: "Maintenance", icon: Wrench, href: "/dashboard/transport/maintenance", color: "bg-orange-500" }
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {companyName}</p>
                    <div className="flex items-center gap-2 mt-2">
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
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search deliveries, vehicles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-64"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Today's Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Deliveries</p>
                                <p className="text-2xl font-bold text-green-600">{todayStats.deliveriesToday}</p>
                            </div>
                            <Package className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                                <p className="text-2xl font-bold text-blue-600">₹{todayStats.revenueToday.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Distance Covered</p>
                                <p className="text-2xl font-bold text-purple-600">{todayStats.distanceCovered} km</p>
                            </div>
                            <Route className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Fuel Consumed</p>
                                <p className="text-2xl font-bold text-orange-600">{todayStats.fuelConsumed}L</p>
                            </div>
                            <Fuel className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
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
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${vehicle.status === 'active' ? 'bg-green-100' :
                                            vehicle.status === 'available' ? 'bg-blue-100' : 'bg-orange-100'
                                            }`}>
                                            <Truck className={`h-5 w-5 ${vehicle.status === 'active' ? 'text-green-600' :
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