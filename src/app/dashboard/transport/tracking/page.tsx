"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Fuel, Clock, Truck, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FleetTrackingPage() {
  const vehicles = [
    {
      id: "TRK-001",
      driver: "John Smith",
      location: "Downtown Area",
      status: "Active",
      speed: "45 km/h",
      fuel: "75%",
      lastUpdate: "2 min ago",
    },
    {
      id: "TRK-002",
      driver: "Sarah Johnson",
      location: "Highway 101",
      status: "Active",
      speed: "80 km/h",
      fuel: "60%",
      lastUpdate: "1 min ago",
    },
    {
      id: "TRK-003",
      driver: "Mike Wilson",
      location: "Depot",
      status: "Idle",
      speed: "0 km/h",
      fuel: "90%",
      lastUpdate: "5 min ago",
    },
    {
      id: "TRK-004",
      driver: "Lisa Brown",
      location: "North District",
      status: "Active",
      speed: "35 km/h",
      fuel: "40%",
      lastUpdate: "3 min ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Idle":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFuelColor = (fuel: string) => {
    const percentage = parseInt(fuel);
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/transport">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Fleet Tracking</h1>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/transport/deliveries/tracking">
            <Navigation className="mr-2 h-4 w-4" />
            Live Map View
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vehicles
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Out of 15 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52 km/h</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fuel Efficiency
            </CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5L</div>
            <p className="text-xs text-muted-foreground">Per 100km average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Distance
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247 km</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{vehicle.id}</span>
                    <span className="text-sm text-muted-foreground">
                      Driver: {vehicle.driver}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-3 w-3" />
                      {vehicle.location}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Speed: {vehicle.speed}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-medium ${getFuelColor(
                        vehicle.fuel
                      )}`}
                    >
                      Fuel: {vehicle.fuel}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {vehicle.lastUpdate}
                    </div>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Interactive map view would be displayed here
              </p>
              <Button variant="outline" className="mt-2">
                Load Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
