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
  User,
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

  const renderProfileDetails = () => {
    const profileData = userProfile || {
      username: "Loading...",
      email: user?.email || "Loading...",
      phone: "Loading...",
      userType: "retail",
      verified: false
    };

    const isRetail = profileData.userType === 'retail';
    const isHub = profileData.userType === 'hub';

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isRetail ? (
              <>
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
              </>
            ) : isHub ? (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Branch Name</label>
                  <p className="text-base">{profileData.branchName || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Branch ID</label>
                  <p className="text-basver
        await fetchUserProfile();
        setIsEditDialogOpen(false);
        
        // Reset form state
        form.reset();
        setImagePreview(null);
        
        console.log("=== PROFILE UPDATE SUCCESS ===");

    } catch (error: any) {
      console.error("=== PROFILE UPDATE ERROR ===");
      console.error("Profile update - Error:", error);
      console.error("Error stack:", error.stack);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
      setUploadProgress(null);
      console.log("=== PROFILE UPDATE END ===");
    }
  }

  const loading = authLoading || profileLoading;

  const renderProfileDetails = () => {
    console.log("renderProfileDetails called, userProfile:", userProfile);
    
    // Always show profile details with fallback data to ensure visibility
    const profileData = userProfile || {
      email: user?.email || "demo@example.com",
      phone: "Not provided",
      location: "Not specified", 
      company: "Not specified",
      role: "User",
      userType: "retail",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verified: false
    };

    const details = [
      { label: "Email", value: profileData.email || "Not provided", icon: Mail },
      { label: "Phone", value: profileData.phone || "Not provided", icon: Phone },
      { label: "Location", value: profileData.location || "Not specified", icon: MapPin },
      { label: "Company", value: profileData.company || "Not specified", icon: Building },
      { label: "Role", value: profileData.role || profileData.userType || "Not specified", icon: User },
      { label: profileData.userType === 'hub' ? "Branch ID" : "User Type", value: profileData.userType === 'hub' ? (profileData.branchId || "Not specified") : (profileData.userType || "Not specified"), icon: Building },
      { label: "Member Since", value: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A', icon: Calendar },
      { label: "Last Active", value: profileData.lastActive ? "Active now" : "Recently", icon: Activity },
      { label: "Verification Status", value: profileData.verified ? "Verified" : "Pending", icon: Shield },
    ];

    console.log("Profile details to render:", details);

    return (
        <div className="space-y-4">
          {!userProfile && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                ⚠️ Showing fallback data. Profile not fully loaded yet.
                <Button 
                  onClick={() => fetchUserProfile()} 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                >
                  Retry Loading
                </Button>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {details.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border border-gray-200">
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✅ Profile details {userProfile ? 'loaded successfully' : 'showing with fallback data'}. Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container mx-auto space-y-6 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Profile Details
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              View and manage your profile information
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                console.log("Force refresh profile data");
                fetchUserProfile();
              }}
              variant="outline"
            >
              Refresh Profile
            </Button>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Edit Profile
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Unsaved Changes
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Update your profile information and preferences
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(
                  (values) => {
                    console.log("Form submitted successfully with values:", values);
                    onSubmit(values);
                  }, 
                  (errors) => {
                    console.log("Form validation errors:", errors);
                    toast({
                      variant: "destructive",
                      title: "Validation Error",
                      description: "Please check the form for errors.",
                    });
                  }
                )} className="space-y-6">
                  {/* Profile Picture */}
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                              <AvatarImage src={imagePreview || undefined} />
                              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              size="sm"
                              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                              onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormControl>
                            <Input 
                              id="photo-upload"
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange} 
                              className="hidden"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info */}
                    {userProfile?.userType === 'hub' ? (
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
                    ) : (
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
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai, Maharashtra" {...field} />
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
                  </div>

                  {uploadProgress !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={isUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      disabled={isUpdating || uploadProgress !== null}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {uploadProgress !== null ? `Uploading... ${Math.round(uploadProgress)}%` : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Always show Profile Details - even during loading */}
        <Card className="border-2 border-green-200 shadow-xl bg-white mb-6">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-800 text-xl">
              <User className="h-6 w-6" />
              Profile Details
            </CardTitle>
            <CardDescription className="text-green-600 text-base">
              Your complete profile information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">
                Debug: Profile loaded = {userProfile ? 'Yes' : 'No'}, 
                Loading = {loading ? 'Yes' : 'No'}, 
                User = {user?.uid || 'None'}
              </p>
              <p className="text-xs text-blue-600">
                API Response: {userProfile ? 'Data received' : 'No data'} | 
                Auth State: {user ? 'Authenticated' : 'Not authenticated'} | 
                Component State: {profileLoading ? 'Loading' : 'Ready'}
              </p>
            </div>
            {renderProfileDetails()}
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
