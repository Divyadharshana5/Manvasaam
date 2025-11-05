"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  Shield,
  Edit3,
  Save,
  Store,
  Clock,
  Globe,
  CreditCard,
  Package,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
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
  // Shop Details
  shopName?: string;
  shopType?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  
  // Address & Location
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  
  // Business Details
  gstNumber?: string;
  licenseNumber?: string;
  establishedYear?: string;
  businessHours?: string;
  website?: string;
  
  // Additional Info
  description?: string;
  specialties?: string;
  paymentMethods?: string[];
  deliveryRadius?: string;
  
  // System Info
  userType?: string;
  createdAt?: string;
  verified?: boolean;
  photoURL?: string;
  lastActive?: string;
}

const profileFormSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters").optional().or(z.literal("")),
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
  const { user, loading: authLoading } = useAuth();
  const [shopProfile, setShopProfile] = useState<RetailShopProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      shopName: "",
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
    if (user) {
      try {
        setProfileLoading(true);
        const response = await fetch(`/api/users/${user.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch shop profile");
        }
        const data = await response.json();
        
        // Enhanced retail shop profile with mock data
        const enhancedProfile: RetailShopProfile = {
          ...data,
          shopName: data.shopName || "Fresh Mart Grocery Store",
          shopType: data.shopType || "Grocery & Fresh Produce",
          ownerName: data.ownerName || data.username || "Rajesh Kumar",
          email: data.email || user.email,
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
          
          description: data.description || "Your trusted neighborhood grocery store providing fresh produce, daily essentials, and quality products at competitive prices. We pride ourselves on excellent customer service and supporting local farmers.",
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
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shop profile data",
        });
      } finally {
        setProfileLoading(false);
      }
    } else if (!authLoading) {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchShopProfile();
    }
  }, [user, authLoading]);

  // Set form default values when profile data is loaded
  useEffect(() => {
    if (shopProfile && isEditDialogOpen) {
      form.reset({
        shopName: shopProfile.shopName || "",
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
    if (!user || !user.uid) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "User not properly authenticated",
      });
      return;
    }
    
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${user.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || `Failed to update shop profile`);
      }

      // Update local state
      setShopProfile(prev => prev ? { ...prev, ...values } : null);
      
      toast({
        title: "✅ Shop Profile Updated",
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

  const loading = authLoading || profileLoading;

  const renderShopDetails = () => {
    const profileData = shopProfile || {
      shopName: "Loading...",
      ownerName: "Loading...",
      email: user?.email || "Loading...",
      phone: "Loading...",
      address: "Loading...",
      verified: false
    };

    const shopDetails = [
      { 
        section: "Shop Information",
        items: [
          { label: "Shop Name", value: profileData.shopName || "Not provided", icon: Store },
          { label: "Shop Type", value: profileData.shopType || "Retail Store", icon: Package },
          { label: "Owner Name", value: profileData.ownerName || "Not provided", icon: User },
          { label: "Established", value: profileData.establishedYear || "Not specified", icon: Calendar },
        ]
      },
      {
        section: "Contact Details", 
        items: [
          { label: "Email", value: profileData.email || "Not provided", icon: Mail },
          { label: "Primary Phone", value: profileData.phone || "Not provided", icon: Phone },
          { label: "Alternate Phone", value: profileData.alternatePhone || "Not provided", icon: Phone },
          { label: "Website", value: profileData.website || "Not provided", icon: Globe },
        ]
      },
      {
        section: "Address & Location",
        items: [
          { label: "Address", value: profileData.address || "Not provided", icon: MapPin },
          { label: "City", value: profileData.city || "Not specified", icon: Building },
          { label: "State", value: profileData.state || "Not specified", icon: Building },
          { label: "Pincode", value: profileData.pincode || "Not specified", icon: MapPin },
          { label: "Landmark", value: profileData.landmark || "Not specified", icon: MapPin },
        ]
      },
      {
        section: "Business Details",
        items: [
          { label: "GST Number", value: profileData.gstNumber || "Not provided", icon: CreditCard },
          { label: "License Number", value: profileData.licenseNumber || "Not provided", icon: Shield },
          { label: "Business Hours", value: profileData.businessHours || "Not specified", icon: Clock },
          { label: "Delivery Radius", value: profileData.deliveryRadius ? `${profileData.deliveryRadius}` : "Not specified", icon: MapPin },
        ]
      }
    ];

    return (
      <div className="space-y-8">
        {shopDetails.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded"></div>
              {section.section}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, index) => (
                <div key={`${sectionIndex}-${index}`} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border border-gray-200">
                  <div className="p-3 rounded-lg bg-white shadow-md border">
                    <item.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                    <p className="text-base font-semibold text-gray-900 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Information */}
        {(profileData.description || profileData.specialties) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded"></div>
              Additional Information
            </h3>
            <div className="space-y-4">
              {profileData.description && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Shop Description</h4>
                  <p className="text-blue-700">{profileData.description}</p>
                </div>
              )}
              {profileData.specialties && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Specialties</h4>
                  <p className="text-purple-700">{profileData.specialties}</p>
                </div>
              )}
              {profileData.paymentMethods && profileData.paymentMethods.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Payment Methods Accepted</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            {profileData.verified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="font-medium text-green-800">
              Verification Status: {profileData.verified ? 'V