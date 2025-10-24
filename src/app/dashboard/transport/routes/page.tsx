"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Route,
    MapPin,
    Clock,
    Fuel,
    ArrowLeft,
    Search,
    Plus,
    TrendingUp,
    TrendingDown,
    Navigation,
    Truck,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    Edit,
    Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RoutesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const routes = [
        {
            id: "RT-001",
            name: "City Route A",
            distance: "45 km",
            avgTime: "2.5 hrs",
            efficiency: 92,
            vehicles: 3,
            dailyTrips: 8,
            fuelConsumption: 12.5,
            tollCost: 150,
            status: "active",
            waypoints: ["Green Valley Farm", "City Center", "Fresh Market Store"],
            trafficLevel: "moderate",
            roadCondition: "good",
            lastOptimized: "2024-01-10",
            costPerKm: 8.5,
            avgSpeed: 35,
            reliability: 96
        },
        {
            id: "RT-002",
            name: "Highway Route B",
            distance: "85 km",
            avgTime: "4.2 hrs",
            efficiency: 88,
            vehicles: 2,
            dailyTrips: 4,
            fuelConsumption: 15.2,
            tollCost: 280,
            status: "active",
            waypoints: ["Sunrise Dairy", "Highway Junction", "City Supermarket"],
            trafficLevel: "light",
            roadCondition: "excellent",
            lastOptimized: "2024-01-08",
            costPerKm: 12.3,
            avgSpeed: 48,
            reliability: 94
        },
        {
            id: "RT-003",
            name: "Rural Route C",
            distance: "65 km",
            avgTime: "3.8 hrs",
            efficiency: 85,
            vehicles: 4,
            dailyTrips: 6,
            fuelConsumption: 18.7,
            tollCost: 200,
            status: "needs-optimization",
            waypoints: ["Mountain Fruits", "Rural Junction", "Corner Store"],
            trafficLevel: "heavy",
            roadCondition: "fair",
            lastOptimized: "2024-01-05",
            costPerKm: 15.8,
            avgSpeed: 28,
            reliability: 89
        },
        {
            id: "RT-004",
            name: "Express Route D",
            distance: "120 km",
            avgTime: "5.5 hrs",
            efficiency: 90,
            vehicles: 3,
            dailyTrips: 3,
            fuelConsumption: 22.1,
            tollCost: 450,
            status: "active",
            waypoints: ["Golden Grains", "Express Highway", "Metro Market"],
            trafficLevel: "light",
            roadCondition: "excellent",
            lastOptimized: "2024-01-12",
            costPerKm: 18.2,
            avgSpeed: 52,
            reliability: 98
        }
    ];

    const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "default";
            case "needs-optimization": return "destructive";
            case "under-maintenance": return "secondary";
            default: return "outline";
        }
    };

    const getTrafficColor = (level: string) => {
        switch (level) {
            case "light": return "text-green-600";
            case "moderate": return "text-yellow-600";
            case "heavy": return "text-red-600";
            default: return "text-gray-600";
        }
    };

    const totalRoutes = routes.length;
    const activeRoutes = routes.filter(r => r.status === "active").length;
    const avgEfficiency = Math.round(routes.reduce((sum, r) => sum + r.efficiency, 0) / routes.length);
    const totalVehicles = routes.reduce((sum, r) => sum + r.vehicles, 0);

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
                    <h1 className="text-2xl font-bold tracking-tight">Route Management</h1>
                    <p className="text-muted-foreground">Optimize and manage your delivery routes for maximum efficiency</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Route
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Routes</p>
                                <p className="text-2xl font-bold">{totalRoutes}</p>
                            </div>
                            <Route className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Routes</p>
                                <p className="text-2xl font-bold text-green-600">{activeRoutes}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                                <p className="text-2xl font-bold text-purple-600">{avgEfficiency}%</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Assigned Vehicles</p>
                                <p className="text-2xl font-bold text-orange-600">{totalVehicles}</p>
                            </div>
                            <Truck className="h-8 w-8 text-orange-500" />
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
                            placeholder="Search routes by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Routes Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {filteredRoutes.map((route) => (
                    <Card key={route.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Route className="h-5 w-5" />
                                        {route.name}
                                    </CardTitle>
                                    <CardDescription>{route.id}</CardDescription>
                                </div>
                                <Badge variant={getStatusColor(route.status)}>
                                    {route.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Route Metrics */}
                            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <p className="text-lg font-bold">{route.distance}</p>
                                    <p className="text-xs text-muted-foreground">Distance</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold">{route.avgTime}</p>
                                    <p className="text-xs text-muted-foreground">Avg Time</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold">{route.efficiency}%</p>
                                    <p className="text-xs text-muted-foreground">Efficiency</p>
                                </div>
                            </div>

                            {/* Efficiency Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Route Efficiency</span>
                                    <span className="text-sm text-muted-foreground">{route.efficiency}%</span>
                                </div>
                                <Progress value={route.efficiency} className="h-2" />
                            </div>

                            {/* Route Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vehicles Assigned:</span>
                                    <span className="font-medium">{route.vehicles}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Daily Trips:</span>
                                    <span className="font-medium">{route.dailyTrips}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fuel Consumption:</span>
                                    <span className="font-medium">{route.fuelConsumption} L/100km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Toll Cost:</span>
                                    <span className="font-medium">₹{route.tollCost}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg Speed:</span>
                                    <span className="font-medium">{route.avgSpeed} km/h</span>
                                </div>
                            </div>

                            {/* Traffic & Conditions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium mb-1">Traffic Level</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            route.trafficLevel === 'light' ? 'bg-green-500' :
                                            route.trafficLevel === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className={`text-sm capitalize ${getTrafficColor(route.trafficLevel)}`}>
                                            {route.trafficLevel}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-1">Road Condition</p>
                                    <span className="text-sm text-muted-foreground capitalize">{route.roadCondition}</span>
                                </div>
                            </div>

                            {/* Waypoints */}
                            <div>
                                <p className="text-sm font-medium mb-2">Route Waypoints</p>
                                <div className="flex items-center gap-2 text-xs">
                                    {route.waypoints.map((waypoint, index) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-blue-500" />
                                            <span className="text-muted-foreground">{waypoint}</span>
                                            {index < route.waypoints.length - 1 && (
                                                <span className="text-muted-foreground">→</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Indicators */}
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Reliability: {route.reliability}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">Last optimized: {route.lastOptimized}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Optimize
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Navigation className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Route Optimization Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5" />
                        Optimization Suggestions
                    </CardTitle>
                    <CardDescription>AI-powered recommendations to improve route efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Rural Route C Optimization</h4>
                                <p className="text-sm text-muted-foreground">
                                    Consider rerouting through Highway Junction to reduce travel time by 25 minutes and save ₹50 in fuel costs.
                                </p>
                                <Button size="sm" variant="outline" className="mt-2">
                                    Apply Suggestion
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">Peak Hour Adjustment</h4>
                                <p className="text-sm text-muted-foreground">
                                    Shift City Route A departures 30 minutes earlier to avoid traffic congestion and improve on-time delivery by 12%.
                                </p>
                                <Button size="sm" variant="outline" className="mt-2">
                                    Schedule Change
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}