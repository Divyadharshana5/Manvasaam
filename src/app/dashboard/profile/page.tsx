
"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  MapPin,
  Shield,
  Star,
  Award,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  Edit3,
  Camera,
  Save,
  X,
  Settings,
  Bell,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  Package,
  Truck,
  Sprout,
  Download,
  Trophy,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/language-context";


interface UserProfile {
  username?: string;
  email?: string;
  userType?: string;
  branchName?: string;
  branchId?: string;
  phone?: string;
  createdAt?: string;
  photoURL?: string;
  location?: string;
  bio?: string;
  website?: string;
  company?: string;
  role?: string;
  verified?: boolean;
  rating?: number;
  totalOrders?: number;
  completedDeliveries?: number;
  totalRevenue?: number;
  joinedDate?: string;
  lastActive?: string;
  preferences?: {
    notifications?: boolean;
    emailUpdates?: boolean;
    smsAlerts?: boolean;
    darkMode?: boolean;
    language?: string;
  };
}

const profileFormSchema = z.object({
  username: z.string().optional(),
  branchName: z.string().optional(),
  phone: z.string().optional(),
  photo: z.any().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
});


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Debug user state
  useEffect(() => {
    console.log("User state:", { 
      user: user?.uid, 
      authLoading, 
      userEmail: user?.email,
      userObject: user 
    });
  }, [user, authLoading]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");



  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      branchName: "",
      phone: "",
      email: "",
      location: "",
      bio: "",
      website: "",
      company: "",
      role: "",
    },
  });

  const getDefaultBio = (userType?: string) => {
    switch (userType) {
      case 'retail':
        return "Passionate about bringing fresh, quality products to our community. Committed to supporting local farmers and sustainable practices.";
      case 'farmer':
        return "Dedicated to sustainable farming practices and growing the finest organic produce. Proud to feed our community with healthy, fresh crops.";
      case 'transport':
        return "Reliable logistics partner ensuring fresh produce reaches its destination safely and on time. Excellence in every delivery.";
      default:
        return "Welcome to my profile! I'm excited to be part of this amazing agricultural community.";
    }
  };

  const getDashboardIcon = (userType?: string) => {
    switch (userType) {
      case 'retail': return Package;
      case 'farmer': return Sprout;
      case 'transport': return Truck;
      default: return Building;
    }
  };

  const getStatCards = (userType?: string, profile?: UserProfile) => {
    const baseStats = [
      {
        title: "Member Since",
        value: profile?.joinedDate ? new Date(profile.joinedDate).getFullYear().toString() : "2024",
        icon: Calendar,
        color: "text-green-600"
      },
      {
        title: "Rating",
        value: `${profile?.rating || 4.8}/5.0`,
        icon: Star,
        color: "text-yellow-600"
      }
    ];

    switch (userType) {
      case 'retail':
        return [
          ...baseStats,
          {
            title: "Total Orders",
            value: profile?.totalOrders?.toString() || "156",
            icon: Package,
            color: "text-green-600"
          },
          {
            title: "Revenue",
            value: `₹${(profile?.totalRevenue || 245000).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600"
          }
        ];
      case 'farmer':
        return [
          ...baseStats,
          {
            title: "Products Sold",
            value: profile?.totalOrders?.toString() || "89",
            icon: Sprout,
            color: "text-green-600"
          },
          {
            title: "Revenue",
            value: `₹${(profile?.totalRevenue || 180000).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600"
          }
        ];
      case 'transport':
        return [
          ...baseStats,
          {
            title: "Deliveries",
            value: profile?.completedDeliveries?.toString() || "342",
            icon: Truck,
            color: "text-green-600"
          },
          {
            title: "Revenue",
            value: `₹${(profile?.totalRevenue || 125000).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600"
          }
        ];
      default:
        return baseStats;
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
        // Enhanced profile data with mock statistics based on user type
        const enhancedProfile = {
          ...data,
          photoURL: (user as any).photoURL || data.photoURL,
          verified: true,
          rating: 4.8,
          location: data.location || "Mumbai, Maharashtra",
          bio: data.bio || getDefaultBio(data.userType),
          joinedDate: data.createdAt,
          lastActive: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailUpdates: true,
            smsAlerts: false,
            darkMode: false,
            language: "en",
            ...data.preferences
          },
          // Add role-specific stats
          ...(data.userType === 'retail' && {
            totalOrders: 156,
            totalRevenue: 245000,
            role: "Store Manager"
          }),
          ...(data.userType === 'farmer' && {
            totalOrders: 89,
            totalRevenue: 180000,
            role: "Organic Farmer"
          }),
          ...(data.userType === 'transport' && {
            completedDeliveries: 342,
            totalRevenue: 125000,
            role: "Fleet Manager"
          })
        };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // Set form default values when profile data is loaded or dialog opens
  useEffect(() => {
    if (userProfile && isEditDialogOpen) {
        form.reset({
            username: userProfile.username || "",
            branchName: userProfile.branchName || "",
            phone: userProfile.phone || "",
            email: userProfile.email || "",
            location: userProfile.location || "",
            bio: userProfile.bio || "",
            website: userProfile.website || "",
            company: userProfile.company || "",
            role: userProfile.role || "",
        });
        setImagePreview(userProfile.photoURL || null);
        setTempBio(userProfile.bio || "");
    }
  }, [userProfile, isEditDialogOpen, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("photo", file);
    }
  };

  async function uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!user) return reject("No user found");
        
        const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log("=== PROFILE UPDATE START ===");
    console.log("onSubmit called with values:", values);
    console.log("User object:", user);
    console.log("User UID:", user?.uid);
    
    if (!user || !user.uid) {
      console.error("No user or user.uid found, aborting submit");
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "User not properly authenticated",
      });
      return;
    }
    
    setIsUpdating(true);
    setUploadProgress(null);

    try {
        console.log("Profile update - Form values:", values);
        
        let photoURL = userProfile?.photoURL;
        
        // Skip photo upload for now to simplify debugging
        if (values.photo instanceof File) {
            console.log("Photo upload detected, uploading...");
            try {
              photoURL = await uploadImage(values.photo);
              console.log("Photo uploaded successfully:", photoURL);
              if ((user as any).photoURL !== photoURL) {
                await updateProfile(user as any, { photoURL });
              }
            } catch (photoError) {
              console.error("Photo upload failed:", photoError);
              // Continue without photo update
            }
        }
        
        const { photo, ...profileData } = values;
        const updateData = { ...profileData, photoURL };
        
        console.log("Profile update - Sending data:", updateData);
        console.log("API URL:", `/api/users/${user.uid}`);

        const response = await fetch(`/api/users/${user.uid}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        console.log("Profile update - Response status:", response.status);
        console.log("Profile update - Response headers:", response.headers);
        
        const responseData = await response.json();
        console.log("Profile update - Response data:", responseData);
        
        if (!response.ok) {
            console.error("Profile update - Error response:", responseData);
            throw new Error(responseData.message || `HTTP ${response.status}: Failed to update profile`);
        }

        console.log("Profile update successful!");
        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
        });
        
        // Skip user reload for demo mode
        if (typeof (user as any).reload === 'function') {
          await (user as any).reload();
        }
        
        await fetchUserProfile();
        setIsEditDialogOpen(false);
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
    if (!userProfile) return <p>No profile data available</p>;

    const details = [
      { label: "Email", value: userProfile.email, icon: Mail },
      { label: "Phone", value: userProfile.phone || "Not provided", icon: Phone },
      { label: "Location", value: userProfile.location || "Not specified", icon: MapPin },
      { label: "Company", value: userProfile.company || "Not specified", icon: Building },
      { label: "Role", value: userProfile.role || userProfile.userType, icon: User },
      { label: userProfile.userType === 'hub' ? "Branch ID" : "User Type", value: userProfile.userType === 'hub' ? userProfile.branchId : userProfile.userType, icon: Building },
      { label: "Member Since", value: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A', icon: Calendar },
      { label: "Last Active", value: userProfile.lastActive ? "Active now" : "Recently", icon: Activity },
      { label: "Verification Status", value: userProfile.verified ? "Verified" : "Pending", icon: Shield },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {details.map(item => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                        <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <p className="text-base font-semibold text-gray-900 truncate">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  const DashboardIcon = getDashboardIcon(userProfile?.userType);
  const statCards = getStatCards(userProfile?.userType, userProfile || undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container mx-auto space-y-6 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Profile Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage your account and preferences
            </p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
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

        {loading ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-[300px]" />
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </Card>
              ))}
            </div>
          </div>
        ) : userProfile ? (
          <>
            {/* Profile Header Card */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white via-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center text-center lg:text-left">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                        <AvatarImage src={userProfile.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl">
                          <User className="h-16 w-16" />
                        </AvatarFallback>
                      </Avatar>
                      {userProfile.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {userProfile.username || userProfile.branchName}
                      </h2>
                      <p className="text-lg text-gray-600 mt-1">{userProfile.email}</p>
                      <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                        <DashboardIcon className="h-5 w-5 text-green-600" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {userProfile.role || userProfile.userType}
                        </Badge>
                        {userProfile.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio and Details */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">About</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingBio(!isEditingBio)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      {isEditingBio ? (
                        <div className="space-y-3">
                          <textarea
                            value={tempBio}
                            onChange={(e) => setTempBio(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" disabled={isUpdating} onClick={async () => {
                              if (!user) return;
                              
                              try {
                                setIsUpdating(true);
                                const response = await fetch(`/api/users/${user.uid}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ bio: tempBio }),
                                });

                                if (!response.ok) {
                                  throw new Error("Failed to update bio");
                                }

                                setUserProfile(prev => prev ? {...prev, bio: tempBio} : null);
                                setIsEditingBio(false);
                                
                                toast({
                                  title: "Bio Updated",
                                  description: "Your bio has been updated successfully.",
                                });
                              } catch (error) {
                                toast({
                                  variant: "destructive",
                                  title: "Update Failed",
                                  description: "Failed to update bio. Please try again.",
                                });
                              } finally {
                                setIsUpdating(false);
                              }
                            }}>
                              {isUpdating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                              {isUpdating ? 'Saving...' : 'Save'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setTempBio(userProfile.bio || "");
                                setIsEditingBio(false);
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 leading-relaxed">
                          {userProfile.bio || getDefaultBio(userProfile.userType)}
                        </p>
                      )}
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">{userProfile.location}</span>
                        </div>
                      )}
                      {userProfile.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">{userProfile.phone}</span>
                        </div>
                      )}
                      {userProfile.lastActive && (
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700">Active now</span>
                        </div>
                      )}
                      {userProfile.joinedDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">
                            Joined {new Date(userProfile.joinedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Details Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Details
                </CardTitle>
                <CardDescription>
                  Your complete profile information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderProfileDetails()}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Performance Overview</h3>
                    <p className="text-green-100">Your business is performing excellently this month!</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-green-100 text-sm">Success Rate</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">Growth</span>
                    </div>
                    <div className="text-2xl font-bold">+24%</div>
                    <div className="text-green-100 text-sm">vs last month</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5" />
                      <span className="font-semibold">Rating</span>
                    </div>
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-green-100 text-sm">Customer satisfaction</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5" />
                      <span className="font-semibold">Response</span>
                    </div>
                    <div className="text-2xl font-bold">2.3h</div>
                    <div className="text-green-100 text-sm">Avg response time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-50`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { 
                          action: "Order #ORD-2024-156 completed", 
                          description: "Successfully delivered 25kg tomatoes to Green Valley Market",
                          time: "2 hours ago", 
                          icon: CheckCircle, 
                          color: "text-green-600",
                          badge: "Completed"
                        },
                        { 
                          action: "Profile information updated", 
                          description: "Added new contact information and business details",
                          time: "1 day ago", 
                          icon: User, 
                          color: "text-green-600",
                          badge: "Updated"
                        },
                        { 
                          action: "New supplier message received", 
                          description: "Fresh Farms Co. sent you a new product catalog",
                          time: "3 days ago", 
                          icon: Mail, 
                          color: "text-emerald-600",
                          badge: "Message"
                        },
                        { 
                          action: "Payment processed successfully", 
                          description: "₹15,750 payment received for order #ORD-2024-154",
                          time: "5 days ago", 
                          icon: CreditCard, 
                          color: "text-green-600",
                          badge: "Payment"
                        },
                        { 
                          action: "New product listing created", 
                          description: "Added 'Organic Spinach - Premium Grade' to inventory",
                          time: "1 week ago", 
                          icon: Package, 
                          color: "text-emerald-600",
                          badge: "Product"
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="p-2 rounded-full bg-white shadow-sm">
                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {activity.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full">
                          <Activity className="mr-2 h-4 w-4" />
                          View All Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { 
                          label: "Update Profile", 
                          description: "Edit your personal information",
                          icon: User, 
                          color: "bg-green-500" 
                        },
                        { 
                          label: "Change Password", 
                          description: "Update your security credentials",
                          icon: Lock, 
                          color: "bg-emerald-500" 
                        },
                        { 
                          label: "Notification Settings", 
                          description: "Manage your alert preferences",
                          icon: Bell, 
                          color: "bg-green-500" 
                        },
                        { 
                          label: "Privacy Settings", 
                          description: "Control your data visibility",
                          icon: Shield, 
                          color: "bg-teal-500" 
                        },
                        { 
                          label: "Business Verification", 
                          description: "Verify your business credentials",
                          icon: Award, 
                          color: "bg-yellow-500" 
                        },
                        { 
                          label: "Export Data", 
                          description: "Download your account data",
                          icon: Download, 
                          color: "bg-blue-500" 
                        },
                      ].map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start h-16 p-4"
                        >
                          <div className={`p-2 rounded-lg ${action.color} mr-4 flex-shrink-0`}>
                            <action.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{action.label}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>Your recent activities and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { 
                          title: "Profile Completed", 
                          description: "You've completed your profile setup with all required information including business verification", 
                          time: "Today", 
                          icon: CheckCircle, 
                          color: "text-green-600",
                          status: "completed"
                        },
                        { 
                          title: "Business Verification Approved", 
                          description: "Your business documents have been reviewed and approved by our verification team", 
                          time: "Yesterday", 
                          icon: Award, 
                          color: "text-yellow-600",
                          status: "completed"
                        },
                        { 
                          title: "First Successful Transaction", 
                          description: "Successfully completed your first order worth ₹12,500 with 5-star customer rating", 
                          time: "2 days ago", 
                          icon: Package, 
                          color: "text-green-600",
                          status: "completed"
                        },
                        { 
                          title: "Payment Method Added", 
                          description: "Successfully linked your bank account for seamless transactions", 
                          time: "3 days ago", 
                          icon: CreditCard, 
                          color: "text-blue-600",
                          status: "completed"
                        },
                        { 
                          title: "Account Verified", 
                          description: "Your email and phone number have been successfully verified", 
                          time: "1 week ago", 
                          icon: Shield, 
                          color: "text-emerald-600",
                          status: "completed"
                        },
                        { 
                          title: "Welcome to Manvasaam", 
                          description: "Account created and welcome email sent. Started your journey with us!", 
                          time: "2 weeks ago", 
                          icon: User, 
                          color: "text-purple-600",
                          status: "completed"
                        },
                      ].map((item, index) => (
                        <div key={index} className="relative">
                          {index < 5 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                          )}
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-full ${item.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'} relative z-10`}>
                              <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                <Badge 
                                  variant={item.status === 'completed' ? 'default' : 'secondary'}
                                  className={item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {item.status === 'completed' ? 'Completed' : 'Pending'}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-2">{item.description}</p>
                              <p className="text-sm text-gray-500">{item.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">Achievement Unlocked!</h4>
                          </div>
                          <p className="text-green-700 text-sm">
                            Congratulations! You've completed all onboarding steps and are now a verified member of our community.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Preferences */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { 
                          label: "Email Notifications", 
                          description: "Receive updates about orders, payments, and account activity",
                          key: "emailUpdates", 
                          icon: Mail 
                        },
                        { 
                          label: "SMS Alerts", 
                          description: "Get instant notifications for urgent updates and delivery status",
                          key: "smsAlerts", 
                          icon: Smartphone 
                        },
                        { 
                          label: "Push Notifications", 
                          description: "Browser notifications for real-time updates and messages",
                          key: "notifications", 
                          icon: Bell 
                        },
                        { 
                          label: "Marketing Communications", 
                          description: "Receive promotional offers, newsletters, and product updates",
                          key: "marketing", 
                          icon: Globe 
                        },
                        { 
                          label: "Weekly Reports", 
                          description: "Get weekly summary of your business performance and analytics",
                          key: "weeklyReports", 
                          icon: TrendingUp 
                        },
                      ].map((pref, index) => (
                        <div key={index} className="flex items-start justify-between p-4 rounded-lg border">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-gray-100 mt-1">
                              <pref.icon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{pref.label}</div>
                              <div className="text-sm text-gray-500 mt-1">{pref.description}</div>
                            </div>
                          </div>
                          <Switch 
                            checked={Boolean(userProfile.preferences?.[pref.key as keyof typeof userProfile.preferences]) || false}
                            onCheckedChange={(checked) => {
                              // In real app, update preferences
                              console.log(`${pref.key}: ${checked}`);
                              toast({
                                title: "Preference Updated",
                                description: `${pref.label} has been ${checked ? 'enabled' : 'disabled'}.`,
                              });
                            }}
                          />
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Data & Privacy</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <Button variant="outline" className="justify-start h-auto p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <Download className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Download Your Data</div>
                                <div className="text-sm text-gray-500">Export all your account data and transaction history</div>
                              </div>
                            </div>
                          </Button>
                          <Button variant="outline" className="justify-start h-auto p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-red-100">
                                <X className="h-4 w-4 text-red-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Delete Account</div>
                                <div className="text-sm text-gray-500">Permanently delete your account and all associated data</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-900">Security Status: Strong</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Your account is well-protected with verified email, strong password, and active monitoring.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start h-auto p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                              <Lock className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Change Password</div>
                              <div className="text-sm text-gray-500">Update your account password for better security</div>
                            </div>
                            <Badge variant="secondary">Last changed 3 months ago</Badge>
                          </div>
                        </Button>

                        <Button variant="outline" className="w-full justify-start h-auto p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                              <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Two-Factor Authentication</div>
                              <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                          </div>
                        </Button>

                        <Button variant="outline" className="w-full justify-start h-auto p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              <Globe className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Privacy Settings</div>
                              <div className="text-sm text-gray-500">Control who can see your profile and activity</div>
                            </div>
                          </div>
                        </Button>

                        <Button variant="outline" className="w-full justify-start h-auto p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100">
                              <Activity className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Login Activity</div>
                              <div className="text-sm text-gray-500">View recent login attempts and active sessions</div>
                            </div>
                          </div>
                        </Button>

                        <Button variant="outline" className="w-full justify-start h-auto p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">Security Alerts</div>
                              <div className="text-sm text-gray-500">Manage alerts for suspicious account activity</div>
                            </div>
                          </div>
                        </Button>
                      </div>

                      <Separator />

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-900 mb-1">Security Recommendation</h4>
                            <p className="text-sm text-yellow-700 mb-3">
                              Consider enabling backup authentication methods and regularly reviewing your login activity.
                            </p>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                              Review Security Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Failed to load profile data</p>
          </Card>
        )}
      </div>
    </div>
  );
}
