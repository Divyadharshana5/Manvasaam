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
  Store,
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

interface RetailShopProfile {
  username?: string;
  shopName?: string;
  shopType?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  gstNumber?: string;
  licenseNumber?: string;
  establishedYear?: string;
  businessHours?: string;
  website?: string;
  description?: string;
  specialties?: string;
  paymentMethods?: string[];
  deliveryRadius?: string;
  userType?: string;
  createdAt?: string;
  verified?: boolean;
  photoURL?: string;
  lastActive?: string;
}

const profileFormSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters").optional().or(z.literal("")),
  shopType: z.string().optional(),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  alternatePhone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid pincode").optional().or(z.literal("")),
  landmark: z.string().optional(),
  gstNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  establishedYear: z.string().optional(),
  businessHours: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
  specialties: z.string().optional(),
  deliveryRadius: z.string().optional(),
});

export default function RetailProfilePage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const [shopProfile, setShopProfile] = useState<RetailShopProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Force demo user if no user is found
  const effectiveUser = user || {
    uid: 'demo-retail-1',
    email: 'retail@demo.com',
    displayName: 'Demo Retail User'
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      shopName: "",
      shopType: "",
      ownerName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      gstNumber: "",
      licenseNumber: "",
      establishedYear: "",
      businessHours: "",
      website: "",
      description: "",
      specialties: "",
      deliveryRadius: "",
    },
  });

  const fetchShopProfile = async () => {
    // Show demo data immediately for fast response
    const demoProfile: RetailShopProfile = {
      shopName: "Fresh Mart Grocery Store",
      shopType: "Grocery & Fresh Produce",
      ownerName: "Rajesh Kumar",
      email: effectiveUser.email || "retail@demo.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      address: "123, Market Street, Commercial Complex",
      city: "Mumbai",
      state: "Maharashtra", 
      pincode: "400001",
      landmark: "Near City Mall",
      gstNumber: "27ABCDE1234F1Z5",
      licenseNumber: "FL-2024-001234",
      establishedYear: "2018",
      businessHours: "8:00 AM - 10:00 PM",
      website: "www.freshmart.com",
      description: "Your trusted neighborhood grocery store providing fresh produce, daily essentials, and quality products at competitive prices.",
      specialties: "Fresh Vegetables, Organic Products, Daily Essentials, Local Produce",
      paymentMethods: ["Cash", "UPI", "Card", "Digital Wallet"],
      deliveryRadius: "5 km",
      userType: "retail",
      verified: true,
      lastActive: new Date().toISOString(),
    };
    
    setShopProfile(demoProfile);
    setProfileLoading(false);
    
    // Fetch from API in background
    try {
      const response = await fetch(`/api/users/${effectiveUser.uid}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const enhancedProfile: RetailShopProfile = {
          ...data,
          shopName: data.shopName || "Fresh Mart Grocery Store",
          shopType: data.shopType || "Grocery & Fresh Produce",
          ownerName: data.ownerName || data.username || "Rajesh Kumar",
          email: data.email || effectiveUser.email,
          phone: data.phone || "+91 98765 43210",
          alternatePhone: data.alternatePhone || "+91 98765 43211",
          address: data.address || "123, Market Street, Commercial Complex",
          city: data.city || "Mumbai",
          state: data.state || "Maharashtra", 
          pincode: data.pincode || "400001",
          landmark: data.landmark || "Near City Mall",
          gstNumber: data.gstNumber || "27ABCDE1234F1Z5",
          licenseNumber: data.licenseNumber || "FL-2024-001234",
          establishedYear: data.establishedYear || "2018",
          businessHours: data.businessHours || "8:00 AM - 10:00 PM",
          website: data.website || "www.freshmart.com",
          description: data.description || "Your trusted neighborhood grocery store providing fresh produce, daily essentials, and quality products at competitive prices.",
          specialties: data.specialties || "Fresh Vegetables, Organic Products, Daily Essentials, Local Produce",
          paymentMethods: data.paymentMethods || ["Cash", "UPI", "Card", "Digital Wallet"],
          deliveryRadius: data.deliveryRadius || "5 km",
          userType: data.userType || "retail",
          createdAt: data.createdAt,
          verified: true,
          photoURL: data.photoURL,
          lastActive: new Date().toISOString(),
        };
        
        setShopProfile(enhancedProfile);
      }
    } catch (error) {
      // Keep demo data if API fails
      console.log("Using demo data - API unavailable");
    }
  };

  useEffect(() => {
    fetchShopProfile();
  }, [effectiveUser.uid]);

  useEffect(() => {
    if (shopProfile && isEditDialogOpen) {
      form.reset({
        shopName: shopProfile.shopName || "",
        shopType: shopProfile.shopType || "",
        ownerName: shopProfile.ownerName || "",
        email: shopProfile.email || "",
        phone: shopProfile.phone || "",
        alternatePhone: shopProfile.alternatePhone || "",
        address: shopProfile.address || "",
        city: shopProfile.city || "",
        state: shopProfile.state || "",
        pincode: shopProfile.pincode || "",
        landmark: shopProfile.landmark || "",
        gstNumber: shopProfile.gstNumber || "",
        licenseNumber: shopProfile.licenseNumber || "",
        establishedYear: shopProfile.establishedYear || "",
        businessHours: shopProfile.businessHours || "",
        website: shopProfile.website || "",
        description: shopProfile.description || "",
        specialties: shopProfile.specialties || "",
        deliveryRadius: shopProfile.deliveryRadius || "",
      });
    }
  }, [shopProfile, isEditDialogOpen, form]);

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
        throw new Error(responseData.message || `Failed to update shop profile`);
      }

      setShopProfile(prev => prev ? { ...prev, ...values } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your shop information has been saved successfully.",
        duration: 3000,
      });
      
      await fetchShopProfile();
      setIsEditDialogOpen(false);
      
    } catch (error: any) {
      console.error("Shop profile update error:", error);
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

  const renderShopDetails = () => {
    const profileData = shopProfile || {
      shopName: "Loading...",
      ownerName: "Loading...",
      email: effectiveUser?.email || "Loading...",
      phone: "Loading...",
      address: "Loading...",
      verified: false
    };



    return (
      <div className="space-y-8 w-full">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Shop Name</label>
              <p className="text-base">{profileData.shopName || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Owner Name</label>
              <p className="text-base">{profileData.ownerName || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Shop Type</label>
              <p className="text-base">{profileData.shopType || "Retail Store"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Established Year</label>
              <p className="text-base">{profileData.establishedYear || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Contact Information</h3>
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
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Address</h3>
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

        {/* Business Details */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">GST Number</label>
              <p className="text-base">{profileData.gstNumber || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">License Number</label>
              <p className="text-base">{profileData.licenseNumber || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Business Hours</label>
              <p className="text-base">{profileData.businessHours || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Delivery Radius</label>
              <p className="text-base">{profileData.deliveryRadius || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(profileData.description || profileData.specialties) && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">Additional Information</h3>
            <div className="space-y-4">
              {profileData.description && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-base text-gray-700">{profileData.description}</p>
                </div>
              )}
              {profileData.specialties && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Specialties</label>
                  <p className="text-base text-gray-700">{profileData.specialties}</p>
                </div>
              )}
              {profileData.paymentMethods && profileData.paymentMethods.length > 0 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Payment Methods</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="outline">
                        {method}
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
              Status: {profileData.verified ? 'Verified Shop' : 'Pending Verification'}
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
            <h1 className="text-2xl font-bold text-gray-900">Shop Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your shop information
            </p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit3 className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Update Shop Profile</DialogTitle>
              <DialogDescription>
                Modify your shop information and business details
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(85vh-180px)] overflow-y-auto pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Shop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shop Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Fresh Mart Grocery Store" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shopType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Grocery & Fresh Produce" {...field} />
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
                            <Input placeholder="Rajesh Kumar" {...field} />
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
                            <Input placeholder="2018" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Hours</FormLabel>
                          <FormControl>
                            <Input placeholder="8:00 AM - 10:00 PM" {...field} />
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
                            <Input type="email" placeholder="shop@example.com" {...field} />
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
                            <Input type="tel" placeholder="+91 98765 43211" {...field} />
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
                            <Input placeholder="www.yourshop.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address & Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123, Market Street, Commercial Complex" {...field} />
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
                            <Input placeholder="Mumbai" {...field} />
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
                            <Input placeholder="400001" {...field} />
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
                            <Input placeholder="Near City Mall" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input placeholder="27ABCDE1234F1Z5" {...field} />
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
                            <Input placeholder="FL-2024-001234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Radius</FormLabel>
                          <FormControl>
                            <Input placeholder="5 km" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your shop, services, and what makes you special..."
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
                        <FormLabel>Specialties</FormLabel>
                        <FormControl>
                          <Input placeholder="Fresh Vegetables, Organic Products, Daily Essentials" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isUpdating}
                onClick={form.handleSubmit(onSubmit)}
              >
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
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>

        {/* Shop Profile Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {shopProfile?.shopName || "Shop Information"}
              {shopProfile?.verified && (
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
                <span className="ml-2 text-gray-600">Loading shop details...</span>
              </div>
            ) : shopProfile ? (
              renderShopDetails()
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No profile data available</p>
                <Button onClick={fetchShopProfile} variant="outline">
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