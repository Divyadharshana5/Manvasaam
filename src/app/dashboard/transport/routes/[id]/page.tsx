"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Route, MapPin, Clock } from "lucide-react";

export default function RouteDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  // Mock route data - replace with real API call when available
  const route = {
    id,
    name: id === "RT-001" ? "Downtown Circuit" : "Route " + id,
    distance: "25.4 km",
    estimatedTime: "45 min",
    stops: 8,
    status: "Active",
    efficiency: "92%",
    assignedVehicle: "TRK-001",
  };

  return (
    <div className="min-h-screen w-full overflow-auto p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/transport/routes" className="inline-flex">
          <Button variant="outline" size="icon" asChild>
            <span>
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Route Details</h1>
          <p className="text-muted-foreground">
            Overview for {route.name} ({route.id})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            {route.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Route ID</span>
              <span className="font-medium">{route.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Distance</span>
              <span className="font-medium">{route.distance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Estimated Time</span>
              <span className="font-medium">{route.estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Stops</span>
              <span className="font-medium">{route.stops}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Assigned Vehicle</span>
              <span className="font-medium">{route.assignedVehicle}</span>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <Link
                href={`/dashboard/transport/routes/${route.id}/edit`}
                className="flex-1"
              >
                <Button className="w-full">Edit Route</Button>
              </Link>
              <Link
                href={`/dashboard/transport/deliveries/tracking?id=${route.assignedVehicle}`}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Track Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
