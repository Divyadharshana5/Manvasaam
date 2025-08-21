"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Phone,
  Mail,
  Calendar,
  Package,
  TrendingUp,
  Users,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";

const farmers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    farmName: "Green Valley Farm",
    location: "Bangalore, Karnataka",
    specialties: ["Vegetables", "Fruits"],
    rating: 4.8,
    totalOrders: 45,
    joinedDate: "2023-03-15",
    phone: "+91 98765 43210",
    email: "rajesh@greenvalley.com",
    products: ["Tomatoes", "Spinach", "Carrots", "Apples"],
    certifications: ["Organic", "Fair Trade"],
    avatar: "/api/placeholder/40/40",
    isActive: true,
    lastDelivery: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    farmName: "Sunrise Organics",
    location: "Chennai, Tamil Nadu",
    specialties: ["Vegetables", "Herbs"],
    rating: 4.6,
    totalOrders: 32,
    joinedDate: "2023-05-20",
    phone: "+91 87654 32109",
    email: "priya@sunriseorganics.com",
    products: ["Spinach", "Coriander", "Mint", "Beetroot"],
    certifications: ["Organic"],
    avatar: "/api/placeholder/40/40",
    isActive: true,
    lastDelivery: "2024-01-14",
  },
  {
    id: "3",
    name: "Suresh Patel",
    farmName: "Happy Cow Dairy",
    location: "Amritsar, Punjab",
    specialties: ["Dairy"],
    rating: 4.7,
    totalOrders: 28,
    joinedDate: "2023-02-10",
    phone: "+91 76543 21098",
    email: "suresh@happycowdairy.com",
    products: ["Milk", "Paneer", "Yogurt", "Butter"],
    certifications: ["Organic", "Animal Welfare"],
    avatar: "/api/placeholder/40/40",
    isActive: true,
    lastDelivery: "2024-01-13",
  },
  {
    id: "4",
    name: "Lakshmi Reddy",
    farmName: "Millet Masters",
    location: "Hyderabad, Andhra Pradesh",
    specialties: ["Millets", "Grains"],
    rating: 4.5,
    totalOrders: 18,
    joinedDate: "2023-07-08",
    phone: "+91 65432 10987",
    email: "lakshmi@milletmasters.com",
    products: ["Finger Millet", "Pearl Millet", "Foxtail Millet"],
    certifications: ["Organic", "Traditional"],
    avatar: "/api/placeholder/40/40",
    isActive: true,
    lastDelivery: "2024-01-12",
  },
  {
    id: "5",
    name: "Arjun Singh",
    farmName: "Hill Station Farms",
    location: "Shimla, Himachal Pradesh",
    specialties: ["Fruits", "Vegetables"],
    rating: 4.9,
    totalOrders: 52,
    joinedDate: "2023-01-25",
    phone: "+91 54321 09876",
    email: "arjun@hillstationfarms.com",
    products: ["Apples", "Pears", "Potatoes", "Cabbage"],
    certifications: ["Organic", "High Altitude"],
    avatar: "/api/placeholder/40/40",
    isActive: true,
    lastDelivery: "2024-01-16",
  },
];

export default function FarmersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<typeof farmers[0] | null>(null);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Farmers</h1>
          <p className="text-muted-foreground">
            Manage relationships with your organic produce suppliers
          </p>
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Add New Farmer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(farmers.reduce((acc, f) => acc + f.rating, 0) / farmers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Supplier quality
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {farmers.reduce((acc, f) => acc + f.totalOrders, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {farmers.filter(f => f.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search farmers, farms, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarmers.map((farmer) => (
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
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{farmer.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {farmer.location}
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
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{farmer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Delivery</p>
                  <p className="font-medium">{farmer.lastDelivery}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={farmer.avatar} />
                          <AvatarFallback>{farmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{farmer.name}</p>
                          <p className="text-sm text-muted-foreground">{farmer.farmName}</p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Contact Information</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {farmer.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {farmer.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {farmer.location}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Farm Details</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Joined: {farmer.joinedDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Rating: {farmer.rating}/5
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {farmer.totalOrders} orders completed
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Available Products</p>
                        <div className="flex flex-wrap gap-1">
                          {farmer.products.map((product) => (
                            <Badge key={product} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Place Order
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No farmers found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or add new farmers to your network
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}