"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/farmer-animations.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Edit3, Save, Sprout, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// Removed shadcn Dialog in favor of a custom modal for this page to resolve stacking issues
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

interface FarmerProfile {
  username?: string;
  farmName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  farmSize?: string;
  farmingType?: string;
  establishedYear?: string;
  website?: string;
  description?: string;
  specialties?: string;
  certifications?: string[];
  farmingMethods?: string;
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
  farmName: z
    .string()
    .min(2, "Farm name must be at least 2 characters")
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
  farmSize: z.string().optional(),
  farmingType: z.string().optional(),
  establishedYear: z.string().optional(),
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
  farmingMethods: z.string().optional(),
});

export default function FarmerProfilePage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Force demo user if no user is found
  const effectiveUser = user || {
    uid: "demo-farmer-1",
    email: "farmer@demo.com",
    displayName: "Demo Farmer User",
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      farmName: "",
      ownerName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      farmSize: "",
      farmingType: "",
      establishedYear: "",
      website: "",
      description: "",
      specialties: "",
      farmingMethods: "",
    },
  });

  const fetchFarmerProfile = async () => {
    // Show demo data immediately for fast response
    const demoProfile: FarmerProfile = {
      username: "Suresh Patel",
      farmName: "Green Valley Organic Farm",
      ownerName: "Suresh Patel",
      email: effectiveUser.email || "farmer@demo.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      address: "Plot 45, Green Valley, Nashik Road",
      city: "Nashik",
      state: "Maharashtra",
      pincode: "422001",
      landmark: "Near Highway Junction",
      farmSize: "25 Acres",
      farmingType: "Organic Farming",
      establishedYear: "2015",
      website: "www.greenvalleyfarm.com",
      description:
        "Dedicated to sustainable and organic farming practices. We grow premium quality vegetables, fruits, and grains using traditional methods combined with modern techniques.",
      specialties: "Organic Vegetables, Seasonal Fruits, Wheat, Rice, Pulses",
      certifications: [
        "Organic Certified",
        "FSSAI Licensed",
        "Sustainable Farming",
      ],
      farmingMethods: "Drip Irrigation, Crop Rotation, Natural Pest Control",
      userType: "farmer",
      verified: true,
      lastActive: new Date().toISOString(),
    };

    setFarmerProfile(demoProfile);
    setProfileLoading(false);

    // Fetch from API in background
    try {
      const response = await fetch(`/api/users/${effectiveUser.uid}`);

      if (response.ok) {
        const data = await response.json();

        const enhancedProfile: FarmerProfile = {
          ...data,
          username: data.username || "Suresh Patel",
          farmName: data.farmName || "Green Valley Organic Farm",
          ownerName: data.ownerName || data.username || "Suresh Patel",
          email: data.email || effectiveUser.email,
          phone: data.phone || "+91 98765 43210",
          alternatePhone: data.alternatePhone || "+91 98765 43211",
          address: data.address || "Plot 45, Green Valley, Nashik Road",
          city: data.city || "Nashik",
          state: data.state || "Maharashtra",
          pincode: data.pincode || "422001",
          landmark: data.landmark || "Near Highway Junction",
          farmSize: data.farmSize || "25 Acres",
          farmingType: data.farmingType || "Organic Farming",
          establishedYear: data.establishedYear || "2015",
          website: data.website || "www.greenvalleyfarm.com",
          description:
            data.description ||
            "Dedicated to sustainable and organic farming practices. We grow premium quality vegetables, fruits, and grains using traditional methods combined with modern techniques.",
          specialties:
            data.specialties ||
            "Organic Vegetables, Seasonal Fruits, Wheat, Rice, Pulses",
          certifications: data.certifications || [
            "Organic Certified",
            "FSSAI Licensed",
            "Sustainable Farming",
          ],
          farmingMethods:
            data.farmingMethods ||
            "Drip Irrigation, Crop Rotation, Natural Pest Control",
          userType: data.userType || "farmer",
          createdAt: data.createdAt,
          verified: true,
          photoURL: data.photoURL,
          lastActive: new Date().toISOString(),
        };

        setFarmerProfile(enhancedProfile);
      }
    } catch (error) {
      // Keep demo data if API fails
      console.log("Using demo data - API unavailable");
    }
  };

  useEffect(() => {
    fetchFarmerProfile();
  }, [effectiveUser.uid]);

  useEffect(() => {
    if (farmerProfile && isEditDialogOpen) {
      form.reset({
        username: farmerProfile.username || "",
        farmName: farmerProfile.farmName || "",
        ownerName: farmerProfile.ownerName || "",
        email: farmerProfile.email || "",
        phone: farmerProfile.phone || "",
        alternatePhone: farmerProfile.alternatePhone || "",
        address: farmerProfile.address || "",
        city: farmerProfile.city || "",
        state: farmerProfile.state || "",
        pincode: farmerProfile.pincode || "",
        landmark: farmerProfile.landmark || "",
        farmSize: farmerProfile.farmSize || "",
        farmingType: farmerProfile.farmingType || "",
        establishedYear: farmerProfile.establishedYear || "",
        website: farmerProfile.website || "",
        description: farmerProfile.description || "",
        specialties: farmerProfile.specialties || "",
        farmingMethods: farmerProfile.farmingMethods || "",
      });
    }
  }, [farmerProfile, isEditDialogOpen, form]);

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
          responseData.message || `Failed to update farmer profile`
        );
      }

      setFarmerProfile((prev) => (prev ? { ...prev, ...values } : null));

      toast({
        title: "Profile Updated",
        description: "Your farm information has been saved successfully.",
        duration: 3000,
      });

      await fetchFarmerProfile();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Farmer profile update error:", error);
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

  const renderFarmerDetails = () => {
    const profileData = farmerProfile || {
      username: "Loading...",
      farmName: "Loading...",
      email: effectiveUser?.email || "Loading...",
      phone: "Loading...",
      address: "Loading...",
      verified: false,
    };

    return (
      <motion.div 
        className="space-y-8 w-full"
        variants={containerVariants}
      >
        {/* Basic Information */}
        <motion.div 
          className="bg-white rounded-lg border p-6 transition-shadow duration-300 hover:shadow-md"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Farm Name
              </label>
              <p className="text-base">
                {profileData.farmName || "Not provided"}
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
                Farm Size
              </label>
              <p className="text-base">
                {profileData.farmSize || "Not specified"}
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
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-white rounded-lg border p-6 transition-shadow duration-300 hover:shadow-md"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
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
        </motion.div>

        {/* Address */}
        <motion.div 
          className="bg-white rounded-lg border p-6 transition-shadow duration-300 hover:shadow-md"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Farm Location
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
        </motion.div>

        {/* Farming Details */}
        <motion.div 
          className="bg-white rounded-lg border p-6 transition-shadow duration-300 hover:shadow-md"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">
            Farming Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Farming Type
              </label>
              <p className="text-base">
                {profileData.farmingType || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Farming Methods
              </label>
              <p className="text-base">
                {profileData.farmingMethods || "Not provided"}
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
                    About Farm
                  </label>
                  <p className="text-base text-gray-700">
                    {profileData.description}
                  </p>
                </div>
              )}
              {profileData.specialties && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Crops & Specialties
                  </label>
                  <p className="text-base text-gray-700">
                    {profileData.specialties}
                  </p>
                </div>
              )}
              {profileData.certifications &&
                profileData.certifications.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Certifications
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
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
                ? "Verified Farmer"
                : "Pending Verification"}
            </span>
          </div>
        </div>
      </div>
    );
  };

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
      className="min-h-screen w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your farm information
            </p>
          </div>
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                onClick={() => {
                  console.log("[FarmerProfile] Open modal");
                  setIsEditDialogOpen(true);
                }}
                className="relative z-auto transition-all duration-300"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Modal Overlay: Rendered at page level for maximum stacking reliability */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 z-[2147483600]">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
              onClick={() => {
                console.log("[FarmerProfile] Backdrop click close");
                setIsEditDialogOpen(false);
              }}
            />
            {/* Modal Panel */}
            <div className="absolute inset-0 flex items-start md:items-center justify-center p-2 md:p-6 overflow-y-auto">
              <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl ring-2 ring-green-500/40 border border-green-200 animate-in zoom-in-95">
                <div className="sticky top-0 z-10 flex items-start justify-between p-4 border-b bg-white/90 backdrop-blur">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Update Farmer Profile
                    </h2>
                    <p className="text-sm text-gray-600">
                      Modify your farm information and details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[FarmerProfile] Close via X button");
                      setIsEditDialogOpen(false);
                    }}
                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      {/* Farm Information */}
                      <div className="space-y-4 animate-fade-in-up stagger-1">
                        <h3 className="text-lg font-semibold">
                          Farm Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="farmName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farm Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Green Valley Organic Farm"
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
                                  <Input
                                    placeholder="Suresh Patel"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="farmSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farm Size</FormLabel>
                                <FormControl>
                                  <Input placeholder="25 Acres" {...field} />
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
                                  <Input placeholder="2015" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-4 animate-fade-in-up stagger-2">
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
                                    placeholder="farmer@example.com"
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
                                    placeholder="www.yourfarm.com"
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
                      <div className="space-y-4 animate-fade-in-up stagger-3">
                        <h3 className="text-lg font-semibold">Farm Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Plot 45, Green Valley, Nashik Road"
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
                                  <Input placeholder="Nashik" {...field} />
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
                                  <Input placeholder="422001" {...field} />
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
                                    placeholder="Near Highway Junction"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Farming Details */}
                      <div className="space-y-4 animate-fade-in-up stagger-4">
                        <h3 className="text-lg font-semibold">
                          Farming Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="farmingType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farming Type</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Organic Farming"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="farmingMethods"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farming Methods</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Drip Irrigation, Crop Rotation"
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
                              <FormLabel>About Your Farm</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your farm, farming practices, and what makes you special..."
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
                              <FormLabel>Crops & Specialties</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Organic Vegetables, Seasonal Fruits, Wheat, Rice"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => {
                      console.log("[FarmerProfile] Cancel button close");
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
              </div>
            </div>
          </div>
        )}

        {/* Farmer Profile Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Sprout className="h-5 w-5" />
                </motion.div>
                {farmerProfile?.farmName || "Farm Information"}
                {farmerProfile?.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-gray-600">
                  Loading farm details...
                </span>
              </div>
            ) : farmerProfile ? (
              renderFarmerDetails()
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No profile data available</p>
                <Button onClick={fetchFarmerProfile} variant="outline">
                  Retry Loading
                </Button>
              </div>
            )}
          </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
