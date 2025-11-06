"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Edit3,
  Save,
  Truck,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  username: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional().or(z.literal("")),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  alternatePhone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid pincode").optional().or(z.literal("")),
  landmark: z.string().optional(),
  fleetSize: z.string().optional(),
  vehicleTypes: z.string().optional(),
  establishedYear: z.string().optional(),
  licenseNumber: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
  specialties: z.string().optional(),
  operatingHours: z.string().optional(),
});

export default function TransportProfilePage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const [transportProfile, setTransportProfile] = useState<TransportProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Force demo user if no user is found
  const effectiveUser = user || {
    uid: 'demo-transport-1',
    email: 'transport@demo.com',
    displayName: 'Demo Transport User'
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
    try {
      setProfileLoading(true);
      
      // Try to fetch from API first
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
          vehicleTypes: data.vehicleTypes || "Refrigerated Trucks, Mini Trucks, Tempo",
          establishedYear: data.establishedYear || "2012",
          licenseNumber: data.licenseNumber || "TL-2024-001234",
          website: data.website || "www.swiftlogistics.com",
          description: data.description || "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Specializing in cold chain transport and express delivery services.",
          specialties: data.specialties || "Cold Chain Transport, Express Delivery, Fresh Produce Logistics",
          serviceAreas: data.serviceAreas || ["Mumbai", "Pune", "Nashik", "Aurangabad", "Kolhapur"],
          operatingHours: data.operatingHours || "24/7 Service Available",
          userType: data.userType || "transport",
          createdAt: data.createdAt,
          verified: true,
          photoURL: data.photoURL,
          lastActive: new Date().toISOString(),
        };
        
        setTransportProfile(enhancedProfile);
      } else {
        throw new Error("API not available");
      }
    } catch (error) {
      // Always show demo data if API fails
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
        description: "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Specializing in cold chain transport and express delivery services.",
        specialties: "Cold Chain Transport, Express Delivery, Fresh Produce Logistics",
        serviceAreas: ["Mumbai", "Pune", "Nashik", "Aurangabad", "Kolhapur"],
        operatingHours: "24/7 Service Available",
        userType: "transport",
        verified: true,
        lastActive: new Date().toISOString(),
      };
      setTransportProfile(demoProfile);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch profile, using effective user
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
        throw new Error(responseData.message || `Failed to update transport profile`);
      }

      setTransportProfile(prev => prev ? { ...prev, ...values } : null);
      
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
      verified: false
    };

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Company Name</label>
              <p className="text-base">{profileData.companyName || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Owner Name</label>
              <p className="text-base">{profileData.ownerName || profileData.username || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Fleet Size</label>
              <p className="text-base">{profileData.fleetSize || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Established Year</label>
              <p className="text-base">{profileData.establishedYear || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base">{profileData.email || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Primary Phone</label>
              <p className="text-base">{profileData.phone || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Alternate Phone</label>
              <p className="text-base">{profileData.alternatePhone || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Website</label>
              <p className="text-base">{profileData.website || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Office Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-base">{profileData.address || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-base">{profileData.city || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-base">{profileData.state || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Pincode</label>
              <p className="text-base">{profileData.pincode || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Landmark</label>
              <p className="text-base">{profileData.landmark || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Transport Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Transport Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Vehicle Types</label>
              <p className="text-base">{profileData.vehicleTypes || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">License Number</label>
              <p className="text-base">{profileData.licenseNumber || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Operating Hours</label>
              <p className="text-base">{profileData.operatingHours || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(profileData.description || profileData.specialties) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Additional Information</h3>
            <div className="space-y-4">
              {profileData.description && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">About Company</label>
                  <p className="text-base text-gray-700">{profileData.description}</p>
                </div>
              )}
              {profileData.specialties && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Services & Specialties</label>
                  <p className="text-base text-gray-700">{profileData.specialties}</p>
                </div>
              )}
              {profileData.serviceAreas && profileData.serviceAreas.length > 0 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Service Areas</label>
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
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">
              Status: {profileData.verified ? 'Verified Transport Partner' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transport Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your transport company information
          </p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit3 className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Transport Profile</DialogTitle>
              <DialogDescription>
                Modify your transport company information and details
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Swift Logistics & Transport" {...field} />
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
                  <h3 className="text-lg font-semibold">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="transport@example.com" {...field} />
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
                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
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
                            <Input type="tel" placeholder="+91 98765 43211" {...fie