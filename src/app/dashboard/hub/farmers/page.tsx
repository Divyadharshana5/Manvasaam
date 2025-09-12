"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Phone, MessageCircle, MapPin, Package, Search, Plus, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FarmersPage() {
  const [searchValue, setSearchValue] = useState("");
  
  const clearSearch = () => {
    setSearchValue("");
  };
  
    
    
    
  const farmers = [
    { id: 1, name: "Rajesh Kumar", location: "Pune, Maharashtra", products: "Vegetables, Fruits", status: "Active", phone: "+91 98765 43210", deliveries: 45 },
    { id: 2, name: "Sunita Devi", location: "Nashik, Maharashtra", products: "Organic Vegetables", status: "Active", phone: "+91 87654 32109", deliveries: 32 },
    { id: 3, name: "Amit Patel", location: "Aurangabad, Maharashtra", products: "Dairy, Grains", status: "Inactive", phone: "+91 76543 21098", deliveries: 18 }
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Farmers</h1>
          <p className="text-muted-foreground">Manage farmer network and relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Farmer
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search farmers..." 
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farmers.map((farmer) => (
          <Card key={farmer.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{farmer.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {farmer.location}
                  </CardDescription>
                </div>
                <Badge variant={farmer.status === 'Active' ? 'default' : 'secondary'}>
                  {farmer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Products</p>
                  <p className="text-sm text-muted-foreground">{farmer.products}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Deliveries</p>
                  <p className="text-sm text-muted-foreground">{farmer.deliveries} completed</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={{ pathname: "/dashboard/contact", query: { mode: "chat", with: farmer.name, phone: farmer.phone } }}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={{ pathname: "/dashboard/contact", query: { mode: "call", with: farmer.name, phone: farmer.phone } }}>
                      <Phone className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={{ pathname: "/dashboard/hub/matchmaking", query: { with: farmer.name, context: "packages" } }}>
                      <Package className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}