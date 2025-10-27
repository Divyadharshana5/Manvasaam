"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Package,
    MapPin,
    Clock,
    User,
    Phone,
    MessageCircle,
    Navigation,
    Truck,
    CheckCircle,
    AlertTriangle,
    Calendar,
    DollarSign,
    Star,
    Route,
    Fuel,
    Timer,
    Eye,
    Download,
    Share2,
    Edit,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DeliveryDetails() {
    const [deliveryId, setDeliveryId] = useState("DEL-001");
    
    // Mock delivery data - in real app, this would come from URL params or API
    const delivery = {
        id: "DEL-001",
        from: {
            name: "Green Valley Farm",
            address: "123 Farm Road, Green Valley, Tamil Nadu 632001",
            contact: "+91 98765 43210",
            coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        to: {
            name: "Fresh Market Store",
            address: "456 Market Street, City Center, Tamil Nadu 600001",
            contact: "+91 87654 32109",
            coordinates: { lat: 13.0827, lng: 80.2707 }
        },
        items: [
            { name: "Fresh Tomatoes", quantity: "50 kg", price: 2500 },
            { name: "Green Leafy Vegetables", quantity: "30 kg", price: 1800 },
            { name: "Onions", quantity: "40 kg", price: 2000 }
        ],
        status: "in-transit",
        driver: {
            name: "Raj Kumar",
            phone: "+91 98765 12345",
            rating: 4.8,
            experience: "5 years",
            photo: "/api/placeholder/40/40"
        },
        vehicle: {
            id: "TRK-001",
            type: "Refrigerated Truck",
            capacity: "5 tons",
            fuel: 85,
            temperature: 4
        },
        timeline: [
            { time: "08:00 AM", status: "Order Placed", completed: true, description: "Order confirmed by Green Valley Farm" },
            { time: "08:30 AM", status: "Pickup Scheduled", completed: true, description: "Vehicle assigned and route planned" },
            { time: "09:15 AM", status: "In Transit", completed: true, description: "Items loaded and delivery started", current: true },
            { time: "11:30 AM", status: "Out for Delivery", completed: false, description: "Estimated arrival at destination" },
            { time: "12:00 PM", status: "Delivered", completed: false, description: "Delivery completion expected" }
        ],
        eta: "11:30 AM",
        distance: {
            total: "45 km",
            remaining: "18 km"
        },
        pricing: {
            itemsTotal: 6300,
            deliveryFee: 500,
            tax: 340,
            total: 7140
        },
        createdAt: "2024-01-15T08:00:00Z",
        estimatedDelivery: "2024-01-15T12:00:00Z"
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-500";
            case "in-transit": return "bg-blue-500";
            case "pending": return "bg-yellow-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered": return "Delivered";
            case "in-transit": return "In Transit";
            case "pending": return "Pending";
            case "cancelled": return "Cancelled";
            default: return "Unknown";
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
                            <h1 className="text-2xl font-bold">Delivery Details</h1>
                            <p className="text-muted-foreground">
                                Track and manage delivery {delivery.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`${getStatusColor(delivery.status)} text-white`}>
                            {getStatusText(delivery.status)}
                        </Badge>
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Delivery Overview
                                </CardTitle>
                                <CardDescription>
                                    Order #{delivery.id} • Created {new Date(delivery.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Route */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="w-0.5 h-8 bg-gray-300"></div>
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="h-4 w-4 text-green-500" />
                                                <span className="font-medium">From: {delivery.from.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground ml-6">{delivery.from.address}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">To: {delivery.to.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground ml-6">{delivery.to.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Distance & ETA */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Total Distance</p>
                                        <p className="font-semibold">{delivery.distance.total}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Remaining</p>
                                        <p className="font-semibold text-blue-600">{delivery.distance.remaining}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">ETA</p>
                                        <p className="font-semibold text-green-600">{delivery.eta}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Being Delivered</CardTitle>
                                <CardDescription>Fresh produce from {delivery.from.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {delivery.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Items Total</span>
                                        <span>₹{delivery.pricing.itemsTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee</span>
                                        <span>₹{delivery.pricing.deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>₹{delivery.pricing.tax}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>₹{delivery.pricing.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Delivery Timeline
                                </CardTitle>
                                <CardDescription>Track the progress of your delivery</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {delivery.timeline.map((step, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    step.completed 
                                                        ? 'bg-green-500 border-green-500' 
                                                        : step.current
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'bg-gray-200 border-gray-300'
                                                }`}>
                                                    {step.completed && (
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                {index < delivery.timeline.length - 1 && (
                                                    <div className={`w-0.5 h-8 ${
                                                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-medium ${
                                                        step.current ? 'text-blue-600' : ''
                                                    }`}>
                                                        {step.status}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">{step.time}</span>
                                                    {step.current && (
                                                        <Badge variant="secondary" className="text-xs">Current</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Driver Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Driver Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{delivery.driver.name}</h4>
                                        <p className="text-sm text-muted-foreground">{delivery.driver.experience} experience</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{delivery.driver.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1" asChild>
                                        <Link href={`/dashboard/transport/deliveries/contact?driver=${delivery.driver.name}&phone=${delivery.driver.phone}`}>
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

                        {/* Vehicle Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Vehicle Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">{delivery.vehicle.id}</h4>
                                    <p className="text-sm text-muted-foreground">{delivery.vehicle.type}</p>
                                    <p className="text-sm text-muted-foreground">Capacity: {delivery.vehicle.capacity}</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Fuel Level</span>
                                            <span className="text-sm font-medium">{delivery.vehicle.fuel}%</span>
                                        </div>
                                        <Progress value={delivery.vehicle.fuel} className="h-2" />
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Temperature</span>
                                            <span className="text-sm font-medium">{delivery.vehicle.temperature}°C</span>
                                        </div>
                                        <div className="text-xs text-green-600">Optimal for fresh produce</div>
                                    </div>
                                </div>

                                <Button size="sm" className="w-full" asChild>
                                    <Link href={`/dashboard/transport/deliveries/tracking?id=${delivery.id}`}>
                                        <Navigation className="h-4 w-4 mr-2" />
                                        Track Live
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
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Delivery
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Reschedule
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Report Issue
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <MoreHorizontal className="h-4 w-4 mr-2" />
                                    More Options
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}