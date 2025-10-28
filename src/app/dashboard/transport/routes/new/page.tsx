"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeft,
    Route,
    MapPin,
    Truck,
    Navigation,
    Plus,
    Save,
    Zap,
    CheckCircle,
    Target,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewRoutePage() {
    const [routeData, setRouteData] = useState({
        name: "",
        description: "",
        startLocation: "",
        endLocation: "",
        routeType: "",
        priority: "medium",
        estimatedDistance: "",
        estimatedTime: "",
        maxStops: "",
        vehicleType: "",
        optimizeFor: "efficiency"
    });

    const [waypoints, setWaypoints] = useState([""]);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const routeTypes = [
        { value: "urban", label: "Urban Route", description: "City and suburban areas" },
        { value: "highway", label: "Highway Route", description: "Long-distance highway travel" },
        { value: "rural", label: "Rural Route", description: "Rural and countryside areas" },
        { value: "mixed", label: "Mixed Route", description: "Combination of urban and highway" }
    ];

    const vehicleTypes = [
        { value: "small", label: "Small Vehicle", description: "Up to 1 ton capacity" },
        { value: "medium", label: "Medium Vehicle", description: "1-3 ton capacity" },
        { value: "large", label: "Large Vehicle", description: "3+ ton capacity" },
        { value: "refrigerated", label: "Refrigerated", description: "Temperature controlled" }
    ];

    const optimizationOptions = [
        { value: "efficiency", label: "Fuel Efficiency", description: "Minimize fuel consumption" },
        { value: "time", label: "Time", description: "Fastest route possible" },
        { value: "distance", label: "Distance", description: "Shortest distance" },
        { value: "cost", label: "Cost", description: "Most cost-effective route" }
    ];

    const addWaypoint = () => {
        setWaypoints([...waypoints, ""]);
    };

    const removeWaypoint = (index: number) => {
        if (waypoints.length > 1) {
            setWaypoints(waypoints.filter((_, i) => i !== index));
        }
    };

    const updateWaypoint = (index: number, value: string) => {
        const newWaypoints = [...waypoints];
        newWaypoints[index] = value;
        setWaypoints(newWaypoints);
    };

    const handleCreateRoute = async () => {
        setIsCreating(true);

        try {
            const newRoute = {
                ...routeData,
                waypoints: waypoints.filter(wp => wp.trim() !== ""),
                id: `RT-${Date.now().toString().slice(-3)}`,
                status: "active",
                createdAt: new Date().toISOString()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2500));

            console.log('Creating new route:', newRoute);

            alert(`Route "${routeData.name}" created successfully! Redirecting to route details...`);

            // Redirect to routes page
            window.location.href = '/dashboard/transport/routes';

        } catch (error) {
            console.error('Error creating route:', error);
            alert('Failed to create route. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveAsDraft = async () => {
        setIsSaving(true);

        try {
            const draftRoute = {
                ...routeData,
                waypoints: waypoints.filter(wp => wp.trim() !== ""),
                status: "draft",
                savedAt: new Date().toISOString()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Saving route draft:', draftRoute);

            alert('Route saved as draft successfully!');

        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard/transport/routes">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Create New Route</h1>
                            <p className="text-muted-foreground">
                                Design and optimize a new delivery route
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary">
                        Route Builder
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Route className="h-5 w-5" />
                                    Route Information
                                </CardTitle>
                                <CardDescription>Basic details about your new route</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="routeName">Route Name</Label>
                                        <Input
                                            id="routeName"
                                            placeholder="e.g., Downtown Express"
                                            value={routeData.name}
                                            onChange={(e) => setRouteData({ ...routeData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="routeType">Route Type</Label>
                                        <Select value={routeData.routeType} onValueChange={(value) => setRouteData({ ...routeData, routeType: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select route type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {routeTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div>
                                                            <div className="font-medium">{type.label}</div>
                                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the route purpose and key characteristics..."
                                        value={routeData.description}
                                        onChange={(e) => setRouteData({ ...routeData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select value={routeData.priority} onValueChange={(value) => setRouteData({ ...routeData, priority: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="estimatedDistance">Est. Distance (km)</Label>
                                        <Input
                                            id="estimatedDistance"
                                            type="number"
                                            placeholder="45"
                                            value={routeData.estimatedDistance}
                                            onChange={(e) => setRouteData({ ...routeData, estimatedDistance: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="estimatedTime">Est. Time (hours)</Label>
                                        <Input
                                            id="estimatedTime"
                                            type="number"
                                            step="0.5"
                                            placeholder="2.5"
                                            value={routeData.estimatedTime}
                                            onChange={(e) => setRouteData({ ...routeData, estimatedTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Route Points */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Route Points
                                </CardTitle>
                                <CardDescription>Define start, end, and waypoints for your route</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startLocation">Start Location</Label>
                                        <Input
                                            id="startLocation"
                                            placeholder="e.g., Main Depot, City Center"
                                            value={routeData.startLocation}
                                            onChange={(e) => setRouteData({ ...routeData, startLocation: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endLocation">End Location</Label>
                                        <Input
                                            id="endLocation"
                                            placeholder="e.g., Distribution Center"
                                            value={routeData.endLocation}
                                            onChange={(e) => setRouteData({ ...routeData, endLocation: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label>Waypoints (Optional)</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addWaypoint}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Waypoint
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {waypoints.map((waypoint, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    placeholder={`Waypoint ${index + 1}`}
                                                    value={waypoint}
                                                    onChange={(e) => updateWaypoint(index, e.target.value)}
                                                />
                                                {waypoints.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeWaypoint(index)}
                                                    >
                                                        <Plus className="h-4 w-4 rotate-45" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vehicle & Optimization */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Vehicle & Optimization
                                </CardTitle>
                                <CardDescription>Configure vehicle requirements and optimization preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                                        <Select value={routeData.vehicleType} onValueChange={(value) => setRouteData({ ...routeData, vehicleType: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select vehicle type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicleTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div>
                                                            <div className="font-medium">{type.label}</div>
                                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="maxStops">Max Stops</Label>
                                        <Input
                                            id="maxStops"
                                            type="number"
                                            placeholder="10"
                                            value={routeData.maxStops}
                                            onChange={(e) => setRouteData({ ...routeData, maxStops: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Optimize For</Label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {optimizationOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${routeData.optimizeFor === option.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                onClick={() => setRouteData({ ...routeData, optimizeFor: option.value })}
                                            >
                                                <div className="font-medium text-sm">{option.label}</div>
                                                <div className="text-xs text-muted-foreground">{option.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Route Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5" />
                                    Route Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">Route Visualization</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Interactive map will appear here showing your route
                                    </p>
                                </div>

                                {routeData.estimatedDistance && routeData.estimatedTime && (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Distance:</span>
                                            <span className="font-medium">{routeData.estimatedDistance} km</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Time:</span>
                                            <span className="font-medium">{routeData.estimatedTime} hrs</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Waypoints:</span>
                                            <span className="font-medium">{waypoints.filter(wp => wp.trim()).length}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Estimated Costs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Estimated Costs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Fuel Cost:</span>
                                    <span className="font-medium">₹{routeData.estimatedDistance ? Math.round(parseFloat(routeData.estimatedDistance) * 8.5) : 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Driver Cost:</span>
                                    <span className="font-medium">₹{routeData.estimatedTime ? Math.round(parseFloat(routeData.estimatedTime) * 200) : 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Vehicle Cost:</span>
                                    <span className="font-medium">₹{routeData.estimatedDistance ? Math.round(parseFloat(routeData.estimatedDistance) * 5) : 0}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold">
                                    <span>Total Estimate:</span>
                                    <span>₹{routeData.estimatedDistance && routeData.estimatedTime ?
                                        Math.round(parseFloat(routeData.estimatedDistance) * 8.5 + parseFloat(routeData.estimatedTime) * 200 + parseFloat(routeData.estimatedDistance) * 5) : 0}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full"
                                    onClick={handleCreateRoute}
                                    disabled={isCreating || !routeData.name || !routeData.startLocation || !routeData.endLocation}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating Route...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Create Route
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSaveAsDraft}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save as Draft
                                        </>
                                    )}
                                </Button>

                                <Button variant="outline" className="w-full">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Auto-Optimize
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}