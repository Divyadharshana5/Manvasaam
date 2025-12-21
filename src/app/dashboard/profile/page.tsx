"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  Edit3,
  Save,
  User,
  Store,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Globe,
  CreditCard,
  Clock,
  Shield,
  Award,
  Briefcase
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

interface UserProfile {
  // Basic Information
  username?: string;
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
  branchName?: string;
  branchId?: string;
  createdAt?: string;
  verified?: boolean;
  photoURL?: string;
  lastActive?: string;
  company?: string;
  role?: string;
  location?: string;
  bio?: string;
}

const profileFormSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  shopName: z.string().min(2, "Shop name must be at least 2 characters").optional().or(z.literal("")),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters").optional().or(z.literal("")),
  branchName: z.string().min(2, "Branch name must be at least 2 characters").optional().or(z.literal("")),
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
  company: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      shopName: "",
      ownerName: "",
      branchName: "",
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
      company: "",
      role: "",
      location: "",
      bio: "",
    },
  });

  const getDefaultData = (userType?: string, data?: any) => {
    const baseData = {
      email: data?.email || user?.email,
      phone: data?.phone || "+91 98765 43210",
      verified: true,
      userType: data?.userType || userType || "retail",
      createdAt: data?.createdAt,
      lastActive: new Date().toISOString(),
    };

    switch (userType) {
      case 'retail':
        return {
          ...baseData,
          shopName: data?.shopName || "Fresh Mart Grocery Store",
          shopType: data?.shopType || "Grocery & Fresh Produce",
          ownerName: data?.ownerName || data?.username || "Rajesh Kumar",
          alternatePhone: data?.alternatePhone || "+91 98765 43211",
          address: data?.address || "123, Market Street, Commercial Complex",
          city: data?.city || "Mumbai",
          state: data?.state || "Maharashtra", 
          pincode: data?.pincode || "400001",
          landmark: data?.landmark || "Near City Mall",
          gstNumber: data?.gstNumber || "27ABCDE1234F1Z5",
          licenseNumber: data?.licenseNumber || "FL-2024-001234",
          establishedYear: data?.establishedYear || "2018",
          businessHours: data?.businessHours || "8:00 AM - 10:00 PM",
          website: data?.website || "www.freshmart.com",
          description: data?.description || "Your trusted neighborhood grocery store providing fresh produce, daily essentials, and quality products at competitive prices.",
          specialties: data?.specialties || "Fresh Vegetables, Organic Products, Daily Essentials, Local Produce",
          paymentMethods: data?.paymentMethods || ["Cash", "UPI", "Card", "Digital Wallet"],
          deliveryRadius: data?.deliveryRadius || "5 km",
        };
      case 'farmer':
        return {
          ...baseData,
          username: data?.username || "Suresh Patel",
          company: data?.company || "Green Valley Farm",
          role: data?.role || "Organic Farmer",
          location: data?.location || "Nashik, Maharashtra",
          bio: data?.bio || "Dedicated to sustainable farming practices and growing the finest organic produce. Proud to feed our community with healthy, fresh crops.",
          address: data?.address || "Plot 45, Green Valley, Nashik",
          city: data?.city || "Nashik",
          state: data?.state || "Maharashtra",
          pincode: data?.pincode || "422001",
          website: data?.website || "www.greenvalleyfarm.com",
          specialties: data?.specialties || "Organic Vegetables, Fruits, Grains",
        };
      case 'transport':
        return {
          ...baseData,
          username: data?.username || "Amit Singh",
          company: data?.company || "Swift Logistics",
          role: data?.role || "Fleet Manager",
          location: data?.location || "Pune, Maharashtra",
          bio: data?.bio || "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Excellence in every delivery.",
          address: data?.address || "Transport Hub, Pune",
          city: data?.city || "Pune",
          state: data?.state || "Maharashtra",
          pincode: data?.pincode || "411001",
          website: data?.website || "www.swiftlogistics.com",
          specialties: data?.specialties || "Cold Chain Transport, Express Delivery",
        };
      case 'hub':
        return {
          ...baseData,
          branchName: data?.branchName || "Central Distribution Hub",
          branchId: data?.branchId || "HUB-001",
          username: data?.username || "Hub Manager",
          company: data?.company || "AgriConnect Hub",
          role: data?.role || "Hub Manager",
          location: data?.location || "Mumbai, Maharashtra",
          address: data?.address || "Central Hub Complex, Mumbai",
          city: data?.city || "Mumbai",
          state: data?.state || "Maharashtra",
          pincode: data?.pincode || "400001",
        };
      default:
        return {
          ...baseData,
          username: data?.username || "User",
          company: data?.company || "Not specified",
          role: data?.role || "User",
          location: data?.location || "Not specified",
          bio: data?.bio || "Welcome to my profile!",
        };
    }
  };

  const fetchUserProfile = async () => {
    if (user) {
      try {
        setProfileLoading(true);
        const response = await fetch(`/api/users/${user.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        
        const enhancedProfile = getDefaultData(data.userType, data);
        setUserProfile(enhancedProfile);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
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
      fetchUserProfile();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (userProfile && isEditDialogOpen) {
      form.reset({
        username: userProfile.username || "",
        shopName: userProfile.shopName || "",
        ownerName: userProfile.ownerName || "",
        branchName: userProfile.branchName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        alternatePhone: userProfile.alternatePhone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        pincode: userProfile.pincode || "",
        landmark: userProfile.landmark || "",
        gstNumber: userProfile.gstNumber || "",
        licenseNumber: userProfile.licenseNumber || "",
        establishedYear: userProfile.establishedYear || "",
        businessHours: userProfile.businessHours || "",
        website: userProfile.website || "",
        description: userProfile.description || "",
        specialties: userProfile.specialties || "",
        deliveryRadius: userProfile.deliveryRadius || "",
        company: userProfile.company || "",
        role: userProfile.role || "",
        location: userProfile.location || "",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile, isEditDialogOpen, form]);

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
        throw new Error(responseData.message || `Failed to update profile`);
      }

      setUserProfile(prev => prev ? { ...prev, ...values } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
        duration: 3000,
      });
      
      await fetchUserProfile();
      setIsEditDialogOpen(false);
      
    } catch (error: any) {
      console.error("Profile update error:", error);
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

  const getProfileIcon = (userType?: string) => {
    switch (userType) {
      case 'retail': return Store;
      case 'farmer': return Award;
      case 'transport': return Building;
      case 'hub': return Building;
      default: return User;
    }
  };

  const getProfileTitle = (profile: UserProfile) => {
    if (profile.userType === 'retail') return profile.shopName;
    if (profile.userType === 'hub') return profile.branchName;
    return profile.username;
  };

  const getProfileSubtitle = (profile: UserProfile) => {
    if (profile.userType === 'retail') return `${profile.shopType} • ${profile.city}`;
    if (profile.userType === 'hub') return `Hub ID: ${profile.branchId} • ${profile.city}`;
    return `${profile.role} • ${profile.company}`;
  };

  const renderInfoCard = (icon: any, label: string, value: string, className?: string) => {
    const Icon = icon;
    return (
      <div className={`bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-5 hover:shadow-lg hover:border-blue-200/60 transition-all duration-300 group ${className}`}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200/50 transition-all duration-300">
            <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2 group-hover:text-gray-600 transition-colors duration-300">{label}</p>
            <p className="text-base font-semibold text-gray-900 break-words leading-relaxed">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderProfileDetails = () => {
    if (!userProfile) return null;

    const isRetail = userProfile.userType === 'retail';
    const isHub = userProfile.userType === 'hub';

    return (
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 animate-scale-in stagger-1">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={userProfile.photoURL || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                {getProfileTitle(userProfile)?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getProfileTitle(userProfile) || "Profile"}
                </h2>
                {userProfile.verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-lg">
                {getProfileSubtitle(userProfile)}
              </p>
              {(userProfile.description || userProfile.bio) && (
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {userProfile.description || userProfile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderInfoCard(Mail, "Email Address", userProfile.email || "Not provided")}
            {renderInfoCard(Phone, "Primary Phone", userProfile.phone || "Not provided")}
            {isRetail && userProfile.alternatePhone && 
              renderInfoCard(Phone, "Alternate Phone", userProfile.alternatePhone)
            }
            {userProfile.website && 
              renderInfoCard(Globe, "Website", userProfile.website)
            }
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderInfoCard(MapPin, "Address", userProfile.address || userProfile.location || "Not provided", "md:col-span-2")}
            {renderInfoCard(Building, "City", userProfile.city || "Not specified")}
            {renderInfoCard(Building, "State", userProfile.state || "Not specified")}
            {renderInfoCard(MapPin, "Pincode", userProfile.pincode || "Not specified")}
            {isRetail && userProfile.landmark && 
              renderInfoCard(MapPin, "Landmark", userProfile.landmark)
            }
          </div>
        </div>

        {/* Business Information */}
        {(isRetail || userProfile.company) && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isRetail ? (
                <>
                  {userProfile.gstNumber && renderInfoCard(CreditCard, "GST Number", userProfile.gstNumber)}
                  {userProfile.licenseNumber && renderInfoCard(Shield, "License Number", userProfile.licenseNumber)}
                  {userProfile.businessHours && renderInfoCard(Clock, "Business Hours", userProfile.businessHours)}
                  {userProfile.establishedYear && renderInfoCard(Calendar, "Established", userProfile.establishedYear)}
                  {userProfile.deliveryRadius && renderInfoCard(MapPin, "Delivery Radius", userProfile.deliveryRadius)}
                </>
              ) : (
                <>
                  {userProfile.company && renderInfoCard(Building, "Company", userProfile.company)}
                  {userProfile.role && renderInfoCard(Briefcase, "Role", userProfile.role)}
                  {userProfile.userType && renderInfoCard(User, "User Type", userProfile.userType.charAt(0).toUpperCase() + userProfile.userType.slice(1))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {(userProfile.specialties || userProfile.paymentMethods) && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Additional Information
            </h3>
            <div className="space-y-4">
              {userProfile.specialties && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                  <p className="text-gray-700 leading-relaxed">{userProfile.specialties}</p>
                </div>
              )}
              {userProfile.paymentMethods && userProfile.paymentMethods.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Status */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">Account Status</h4>
              <p className="text-green-700">
                {userProfile.verified ? 'Verified Account' : 'Pending Verification'} • 
                Member since {userProfile.createdAt ? new Date(userProfile.createdAt).getFullYear() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    const isRetail = userProfile?.userType === 'retail';
    const isHub = userProfile?.userType === 'hub';

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4 animate-fade-in-up stagger-1">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isRetail ? (
              <>
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
              </>
            ) : isHub ? (
              <>
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Central Hub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Hub Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Role/Position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4 animate-fade-in-up stagger-2">
          <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
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
            {isRetail && (
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
            )}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="www.yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4 animate-fade-in-up stagger-3">
          <h3 className="text-lg font-semibold border-b pb-2">Address & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={isRetail ? "address" : "location"}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Complete address..." {...field} />
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
            {isRetail && (
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
            )}
          </div>
        </div>

        {/* Business Details (for retail) */}
        {isRetail && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Business Details</h3>
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
        )}

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
          <FormField
            control={form.control}
            name={isRetail ? "description" : "bio"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isRetail ? "Shop Description" : "Bio"}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={isRetail ? "Describe your shop and services..." : "Tell us about yourself..."}
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
                  <Input placeholder="Your specialties or areas of expertise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isUpdating}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
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
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your profile information and settings
            </p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Edit3 className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogDescription>
                  Modify your profile information and details
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                {renderEditForm()}
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading profile details...</p>
                </div>
              </div>
            ) : (
              renderProfileDetails()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}