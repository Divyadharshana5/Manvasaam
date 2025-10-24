"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Navigation,
    MapPin,
    Clock,
    Truck,
    ArrowLeft,
    Search,
    Phone,
    MessageCircle,
    Route,
    Fuel,
    Activity,
    AlertTriangle,
    CheckCircle,
    Eye,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TrackingPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const activeDeliveries = [
        {
            id: "DEL-001",
            vehicle: "TRK-001",
            driver: "Raj Kumar",
            from: "Green Valley Farm",
            to: "Fresh Market Store",
            status: "in-transit",
            progress: 65,
            currentLocation: "Highway NH-44, Km 45",
            eta: "2:30 PM",
            distance: "45 km",
            startTime: "11:00 AM",
            cargo: "Fresh Vegetables - 500kg",
            phone: "+91 98765 43210",
            route: "City Route A",
            fuel: 85,
            speed: 45,
            lastUpdate: "2 min ago"
        },
        {
            id: "DEL-002",
            vehicle: "TRK-002",
            driver: "Amit Singh",
            from: "Sunrise Dairy",
            to: "City Supermarket",
            status: "loading",
            progress: 15,
            currentLocation: "Sunrise Dairy - Loading Bay",
            eta: "4:15 PM",
            distance: "32 km",
            startTime: "1:00 PM",
            cargo: "Dairy Products - 300L",
            phone: "+91 98765 43211",
            route: "Highway Route B",
            fuel: 92,
            speed: 0,
            lastUpdate: "5 min ago"
        },
        {
            id: "DEL-003",
            vehicle: "TRK-004",
            driver: "Vikram Yadav",
            from: "Mountain Fruits",
            to: "Corner Store",
            status: "delivered",
            progress: 100,
            currentLocation: "Corner Store - Delivered",
            eta: "Completed",
            distance: "28 km",
            startTime: "9:00 AM",
            cargo: "Seasonal Fruits - 200kg",
            phone: "+91 98765 43213",
            route: "Rural Route C",
            fuel: 78,
            speed: 0,
            lastUpdate: "1 hour ago"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-500";
            case "in-transit": return "bg-blue-500";
            case "loading": return "bg-yellow-500";
            case "delayed": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "delivered": return "default";
            case "in-transit": return "secondary";
            case "loading": return "outline";
            case "delayed": return "destructive";
            default: return "outline";
        }
    };

    const filteredDeliveries = activeDeliveries.filter(delivery =>
        delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/transport">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Live Vehicle Tracking</h1>
                    <p className="text-muted-foreground">Monitor real-time location and status of your fleet</p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Deliveries</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {activeDeliveries.filter(d => d.status === 'in-transit' || d.status === 'loading').length}
                                </p>
                            </div>
                            <Truck className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {activeDeliveries.filter(d => d.status === 'delivered').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Speed</p>
                                <p className="text-2xl font-bold text-purple-600">42 km/h</p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">On Schedule</p>
                                <p className="text-2xl font-bold text-orange-600">94%</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by delivery ID, driver name, or vehicle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Live Tracking Cards */}
            <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)} animate-pulse`}></div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{delivery.id}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {delivery.vehicle} • {delivery.driver}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusBadge(delivery.status)}>
                                        {delivery.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{delivery.lastUpdate}</span>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3 mb-4">
                                {/* Route Information */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium">From</p>
                                            <p className="text-xs text-muted-foreground">{delivery.from}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium">To</p>
                                            <p className="text-xs text-muted-foreground">{delivery.to}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium">Current Location</p>
                                            <p className="text-xs text-muted-foreground">{delivery.currentLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium">ETA</p>
                                            <p className="text-xs text-muted-foreground">{delivery.eta}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Route className="h-4 w-4 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium">Distance</p>
                                            <p className="text-xs text-muted-foreground">{delivery.distance}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium">Speed</p>
                                            <p className="text-xs text-muted-foreground">{delivery.speed} km/h</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Status */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Fuel className="h-4 w-4 text-yellow-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Fuel Level</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Progress value={delivery.fuel} className="flex-1 h-2" />
                                                <span className="text-xs">{delivery.fuel}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium mb-1">Cargo</p>
                                        <p className="text-xs text-muted-foreground">{delivery.cargo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium mb-1">Route</p>
                                        <p className="text-xs text-muted-foreground">{delivery.route}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Delivery Progress</span>
                                    <span className="text-sm text-muted-foreground">{delivery.progress}%</span>
                                </div>
                                <Progress value={delivery.progress} className="h-3" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Driver
                                </Button>
                                <Button size="sm" variant="outline">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Message
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Live Map
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Map Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5" />
                        Live Fleet Map
                    </CardTitle>
                    <CardDescription>Real-time location of all active vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Interactive map will be displayed here</p>
                            <p className="text-sm text-gray-400">Showing real-time vehicle locations and routes</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}