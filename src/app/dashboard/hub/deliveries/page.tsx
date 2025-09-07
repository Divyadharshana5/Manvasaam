"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, MapPin, Clock, CheckCircle, Package, Search, Filter } from "lucide-react";

export default function DeliveriesPage() {
  const deliveries = [
    { id: "DEL001", customer: "Priya Sharma", items: "Organic Tomatoes - 5kg", status: "In Transit", eta: "2:30 PM", distance: "5 km" },
    { id: "DEL002", customer: "Amit Singh", items: "Fresh Spinach - 2kg", status: "Delivered", eta: "Completed", distance: "3 km" },
    { id: "DEL003", customer: "Green Valley Restaurant", items: "Mixed Vegetables - 25kg", status: "Pending", eta: "4:00 PM", distance: "8 km" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-muted-foreground">Track and manage all delivery operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search deliveries..." className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{delivery.id}</CardTitle>
                <Badge variant={delivery.status === 'Delivered' ? 'default' : delivery.status === 'In Transit' ? 'secondary' : 'outline'}>
                  {delivery.status}
                </Badge>
              </div>
              <CardDescription>{delivery.customer}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{delivery.items}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>ETA: {delivery.eta}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{delivery.distance} away</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Track
                </Button>
                <Button size="sm" variant="outline">
                  <Package className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}