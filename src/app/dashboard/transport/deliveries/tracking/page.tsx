"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Navigation,
    MapPin,
    Clock,
    Truck,
    Route,
    Fuel,
    Gauge,
    Phone,
    MessageCircle,
    AlertTriangle,
    CheckCircle,
    Timer,
    Zap,
    RefreshCw,
    Share2,
    Eye,
    Settings
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DeliveryTracking() {
    const [deliveryId, setDeliveryId] = useState("DEL-001");
    const [isLiveTracking, setIsLiveTracking] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Mock real-time tracking data
    const trackingData = {
        id: "DEL-001",
        status: "in-transit",
        currentLocation: {
            address: "Highway 45, Near Toll Plaza",
            coordinates: { lat: 12.9716, lng: 77.5946 },
            timestamp: new Date()
        },
        driver: {
            name: "Raj Kumar",
            phone: "+91 98765 12345",
            photo: "/api/placeholder/40/40"
        },
        vehicle: {
            id: "TRK-001",
            speed: 65,
            fuel: 85,
            temperature: 4,
            batteryLevel: 98
        },
        route: {
            totalDistance: "45 km",
            remainingDistance: "18 km",
            estimatedArrival: "11:30 AM",
            progress: 60
        },
        waypoints: [
            { name: "Green Valley Farm", status: "completed", time: "09:15 AM", type: "pickup" },
            { name: "Highway Checkpoint", status: "completed", time: "10:20 AM", type: "checkpoint" },
            { name: "City Entry Point", status: "current", time: "10:45 AM", type: "checkpoint" },
            { name: "Fresh Market Store", status: "pending", time: "11:30 AM", type: "delivery" }
        ],
        alerts: [
            { type: "info", message: "Vehicle is on optimal route", time: "2 min ago" },
            { type: "success", message: "Temperature maintained at 4°C", time: "5 min ago" }
        ]
    };

    // Simulate real-time updates
    useEffect(() => {
        if (isLiveTracking) {
            const interval = setInterval(() => {
                setLastUpdate(new Date());
            }, 30000); // Update every 30 seconds

            return () => clearInterval(interval);
        }
    }, [isLiveTracking]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-500";
            case "current": return "bg-blue-500";
            case "pending": return "bg-gray-300";
            default: return "bg-gray-300";
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case "success": return "border-green-200 bg-green-50 text-green-800";
            case "warning": return "border-yellow-200 bg-yellow-50 text-yellow-800";
            case "error": return "border-red-200 bg-red-50 text-red-800";
            default: return "border-blue-200 bg-blue-50 text-blue-800";
        }
    };

    return (
        <div className="min-h-screen w-full overflow-auto">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard/transport">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Live Tracking</h1>
                            <p className="text-muted-foreground">
                                Real-time tracking for delivery {trackingData.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={isLiveTracking ? "default" : "secondary"} className="animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Live Tracking
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Tracking View */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map Placeholder */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5" />
                                    Live Location
                                </CardTitle>
                                <CardDescription>
                                    Last updated: {lastUpdate.toLocaleTimeString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Map placeholder - in real app, this would be Google Maps or similar */}
                                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
                                    <div className="relative z-10 text-center">
                                        <Navigation className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Real-time vehicle location and route tracking
                                        </p>
                                        <div className="flex items-center justify-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span>Pickup Point</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                                <span>Current Location</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <span>Destination</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Current Location Info */}
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">Current Location</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{trackingData.currentLocation.address}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Updated: {trackingData.currentLocation.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Route Progress */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Route className="h-5 w-5" />
                                    Route Progress
                                </CardTitle>
                                <CardDescription>Track delivery progress along the route</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Progress Bar */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Journey Progress</span>
                                        <span className="text-sm text-muted-foreground">{trackingData.route.progress}%</span>
                                    </div>
                                    <Progress value={trackingData.route.progress} className="h-3" />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Started</span>
                                        <span>ETA: {trackingData.route.estimatedArrival}</span>
                                    </div>
                                </div>

                                {/* Waypoints */}
                                <div className="space-y-3">
                                    {trackingData.waypoints.map((waypoint, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full ${getStatusColor(waypoint.status)} ${
                                                    waypoint.status === 'current' ? 'animate-pulse' : ''
                                                }`}></div>
                                                {index < trackingData.waypoints.length - 1 && (
                                                    <div className={`w-0.5 h-8 ${
                                                        waypoint.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-medium ${
                                                        waypoint.status === 'current' ? 'text-blue-600' : ''
                                                    }`}>
                                                        {waypoint.name}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {waypoint.type}
                                                    </Badge>
                                                    {waypoint.status === 'current' && (
                                                        <Badge variant="secondary" className="text-xs">Current</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{waypoint.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alerts & Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Live Updates
                                </CardTitle>
                                <CardDescription>Real-time alerts and notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {trackingData.alerts.map((alert, index) => (
                                        <div key={index} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                                            <div className="flex items-start gap-2">
                                                {alert.type === 'success' && <CheckCircle className="h-4 w-4 mt-0.5" />}
                                                {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 mt-0.5" />}
                                                {alert.type === 'info' && <Zap className="h-4 w-4 mt-0.5" />}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{alert.message}</p>
                                                    <p className="text-xs opacity-75">{alert.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Vehicle Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Vehicle Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">{trackingData.vehicle.id}</h4>
                                    <p className="text-sm text-muted-foreground">Refrigerated Truck</p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Gauge className="h-4 w-4" />
                                                <span className="text-sm">Speed</span>
                                            </div>
                                            <span className="text-sm font-medium">{trackingData.vehicle.speed} km/h</span>
                                        </div>
                                        <div className="text-xs text-green-600">Within speed limit</div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Fuel className="h-4 w-4" />
                                                <span className="text-sm">Fuel</span>
                                            </div>
                                            <span className="text-sm font-medium">{trackingData.vehicle.fuel}%</span>
                                        </div>
                                        <Progress value={trackingData.vehicle.fuel} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Timer className="h-4 w-4" />
                                                <span className="text-sm">Temperature</span>
                                            </div>
                                            <span className="text-sm font-medium">{trackingData.vehicle.temperature}°C</span>
                                        </div>
                                        <div className="text-xs text-green-600">Optimal for fresh produce</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Driver Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Driver Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium">RK</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{trackingData.driver.name}</h4>
                                        <p className="text-sm text-muted-foreground">Professional Driver</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1" asChild>
                                        <Link href={`/dashboard/transport/deliveries/contact?driver=${trackingData.driver.name}&phone=${trackingData.driver.phone}`}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Total Distance</span>
                                    <span className="text-sm font-medium">{trackingData.route.totalDistance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Remaining</span>
                                    <span className="text-sm font-medium text-blue-600">{trackingData.route.remainingDistance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">ETA</span>
                                    <span className="text-sm font-medium text-green-600">{trackingData.route.estimatedArrival}</span>
                                </div>
                                
                                <Button size="sm" className="w-full mt-4" asChild>
                                    <Link href={`/dashboard/transport/deliveries/details?id=${trackingData.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Report Issue
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Tracking Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}