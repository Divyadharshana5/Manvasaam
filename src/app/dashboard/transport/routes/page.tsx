"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Route, MapPin, Clock, Zap, Navigation, TrendingUp, Loader2, CheckCircle, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function RoutesPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [isRunningOptimization, setIsRunningOptimization] = useState(false);

  // Handler for optimizing all routes
  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);
    
    try {
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Optimizing all routes with AI algorithms...');
      
      // Show completion
      setOptimizationComplete(true);
      
      // Show success message
      setTimeout(() => {
        alert('Route optimization completed! All routes have been optimized for maximum efficiency.');
        setOptimizationComplete(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error optimizing routes:', error);
      alert('Failed to optimize routes. Please try again.');
    } finally {
      setTimeout(() => {
        setIsOptimizing(false);
      }, 4000);
    }
  };

  // Handler for running single optimization
  const handleRunOptimization = async () => {
    setIsRunningOptimization(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log('Running route optimization with current settings...');
      
      // Show success message
      alert('Route optimization completed successfully! Efficiency improved by 8.5%');
      
    } catch (error) {
      console.error('Error running optimization:', error);
      alert('Failed to run optimization. Please try again.');
    } finally {
      setIsRunningOptimization(false);
    }
  };

  const routes = [
    {
      id: "RT-001",
      name: "Downtown Circuit",
      distance: "25.4 km",
      estimatedTime: "45 min",
      stops: 8,
      status: "Active",
      efficiency: "92%",
      assignedVehicle: "TRK-001"
    },
    {
      id: "RT-002",
      name: "Industrial Zone",
      distance: "38.7 km", 
      estimatedTime: "1h 15min",
      stops: 12,
      status: "Optimized",
      efficiency: "88%",
      assignedVehicle: "TRK-003"
    },
    {
      id: "RT-003",
      name: "Suburban Loop",
      distance: "42.1 km",
      estimatedTime: "1h 30min",
      stops: 15,
      status: "Planning",
      efficiency: "85%",
      assignedVehicle: "TRK-005"
    },
    {
      id: "RT-004",
      name: "Express Highway",
      distance: "65.3 km",
      estimatedTime: "50 min",
      stops: 4,
      status: "Active",
      efficiency: "95%",
      assignedVehicle: "TRK-002"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Optimized": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (efficiency: string) => {
    const percentage = parseInt(efficiency);
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Route Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleOptimizeAll}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {optimizationComplete ? "Completing..." : "Optimizing..."}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Optimize All
              </>
            )}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/dashboard/transport/routes/new">
              <Route className="mr-2 h-4 w-4" />
              New Route
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847 km</div>
            <p className="text-xs text-muted-foreground">Daily coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127L</div>
            <p className="text-xs text-muted-foreground">Through optimization</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{route.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {route.id} • Vehicle: {route.assignedVehicle}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-3 w-3" />
                      {route.distance} • {route.stops} stops
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Est. time: {route.estimatedTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${getEfficiencyColor(route.efficiency)}`}>
                      Efficiency: {route.efficiency}
                    </span>
                  </div>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI-Powered Optimization</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Traffic Updates</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weather Integration</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleRunOptimization}
                disabled={isRunningOptimization}
              >
                {isRunningOptimization ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Optimization
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">On-time Delivery Rate</span>
                <span className="text-sm font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Delay</span>
                <span className="text-sm font-medium">8.5 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fuel Efficiency Gain</span>
                <span className="text-sm font-medium text-green-600">+12.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">4.7/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}