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
  Building2,
  Filter,
  Send,
  Leaf,
  Truck,
} from "lucide-react";

const farmers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    farmName: "Green Valley Organic Farm",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    experience: "10 years",
    specialties: ["Organic Vegetables", "Leafy Greens", "Herbs"],
    certifications: ["Organic", "Fair Trade"],
    capacity: "500kg/month",
    phone: "+91 98765 43210",
    verified: true,
    lastActive: "2024-01-16",
  },
  {
    id: "2",
    name: "Priya Sharma",
    farmName: "Sunrise Organic Farm",
    location: "Nashik, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.9,
    experience: "8 years",
    specialties: ["Seasonal Fruits", "Root Vegetables", "Spices"],
    certifications: ["Organic", "Sustainable"],
    capacity: "300kg/month",
    phone: "+91 87654 32109",
    verified: true,
    lastActive: "2024-01-15",
  },
];

const hubs = [
  {
    id: "1",
    name: "Maharashtra Fresh Hub",
    type: "Distribution Center",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.7,
    farmers: 150,
    services: ["Storage", "Cold Chain", "Distribution", "Quality Control"],
    coverage: ["Mumbai", "Pune", "Nashik", "Thane"],
    capacity: "10,000kg/day",
    phone: "+91 76543 21098",
    verified: true,
    deliveryTime: "Same day",
  },
  {
    id: "2",
    name: "Organic Supply Chain Hub",
    type: "Processing & Distribution",
    location: "Bangalore, Karnataka",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    farmers: 200,
    services: ["Processing", "Packaging", "Logistics", "Traceability"],
    coverage: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
    capacity: "15,000kg/day",
    phone: "+91 65432 10987",
    verified: true,
    deliveryTime: "Next day",
  },
];

export default function RestaurantMatchmakingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("farmers");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Network</h1>
          <p className="text-muted-foreground">
            Connect with organic farmers and distribution hubs for your restaurant
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="farmers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contract Farmers ({farmers.length})
          </TabsTrigger>
          <TabsTrigger value="hubs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Distribution Hubs ({hubs.length})
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
                    {farmer.verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
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
                    <span>{farmer.experience}</span>
                    <span>{farmer.capacity}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {farmer.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {farmer.certifications.map((cert) => (
                        <Badge key={cert} className="text-xs bg-green-100 text-green-800">
                          <Leaf className="mr-1 h-3 w-3" />
                          {cert}
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
                            Discuss organic produce requirements and supply agreements.
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
        </TabsContent>        {
/* Hubs Tab */}
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
                          <Truck className="mr-1 h-3 w-3" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Delivery: </span>
                    <span className="text-green-600">{hub.deliveryTime}</span>
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
                            Discuss distribution partnerships and logistics solutions.
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
      </Tabs>
    </div>
  );
}