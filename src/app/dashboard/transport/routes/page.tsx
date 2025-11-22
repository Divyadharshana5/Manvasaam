"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Route,
  MapPin,
  Clock,
  Zap,
  Navigation,
  TrendingUp,
  Loader2,
  CheckCircle,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function RoutesPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [isRunningOptimization, setIsRunningOptimization] = useState(false);
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(true);
  const [trafficUpdatesEnabled, setTrafficUpdatesEnabled] = useState(true);
  const [weatherIntegrationEnabled, setWeatherIntegrationEnabled] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Handler for optimizing all routes
  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);

    toast({
      title: "Starting Optimization",
      description: "Analyzing all routes with AI algorithms...",
    });

    try {
      // Simulate AI optimization process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Optimizing all routes with AI algorithms...");

      // Show completion
      setOptimizationComplete(true);

      toast({
        title: "Optimization Complete!",
        description: "All routes have been optimized for maximum efficiency.",
      });

      setTimeout(() => {
        setOptimizationComplete(false);
      }, 1000);
    } catch (error) {
      console.error("Error optimizing routes:", error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Failed to optimize routes. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setIsOptimizing(false);
      }, 4000);
    }
  };

  // Handler for running single optimization
  const handleRunOptimization = async () => {
    setIsRunningOptimization(true);

    toast({
      title: "Running Optimization",
      description: "Analyzing routes with current settings...",
    });

    try {
      // Simulate optimization process
      await new Promise((resolve) => setTimeout(resolve, 2500));

      console.log("Running route optimization with current settings...");

      toast({
        title: "Optimization Successful!",
        description: "Route efficiency improved by 8.5%",
      });
    } catch (error) {
      console.error("Error running optimization:", error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Failed to run optimization. Please try again.",
      });
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
      assignedVehicle: "TRK-001",
    },
    {
      id: "RT-002",
      name: "Industrial Zone",
      distance: "38.7 km",
      estimatedTime: "1h 15min",
      stops: 12,
      status: "Optimized",
      efficiency: "88%",
      assignedVehicle: "TRK-003",
    },
    {
      id: "RT-003",
      name: "Suburban Loop",
      distance: "42.1 km",
      estimatedTime: "1h 30min",
      stops: 15,
      status: "Planning",
      efficiency: "85%",
      assignedVehicle: "TRK-005",
    },
    {
      id: "RT-004",
      name: "Express Highway",
      distance: "65.3 km",
      estimatedTime: "50 min",
      stops: 4,
      status: "Active",
      efficiency: "95%",
      assignedVehicle: "TRK-002",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Optimized":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (efficiency: string) => {
    const percentage = parseInt(efficiency);
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/transport">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Route Management</h1>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleOptimizeAll}
            disabled={isOptimizing}
            className="flex-1 sm:flex-none"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden xs:inline">{optimizationComplete ? "Completing..." : "Optimizing..."}</span>
                <span className="xs:hidden">...</span>
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Optimize All</span>
                <span className="xs:hidden">Optimize</span>
              </>
            )}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none" asChild>
            <Link href="/dashboard/transport/routes/new">
              <span className="flex items-center">
                <Route className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">New Route</span>
                <span className="xs:hidden">New</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">
              Avg Efficiency
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Distance
            </CardTitle>
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
            <p className="text-xs text-muted-foreground">
              Through optimization
            </p>
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
              <div
                key={route.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
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
                    <span
                      className={`text-sm font-medium ${getEfficiencyColor(
                        route.efficiency
                      )}`}
                    >
                      Efficiency: {route.efficiency}
                    </span>
                  </div>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/transport/routes/${route.id}`)
                    }
                  >
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
                <Badge 
                  className={`cursor-pointer transition-colors ${
                    aiOptimizationEnabled 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setAiOptimizationEnabled(!aiOptimizationEnabled);
                    toast({
                      title: aiOptimizationEnabled ? "AI Optimization Disabled" : "AI Optimization Enabled",
                      description: aiOptimizationEnabled 
                        ? "AI-powered route optimization has been turned off" 
                        : "AI-powered route optimization is now active",
                    });
                  }}
                >
                  {aiOptimizationEnabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Traffic Updates</span>
                <Badge 
                  className={`cursor-pointer transition-colors ${
                    trafficUpdatesEnabled 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setTrafficUpdatesEnabled(!trafficUpdatesEnabled);
                    toast({
                      title: trafficUpdatesEnabled ? "Traffic Updates Disabled" : "Traffic Updates Enabled",
                      description: trafficUpdatesEnabled 
                        ? "Real-time traffic updates have been turned off" 
                        : "Real-time traffic updates are now enabled",
                    });
                  }}
                >
                  {trafficUpdatesEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weather Integration</span>
                <Badge 
                  className={`cursor-pointer transition-colors ${
                    weatherIntegrationEnabled 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setWeatherIntegrationEnabled(!weatherIntegrationEnabled);
                    toast({
                      title: weatherIntegrationEnabled ? "Weather Integration Disabled" : "Weather Integration Enabled",
                      description: weatherIntegrationEnabled 
                        ? "Weather integration has been turned off" 
                        : "Weather integration is now enabled",
                    });
                  }}
                >
                  {weatherIntegrationEnabled ? "Enabled" : "Disabled"}
                </Badge>
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
                <span className="text-sm font-medium text-green-600">
                  94.2%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Delay</span>
                <span className="text-sm font-medium">8.5 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fuel Efficiency Gain</span>
                <span className="text-sm font-medium text-green-600">
                  +12.3%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">
                  4.7/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
