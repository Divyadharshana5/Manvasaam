"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/farmer-animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  X,
} from "lucide-react";

const transportServices = [
  {
    id: "1",
    name: "Swift Logistics",
    type: "Transport Company",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    completedTrips: 250,
    vehicleTypes: ["Refrigerated Truck", "Mini Truck", "Tempo"],
    phone: "+91 98765 43210",
    lastActive: "2024-01-16",
    verified: true,
    capacity: "5 Ton",
    pricePerKm: "₹15",
    coverage: ["Maharashtra", "Gujarat", "Karnataka"],
  },
  {
    id: "2",
    name: "Green Transport Co.",
    type: "Transport Company",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.9,
    completedTrips: 320,
    vehicleTypes: ["Cold Storage Truck", "Refrigerated Van"],
    phone: "+91 87654 32109",
    lastActive: "2024-01-16",
    verified: true,
    capacity: "3 Ton",
    pricePerKm: "₹18",
    coverage: ["Maharashtra", "Goa"],
  },
  {
    id: "3",
    name: "FreshMove Logistics",
    type: "Transport Company",
    location: "Nashik, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.7,
    completedTrips: 180,
    vehicleTypes: ["Refrigerated Truck", "Open Truck"],
    phone: "+91 76543 21098",
    lastActive: "2024-01-15",
    verified: true,
    capacity: "7 Ton",
    pricePerKm: "₹12",
    coverage: ["Maharashtra", "Madhya Pradesh"],
  },
];

const drivers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    type: "Independent Driver",
    location: "Mumbai, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.6,
    completedTrips: 85,
    vehicleType: "Refrigerated Mini Truck",
    phone: "+91 65432 10987",
    lastActive: "2024-01-16",
    verified: true,
    capacity: "2 Ton",
    pricePerKm: "₹10",
    experience: "5 years",
    availability: "Available Now",
  },
  {
    id: "2",
    name: "Suresh Patil",
    type: "Independent Driver",
    location: "Pune, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.8,
    completedTrips: 120,
    vehicleType: "Cold Storage Van",
    phone: "+91 54321 09876",
    lastActive: "2024-01-16",
    verified: true,
    capacity: "1.5 Ton",
    pricePerKm: "₹12",
    experience: "7 years",
    availability: "Available Now",
  },
  {
    id: "3",
    name: "Amit Singh",
    type: "Independent Driver",
    location: "Nashik, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.5,
    completedTrips: 95,
    vehicleType: "Open Truck",
    phone: "+91 43210 98765",
    lastActive: "2024-01-15",
    verified: true,
    capacity: "3 Ton",
    pricePerKm: "₹8",
    experience: "4 years",
    availability: "Available from Tomorrow",
  },
  {
    id: "4",
    name: "Vikram Deshmukh",
    type: "Independent Driver",
    location: "Aurangabad, Maharashtra",
    avatar: "/api/placeholder/40/40",
    rating: 4.9,
    completedTrips: 150,
    vehicleType: "Refrigerated Truck",
    phone: "+91 32109 87654",
    lastActive: "2024-01-16",
    verified: true,
    capacity: "4 Ton",
    pricePerKm: "₹14",
    experience: "8 years",
    availability: "Available Now",
  },
];

export default function FarmerMatchmakingPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("transport");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    verified: false,
    minRating: 0,
    location: "",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t?.matchmaking?.title ?? "Find Transport Services"}
          </h1>
          <p className="text-muted-foreground">
            {t?.matchmaking?.desc ??
              "Connect with transport companies and drivers for your produce delivery"}
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div className="flex items-center gap-4" variants={itemVariants}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            placeholder={
              t?.matchmaking?.searchPlaceholder ??
              "Search by name, location, or requirements..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className={
            filters.verified || filters.minRating > 0 || filters.location
              ? "border-green-500 bg-green-50"
              : ""
          }
        >
          <Filter className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Filter Dialog */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[2147483600]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl ring-2 ring-green-500/40 border border-green-200 animate-in zoom-in-95">
              <div className="sticky top-0 z-10 flex items-start justify-between p-4 border-b bg-white/90 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold">
                    {t?.filters?.title ?? "Filter Results"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t?.filters?.desc ?? "Refine your search"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Verified Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.verified}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        verified: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="verified"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t?.filters?.verifiedOnly ?? "Show verified only"}
                  </Label>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Minimum Rating</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="focus:ring-green-500"
                    />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Maharashtra, Mumbai..."
                    value={filters.location}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 p-4 border-t bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilters({ verified: false, minRating: 0, location: "" });
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="animate-fade-in-up stagger-2"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Transport Companies ({transportServices.length})
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Independent Drivers ({drivers.length})
          </TabsTrigger>
        </TabsList>
        {/* Transport Companies Tab */}
        <TabsContent value="transport" className="space-y-4 tab-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transportServices.map((transport, index) => (
              <Card
                key={transport.id}
                className={`overflow-hidden product-card card-glow stagger-${Math.min(
                  index + 1,
                  6
                )}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={transport.avatar} />
                        <AvatarFallback>
                          <Truck className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {transport.name}
                        </CardTitle>
                        <CardDescription>{transport.type}</CardDescription>
                      </div>
                    </div>
                    {transport.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {transport.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{transport.rating}</span>
                    </div>
                    <span>{transport.completedTrips} trips</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{transport.capacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-semibold">{transport.pricePerKm}/km</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Vehicle Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {transport.vehicleTypes.map((vehicle) => (
                        <Badge
                          key={vehicle}
                          variant="secondary"
                          className="text-xs"
                        >
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Coverage:</p>
                    <div className="flex flex-wrap gap-1">
                      {transport.coverage.map((area) => (
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
                          <DialogTitle>Chat with {transport.name}</DialogTitle>
                          <DialogDescription>
                            Discuss transport requirements and pricing.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="h-64 border rounded-lg p-4 bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center mt-20">
                              Chat interface would be implemented here
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              className="flex-1"
                            />
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
        {/* Independent Drivers Tab */}
        <TabsContent value="drivers" className="space-y-4 tab-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver, index) => (
              <Card
                key={driver.id}
                className={`overflow-hidden product-card card-glow stagger-${Math.min(
                  index + 1,
                  6
                )}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={driver.avatar} />
                        <AvatarFallback>
                          {driver.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <CardDescription>{driver.type}</CardDescription>
                      </div>
                    </div>
                    {driver.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {driver.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating}</span>
                    </div>
                    <span>{driver.completedTrips} trips</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{driver.capacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-semibold">{driver.pricePerKm}/km</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Vehicle Type:</p>
                    <Badge variant="secondary" className="text-xs">
                      {driver.vehicleType}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-semibold">{driver.experience}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          driver.availability === "Available Now"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          driver.availability === "Available Now"
                            ? "bg-green-600"
                            : ""
                        }
                      >
                        {driver.availability}
                      </Badge>
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
                          <DialogTitle>Chat with {driver.name}</DialogTitle>
                          <DialogDescription>
                            Discuss transport requirements and schedule.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="h-64 border rounded-lg p-4 bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center mt-20">
                              Chat interface would be implemented here
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              className="flex-1"
                            />
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
    </motion.div>
  );
}
