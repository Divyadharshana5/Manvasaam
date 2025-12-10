"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Package,
  MapPin,
  ArrowLeft,
  Calendar,
  Clock,
  Route,
  User,
  Phone,
  Navigation,
  Fuel,
  AlertCircle,
  CheckCircle,
  Plus,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NewDeliveryPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handler for scheduling delivery
  const handleScheduleDelivery = async () => {
    setIsScheduling(true);

    // Simulate API call
    try {
      // Collect form data
      const deliveryData = {
        pickupLocation: (
          document.getElementById("pickup-location") as HTMLInputElement
        )?.value,
        deliveryLocation: (
          document.getElementById("delivery-location") as HTMLInputElement
        )?.value,
        deliveryType,
        pickupDate: (document.getElementById("pickup-date") as HTMLInputElement)
          ?.value,
        pickupTime: (document.getElementById("pickup-time") as HTMLInputElement)
          ?.value,
        cargoDetails: (
          document.getElementById("cargo-details") as HTMLTextAreaElement
        )?.value,
        selectedVehicle,
        selectedDriver,
        status: "scheduled",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Scheduling delivery:", deliveryData);

      // Show success message
      alert(
        "Delivery scheduled successfully! Redirecting to delivery details..."
      );

      // Generate a mock delivery ID
      const deliveryId = `DEL-${Date.now().toString().slice(-3)}`;

      // Redirect to delivery details page
      window.location.href = `/dashboard/transport/deliveries/details?id=${deliveryId}`;
    } catch (error) {
      console.error("Error scheduling delivery:", error);
      alert("Failed to schedule delivery. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  // Handler for saving as draft
  const handleSaveAsDraft = async () => {
    setIsSaving(true);

    try {
      // Collect form data
      const draftData = {
        pickupLocation: (
          document.getElementById("pickup-location") as HTMLInputElement
        )?.value,
        deliveryLocation: (
          document.getElementById("delivery-location") as HTMLInputElement
        )?.value,
        deliveryType,
        pickupDate: (document.getElementById("pickup-date") as HTMLInputElement)
          ?.value,
        pickupTime: (document.getElementById("pickup-time") as HTMLInputElement)
          ?.value,
        cargoDetails: (
          document.getElementById("cargo-details") as HTMLTextAreaElement
        )?.value,
        selectedVehicle,
        selectedDriver,
        status: "draft",
        savedAt: new Date().toISOString(),
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Saving draft:", draftData);

      // Show success message
      alert("Draft saved successfully! You can continue editing later.");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const defaultVehicles = [
    {
      id: "TRK-001",
      model: "Tata Ace",
      capacity: "1 Ton",
      fuel: 85,
      status: "available",
    },
    {
      id: "TRK-002",
      model: "Mahindra Bolero",
      capacity: "1.5 Ton",
      fuel: 92,
      status: "available",
    },
    {
      id: "TRK-004",
      model: "Ashok Leyland Dost",
      capacity: "2 Ton",
      fuel: 78,
      status: "available",
    },
  ];

  const defaultDrivers = [
    {
      id: "DRV-001",
      name: "Raj Kumar",
      experience: "5 years",
      rating: 4.8,
      status: "available",
    },
    {
      id: "DRV-002",
      name: "Amit Singh",
      experience: "7 years",
      rating: 4.9,
      status: "available",
    },
    {
      id: "DRV-004",
      name: "Vikram Yadav",
      experience: "6 years",
      rating: 4.7,
      status: "available",
    },
  ];

  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [drivers, setDrivers] = useState(defaultDrivers);

  const searchParams = useSearchParams();
  const mode = searchParams ? searchParams.get("mode") : null;

  useEffect(() => {
    // If in edit mode and id is provided, we could pre-select vehicle/driver
    // For now we just ensure status controls are active in edit mode
  }, [mode]);

  const toggleVehicleStatus = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === "available" ? "unavailable" : "available",
            }
          : v
      )
    );
  };

  const toggleDriverStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === "available" ? "unavailable" : "available",
            }
          : d
      )
    );
  };

  const routes = [
    { name: "City Route A", distance: "45 km", duration: "2.5 hrs", toll: 150 },
    {
      name: "Highway Route B",
      distance: "85 km",
      duration: "4.2 hrs",
      toll: 280,
    },
    {
      name: "Rural Route C",
      distance: "65 km",
      duration: "3.8 hrs",
      toll: 200,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
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
        className="flex items-center gap-4"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/transport">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold tracking-tight">
            Schedule New Delivery
          </h1>
          <p className="text-muted-foreground">
            Create a new delivery assignment for your fleet
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-3"
        variants={itemVariants}
      >
        {/* Delivery Form */}
        <div className="md:col-span-2 space-y-6">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
          >
            <Card className="transition-shadow duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Package className="h-5 w-5" />
                  </motion.div>
                  Delivery Information
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-location">Pickup Location</Label>
                  <Input
                    id="pickup-location"
                    placeholder="e.g., Green Valley Farm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-location">Delivery Location</Label>
                  <Input
                    id="delivery-location"
                    placeholder="e.g., Fresh Market Store"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-type">Delivery Type</Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresh-produce">Fresh Produce</SelectItem>
                    <SelectItem value="dairy">Dairy Products</SelectItem>
                    <SelectItem value="grains">Grains & Cereals</SelectItem>
                    <SelectItem value="mixed">Mixed Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-date">Pickup Date</Label>
                  <Input type="date" id="pickup-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-time">Pickup Time</Label>
                  <Input type="time" id="pickup-time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo-details">Cargo Details</Label>
                <Textarea
                  id="cargo-details"
                  placeholder="Describe the items to be transported (weight, quantity, special handling requirements...)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" />
                Vehicle Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Vehicle</Label>
                <div className="grid gap-3">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVehicle === vehicle.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{vehicle.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {vehicle.model} • {vehicle.capacity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            <span className="text-xs">{vehicle.fuel}%</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              mode === "edit" ? "cursor-pointer" : ""
                            }`}
                            onClick={
                              mode === "edit"
                                ? (e) => {
                                    e.stopPropagation();
                                    toggleVehicleStatus(vehicle.id);
                                  }
                                : undefined
                            }
                            role={mode === "edit" ? "button" : undefined}
                            tabIndex={mode === "edit" ? 0 : undefined}
                          >
                            {vehicle.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Driver Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Driver</Label>
                <div className="grid gap-3">
                  {drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDriver === driver.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDriver(driver.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-sm">{driver.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {driver.experience} experience
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">⭐ {driver.rating}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              mode === "edit" ? "cursor-pointer" : ""
                            }`}
                            onClick={
                              mode === "edit"
                                ? (e) => {
                                    e.stopPropagation();
                                    toggleDriverStatus(driver.id);
                                  }
                                : undefined
                            }
                            role={mode === "edit" ? "button" : undefined}
                            tabIndex={mode === "edit" ? 0 : undefined}
                          >
                            {driver.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Route className="h-5 w-5" />
                Route Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{route.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{route.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Toll: ₹{route.toll}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>₹2,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance Charge:</span>
                  <span>₹450</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Surcharge:</span>
                  <span>₹200</span>
                </div>
                <div className="flex justify-between">
                  <span>Toll Charges:</span>
                  <span>₹150</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Estimate:</span>
                  <span>₹3,300</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  onClick={handleScheduleDelivery}
                  disabled={isScheduling || !selectedVehicle || !selectedDriver}
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Schedule Delivery
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start whitespace-normal"
                  onClick={handleSaveAsDraft}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span>Save as Draft</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/transport/routes">
                    <Navigation className="h-4 w-4 mr-2" />
                    Track Similar Route
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/transport/deliveries/contact">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/transport/notifications">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Set Alerts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
