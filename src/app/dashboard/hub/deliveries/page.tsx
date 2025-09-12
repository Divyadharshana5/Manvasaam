"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, MapPin, Clock, CheckCircle, Package, Search, Filter, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DeliveriesPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const clearSearch = () => {
    setSearchValue("");
  };
  
  const handlePackageClick = (deliveryId: string) => {
    alert(`Package details for ${deliveryId}`);
  };
  
  const deliveries = [
    { id: "DEL001", orderId: "ORD002", customer: "Priya Sharma", items: "Organic Tomatoes - 5kg", status: "In Transit", eta: "2:30 PM", distance: "5 km" },
    { id: "DEL002", orderId: "ORD003", customer: "Amit Singh", items: "Fresh Spinach - 2kg", status: "Delivered", eta: "Completed", distance: "3 km" },
    { id: "DEL003", orderId: "ORD005", customer: "Green Valley Restaurant", items: "Mixed Vegetables - 25kg", status: "Pending", eta: "4:00 PM", distance: "8 km" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-muted-foreground">Track and manage all delivery operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilter(!showFilter)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/hub/orders/new">
              <Truck className="mr-2 h-4 w-4" />
              New Delivery
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search deliveries..." 
            className="pl-10 pr-10" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showFilter && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Distance</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">All Distances</option>
                  <option value="0-5">0-5 km</option>
                  <option value="5-10">5-10 km</option>
                  <option value="10+">10+ km</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Customer Type</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">All Customers</option>
                  <option value="individual">Individual</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm">Apply Filters</Button>
              <Button size="sm" variant="outline" onClick={() => setShowFilter(false)}>Close</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              <div className="flex justify-between items-center mt-4">
                <Button size="sm" variant="outline" onClick={() => handlePackageClick(delivery.id)}>
                  <Package className="h-4 w-4" />
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/track?orderId=${delivery.orderId}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Track
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}