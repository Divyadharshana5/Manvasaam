"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Edit3, Save, Truck, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// Removed shadcn Dialog in favor of a custom modal for this page to resolve stacking issues
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

interface TransportProfile {
  username?: string;
  companyName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  fleetSize?: string;
  vehicleTypes?: string;
  establishedYear?: string;
  licenseNumber?: string;
  website?: string;
  description?: string;
  specialties?: string;
  serviceAreas?: string[];
  operatingHours?: string;
  userType?: string;
  createdAt?: string;
  verified?: boolean;
  photoURL?: string;
  lastActive?: string;
}

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  alternatePhone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid pincode")
    .optional()
    .or(z.literal("")),
  landmark: z.string().optional(),
  fleetSize: z.string().optional(),
  vehicleTypes: z.string().optional(),
  establishedYear: z.string().optional(),
  licenseNumber: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  specialties: z.string().optional(),
  operatingHours: z.string().optional(),
});

export default function TransportProfilePage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const [transportProfile, setTransportProfile] =
    useState<TransportProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Force demo user if no user is found
  const effectiveUser = user || {
    uid: "demo-transport-1",
    email: "transport@demo.com",
    displayName: "Demo Transport User",
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      companyName: "",
      ownerName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      fleetSize: "",
      vehicleTypes: "",
      establishedYear: "",
      licenseNumber: "",
      website: "",
      description: "",
      specialties: "",
      operatingHours: "",
    },
  });

  const fetchTransportProfile = async () => {
    // Show demo data immediately for fast response
    const demoProfile: TransportProfile = {
      username: "Amit Singh",
      companyName: "Swift Logistics & Transport",
      ownerName: "Amit Singh",
      email: effectiveUser.email || "transport@demo.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      address: "Transport Hub, Pune-Mumbai Highway",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      landmark: "Near Industrial Area",
      fleetSize: "25 Vehicles",
      vehicleTypes: "Refrigerated Trucks, Mini Trucks, Tempo",
      establishedYear: "2012",
      licenseNumber: "TL-2024-001234",
      website: "www.swiftlogistics.com",
      description:
        "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Specializing in cold chain transport and express delivery services.",
      specialties:
        "Cold Chain Transport, Express Delivery, Fresh Produce Logistics",
      serviceAreas: ["Mumbai", "Pune", "Nashik", "Aurangabad", "Kolhapur"],
      operatingHours: "24/7 Service Available",
      userType: "transport",
      verified: true,
      lastActive: new Date().toISOString(),
    };

    setTransportProfile(demoProfile);
    setProfileLoading(false);

    // Fetch from API in background
    try {
      const response = await fetch(`/api/users/${effectiveUser.uid}`);

      if (response.ok) {
        const data = await response.json();

        const enhancedProfile: TransportProfile = {
          ...data,
          username: data.username || "Amit Singh",
          companyName: data.companyName || "Swift Logistics & Transport",
          ownerName: data.ownerName || data.username || "Amit Singh",
          email: data.email || effectiveUser.email,
          phone: data.phone || "+91 98765 43210",
          alternatePhone: data.alternatePhone || "+91 98765 43211",
          address: data.address || "Transport Hub, Pune-Mumbai Highway",
          city: data.city || "Pune",
          state: data.state || "Maharashtra",
          pincode: data.pincode || "411001",
          landmark: data.landmark || "Near Industrial Area",
          fleetSize: data.fleetSize || "25 Vehicles",
          vehicleTypes:
            data.vehicleTypes || "Refrigerated Trucks, Mini Trucks, Tempo",
          establishedYear: data.establishedYear || "2012",
          licenseNumber: data.licenseNumber || "TL-2024-001234",
          website: data.website || "www.swiftlogistics.com",
          description:
            data.description ||
            "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Specializing in cold chain transport and express delivery services.",
          specialties:
            data.specialties ||
            "Cold Chain Transport, Express Delivery, Fresh Produce Logistics",
          serviceAreas: data.serviceAreas || [
            "Mumbai",
            "Pune",
            "Nashik",
            "Aurangabad",
            "Kolhapur",
          ],
          operatingHours: data.operatingHours || "24/7 Service Available",
          userType: data.userType || "transport",
          createdAt: data.createdAt,
          verified: true,
          photoURL: data.photoURL,
          lastActive: new Date().toISOString(),
        };

        setTransportProfile(enhancedProfile);
      }
    } catch (error) {
      // Keep demo data if API fails
      console.log("Using demo data - API unavailable");
    }
  };

  useEffect(() => {
    fetchTransportProfile();
  }, [effectiveUser.uid]);

  useEffect(() => {
    if (transportProfile && isEditDialogOpen) {
      form.reset({
        username: transportProfile.username || "",
        companyName: transportProfile.companyName || "",
        ownerName: transportProfile.ownerName || "",
        email: transportProfile.email || "",
        phone: transportProfile.phone || "",
        alternatePhone: transportProfile.alternatePhone || "",
        address: transportProfile.address || "",
        city: transportProfile.city || "",
        state: transportProfile.state || "",
        pincode: transportProfile.pincode || "",
        landmark: transportProfile.landmark || "",
        fleetSize: transportProfile.fleetSize || "",
        vehicleTypes: transportProfile.vehicleTypes || "",
        establishedYear: transportProfile.establishedYear || "",
        licenseNumber: transportProfile.licenseNumber || "",
        website: transportProfile.website || "",
        description: transportProfile.description || "",
        specialties: transportProfile.specialties || "",
        operatingHours: transportProfile.operatingHours || "",
      });
    }
  }, [transportProfile, isEditDialogOpen, form]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!effectiveUser || !effectiveUser.uid) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "User not properly authenticated",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${effectiveUser.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          responseData.message || `Failed to update transport profile`
        );
      }

      setTransportProfile((prev) => (prev ? { ...prev, ...values } : null));

      toast({
        title: "Profile Updated",
        description: "Your transport information has been saved successfully.",
        duration: 3000,
      });

      await fetchTransportProfile();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Transport profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const loading = profileLoading;

  const renderTransportDetails = () => {
    const profileData = transportProfile || {
      username: "Loading...",
      companyName: "Loading...",
      email: effectiveUser?.email || "Loading...",
      phone: "Loading...",
      address: "Loading...",
      verified: false,
    };

    return (
      <div className="space-y-8 w-full">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Company Name
              </label>
              <p className="text-base">
                {profileData.companyName || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Owner Name
              </label>
              <p className="text-base">
                {profileData.ownerName ||
                  profileData.username ||
                  "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Fleet Size
              </label>
              <p className="text-base">
                {profileData.fleetSize || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Established Year
              </label>
              <p className="text-base">
                {profileData.establishedYear || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base">{profileData.email || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Primary Phone
              </label>
              <p className="text-base">{profileData.phone || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Alternate Phone
              </label>
              <p className="text-base">
                {profileData.alternatePhone || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Website
              </label>
              <p className="text-base">
                {profileData.website || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Office Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <p className="text-base">
                {profileData.address || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-base">{profileData.city || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-base">
                {profileData.state || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Pincode
              </label>
              <p className="text-base">
                {profileData.pincode || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Landmark
              </label>
              <p className="text-base">
                {profileData.landmark || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Transport Details */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Transport Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Vehicle Types
              </label>
              <p className="text-base">
                {profileData.vehicleTypes || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                License Number
              </label>
              <p className="text-base">
                {profileData.licenseNumber || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Operating Hours
              </label>
              <p className="text-base">
                {profileData.operatingHours || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(profileData.description || profileData.specialties) && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
              Additional Information
            </h3>
            <div className="space-y-4">
              {profileData.description && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    About Company
                  </label>
                  <p className="text-base text-gray-700">
                    {profileData.description}
                  </p>
                </div>
              )}
              {profileData.specialties && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Services & Specialties
                  </label>
                  <p className="text-base text-gray-700">
                    {profileData.specialties}
                  </p>
                </div>
              )}
              {profileData.serviceAreas &&
                profileData.serviceAreas.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Service Areas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.serviceAreas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Status:{" "}
              {profileData.verified
                ? "Verified Transport Partner"
                : "Pending Verification"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transport Profile
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your transport company information
            </p>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => {
                console.log("[TransportProfile] Open modal");
                setIsEditDialogOpen(true);
              }}
              className="relative z-auto"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </div>
        </div>

        {/* Modal Overlay: Rendered at page level for maximum stacking reliability */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 z-[2147483600]">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
              onClick={() => {
                console.log("[TransportProfile] Backdrop click close");
                setIsEditDialogOpen(false);
              }}
            />
            {/* Modal Panel */}
            <div className="absolute inset-0 flex items-start md:items-center justify-center p-2 md:p-6 overflow-y-auto">
              <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl ring-2 ring-blue-500/40 border border-blue-200 animate-in zoom-in-95">
                <div className="sticky top-0 z-10 flex items-start justify-between p-4 border-b bg-white/90 backdrop-blur">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Update Transport Profile
                    </h2>
                    <p className="text-sm text-gray-600">
                      Modify your transport company information and details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[TransportProfile] Close via X button");
                      setIsEditDialogOpen(false);
                    }}
                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 md:p-6 space-y-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Company Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Swift Logistics & Transport"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ownerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Owner Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Amit Singh" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fleetSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fleet Size</FormLabel>
                                <FormControl>
                                  <Input placeholder="25 Vehicles" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="establishedYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Established Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="2012" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="transport@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="alternatePhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Alternate Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+91 98765 43211"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="www.yourcompany.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Office Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Transport Hub, Pune-Mumbai Highway"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Pune" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="Maharashtra" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                  <Input placeholder="411001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="landmark"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Landmark</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Near Industrial Area"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Transport Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Transport Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="vehicleTypes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vehicle Types</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Refrigerated Trucks, Mini Trucks, Tempo"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="licenseNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>License Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="TL-2024-001234"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="operatingHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Operating Hours</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="24/7 Service Available"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Additional Information
                        </h3>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Your Company</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your transport services, capabilities, and what makes you special..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="specialties"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Services & Specialties</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Cold Chain Transport, Express Delivery, Fresh Produce Logistics"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() => {
                            console.log(
                              "[TransportProfile] Cancel button close"
                            );
                            setIsEditDialogOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Update Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transport Profile Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {transportProfile?.companyName || "Transport Information"}
              {transportProfile?.verified && (
                <Badge variant="secondary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-gray-600">
                  Loading transport details...
                </span>
              </div>
            ) : transportProfile ? (
              renderTransportDetails()
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No profile data available</p>
                <Button onClick={fetchTransportProfile} variant="outline">
                  Retry Loading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
