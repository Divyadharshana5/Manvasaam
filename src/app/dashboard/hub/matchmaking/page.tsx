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
  Users,
  ShoppingCart,
  Filter,
  Send,
  Leaf,
  Package,
} from "lucide-react";

const farmers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    farmName: "Green Valley Farm",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    farmSize: "15 acres",
    products: ["Tomatoes", "Spinach", "Carrots", "Onions"],
    monthlyCapacity: "2000kg",
    phone: "+91 98765 43210",
    verified: true,
    organic: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    farmName: "Sunrise Organics",
    location: "Nashik, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.9,
    farmSize: "20 acres",
    products: ["Grapes", "Pomegranates", "Mangoes", "Herbs"],
    monthlyCapacity: "3000kg",
    phone: "+91 87654 32109",
    verified: true,
    organic: true,
  },
];

const restaurants = [
  {
    id: "1",
    name: "The Fresh Table",
    type: "Farm-to-Table Restaurant",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.7,
    cuisine: "Organic Continental",
    requirements: ["Organic Vegetables", "Fresh Herbs", "Seasonal Fruits"],
    monthlyDemand: "500kg",
    phone: "+91 76543 21098",
    verified: true,
  },
  {
    id: "2",
    name: "Green Garden Cafe",
    type: "Vegetarian Restaurant",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    cuisine: "Indian Vegetarian",
    requirements: ["Leafy Greens", "Root Vegetables", "Spices"],
    monthlyDemand: "300kg",
    phone: "+91 65432 10987",
    verified: true,
  },
];

const customers = [
  {
    id: "1",
    name: "Organic Food Co-op",
    type: "Bulk Buyer",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.6,
    memberCount: 500,
    preferences: ["Certified Organic", "Local Produce", "Seasonal Items"],
    monthlyVolume: "1000kg",
    phone: "+91 54321 09876",
    verified: true,
  },
  {
    id: "2",
    name: "Fresh Market Chain",
    type: "Retail Chain",
    location: "Bangalore, Karnataka",
    avatar: "/api/placeholder/40/40",
    rating: 4.5,
    stores: 25,
    preferences: ["Quality Produce", "Consistent Supply", "Competitive Pricing"],
    monthlyVolume: "5000kg",
    phone: "+91 43210 98765",
    verified: true,
  },
];

export default function HubMatchmakingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("farmers");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Partners</h1>
          <p className="text-muted-foreground">
            Connect farmers with restaurants and customers through your hub
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or products..."
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
          <TabsTrigger value="farmers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Farmers ({farmers.length})
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Restaurants ({restaurants.length})
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Bulk Buyers ({customers.length})
          </TabsTrigger>
        </TabsList>

        {/* Farmers Tab */}
        <TabsContent value="farmers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer) => (
              <Card key={farmer.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={farmer.avatar} />
                        <AvatarFallback>{farmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{farmer.name}</CardTitle>
                        <CardDescription>{farmer.farmName}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {farmer.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                      {farmer.organic && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Leaf className="mr-1 h-3 w-3" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {farmer.location}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{farmer.rating}</span>
                    </div>
                    <span>{farmer.farmSize}</span>
                    <span>{farmer.monthlyCapacity}/month</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {farmer.products.map((product) => (
                        <Badge key={product} variant="secondary" className="text-xs">
                          {product}
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
                          <DialogTitle>Chat with {farmer.name}</DialogTitle>
                          <DialogDescription>
                            Discuss supply partnerships and logistics coordination.
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
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Video className="mr-2 h-4 w-4" />
                              Video Call
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="mr-2 h-4 w-4" />
                              Voice Call
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
       {/* Restaurants Tab */}
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
                        <CardDescription>{restaurant.type}</CardDescription>
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
                    <span>{restaurant.cuisine}</span>
                    <span>{restaurant.monthlyDemand}/month</span>
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
                            Discuss supply requirements and delivery schedules.
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
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Video className="mr-2 h-4 w-4" />
                              Video Call
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="mr-2 h-4 w-4" />
                              Voice Call
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
                    <span>
                      {customer.memberCount ? `${customer.memberCount} members` : `${customer.stores} stores`}
                    </span>
                    <span>{customer.monthlyVolume}/month</span>
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
                            Discuss bulk supply opportunities and pricing.
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
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Video className="mr-2 h-4 w-4" />
                              Video Call
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="mr-2 h-4 w-4" />
                              Voice Call
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