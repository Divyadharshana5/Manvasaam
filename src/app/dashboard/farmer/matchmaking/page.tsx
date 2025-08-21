"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Phone,
  Video,
  ShoppingCart,
  Building2,
  Users,
  Truck,
  Filter,
  Send,
} from "lucide-react";

const customers = [
  {
    id: "1",
    name: "Amit Sharma",
    type: "Individual Customer",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    orders: 25,
    preferences: ["Organic Vegetables", "Fresh Fruits"],
    phone: "+91 98765 43210",
    lastOrder: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    name: "Priya Patel",
    type: "Family Customer",
    location: "Ahmedabad, Gujarat",
    avatar: "/api/placeholder/40/40",
    rating: 4.6,
    orders: 18,
    preferences: ["Dairy Products", "Millets"],
    phone: "+91 87654 32109",
    lastOrder: "2024-01-14",
    verified: true,
  },
];

const restaurants = [
  {
    id: "1",
    name: "The Fresh Table",
    type: "Organic Restaurant",
    location: "Bangalore, Karnataka",
    avatar: "/api/placeholder/40/40",
    rating: 4.9,
    orders: 45,
    cuisine: "Farm-to-Table",
    requirements: ["Organic Vegetables", "Fresh Herbs", "Seasonal Fruits"],
    phone: "+91 76543 21098",
    lastOrder: "2024-01-16",
    verified: true,
    monthlyVolume: "500kg",
  },
  {
    id: "2",
    name: "Green Garden Cafe",
    type: "Vegetarian Restaurant",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.7,
    orders: 32,
    cuisine: "Vegetarian",
    requirements: ["Leafy Greens", "Root Vegetables", "Dairy"],
    phone: "+91 65432 10987",
    lastOrder: "2024-01-15",
    verified: true,
    monthlyVolume: "300kg",
  },
];

const hubs = [
  {
    id: "1",
    name: "Maharashtra Organic Hub",
    type: "Distribution Hub",
    location: "Nashik, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    farmers: 150,
    coverage: ["Mumbai", "Pune", "Nashik", "Aurangabad"],
    services: ["Storage", "Processing", "Distribution"],
    phone: "+91 54321 09876",
    lastActivity: "2024-01-16",
    verified: true,
    capacity: "10,000kg/month",
  },
  {
    id: "2",
    name: "South India Fresh Hub",
    type: "Processing Hub",
    location: "Chennai, Tamil Nadu",
    avatar: "/api/placeholder/40/40",
    rating: 4.6,
    farmers: 200,
    coverage: ["Chennai", "Bangalore", "Coimbatore", "Madurai"],
    services: ["Processing", "Packaging", "Quality Control"],
    phone: "+91 43210 98765",
    lastActivity: "2024-01-15",
    verified: true,
    capacity: "15,000kg/month",
  },
];

export default function FarmerMatchmakingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matchmaking</h1>
          <p className="text-muted-foreground">
            Connect with customers, restaurants, and distribution hubs
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers ({customers.length})
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Restaurants ({restaurants.length})
          </TabsTrigger>
          <TabsTrigger value="hubs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hubs ({hubs.length})
          </TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                        <CardDescription>{customer.type}</CardDescription>
                      </div>
                    </div>
                    {customer.verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {customer.location}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{customer.rating}</span>
                    </div>
                    <span>{customer.orders} orders</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Preferences:</p>
                    <div className="flex flex-wrap gap-1">
                      {customer.preferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Chat with {customer.name}</DialogTitle>
                          <DialogDescription>
                            Start a conversation to discuss your products and availability.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="h-64 border rounded-lg p-4 bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center mt-20">
                              Chat interface would be implemented here
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Type your message..." className="flex-1" />
                            <Button size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>        {/*
 Restaurants Tab */}
        <TabsContent value="restaurants" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={restaurant.avatar} />
                        <AvatarFallback>{restaurant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                        <CardDescription>{restaurant.cuisine}</CardDescription>
                      </div>
                    </div>
                    {restaurant.verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {restaurant.location}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <span>{restaurant.orders} orders</span>
                    <span>{restaurant.monthlyVolume}/month</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.requirements.map((req) => (
                        <Badge key={req} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Chat with {restaurant.name}</DialogTitle>
                          <DialogDescription>
                            Discuss bulk orders and supply agreements.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="h-64 border rounded-lg p-4 bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center mt-20">
                              Chat interface would be implemented here
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Type your message..." className="flex-1" />
                            <Button size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Video className="mr-2 h-4 w-4" />
                      Video Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Hubs Tab */}
        <TabsContent value="hubs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hubs.map((hub) => (
              <Card key={hub.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={hub.avatar} />
                        <AvatarFallback>{hub.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{hub.name}</CardTitle>
                        <CardDescription>{hub.type}</CardDescription>
                      </div>
                    </div>
                    {hub.verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {hub.location}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{hub.rating}</span>
                    </div>
                    <span>{hub.farmers} farmers</span>
                    <span>{hub.capacity}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {hub.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Coverage Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {hub.coverage.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Chat with {hub.name}</DialogTitle>
                          <DialogDescription>
                            Discuss partnership opportunities and logistics.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="h-64 border rounded-lg p-4 bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center mt-20">
                              Chat interface would be implemented here
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Type your message..." className="flex-1" />
                            <Button size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}