
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
  Sprout
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
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).optional().or(z.literal('')),
  branchName: z.string().min(2, { message: "Branch name must be at least 2 characters." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional().or(z.literal('')),
  photo: z.any().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters." }).optional().or(z.literal('')),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
});


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
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
    defaultValues: {},
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
        color: "text-blue-600"
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
            color: "text-purple-600"
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
            color: "text-purple-600"
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
            color: "text-purple-600"
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
          title: t.profile.updateErrorTitle,
          description: t.profile.loadError,
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
    if (!user) return;
    setIsUpdating(true);
    setUploadProgress(null);

    try {
        let photoURL = userProfile?.photoURL;
        
        if (values.photo instanceof File) {
            photoURL = await uploadImage(values.photo);
            if ((user as any).photoURL !== photoURL) {
              await updateProfile(user as any, { photoURL });
            }
        }
        
        const { photo, ...profileData } = values;

        const response = await fetch(`/api/users/${user.uid}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...profileData, photoURL }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
        }

        toast({
            title: t.profile.updateSuccessTitle,
            description: t.profile.updateSuccessDescription,
        });
        
        await (user as any).reload(); 
        await fetchUserProfile();
        setIsEditDialogOpen(false);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.profile.updateErrorTitle,
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
      setUploadProgress(null);
    }
  }

  const loading = authLoading || profileLoading;

  const renderProfileDetails = () => {
    if (!userProfile) return <p>{t.profile.noProfileData}</p>;

    const details = [
      { label: t.profile.emailLabel, value: userProfile.email, icon: Mail },
      { label: t.profile.phoneLabel, value: userProfile.phone, icon: Phone },
      { label: userProfile.userType === 'hub' ? t.profile.branchIdLabel : t.profile.userTypeLabel, value: userProfile.userType === 'hub' ? userProfile.branchId : userProfile.userType, icon: Building },
      { label: t.profile.memberSinceLabel, value: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A', icon: Calendar },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {details.filter(item => item.value).map(item => (
                <div key={item.label} className="flex items-center gap-4">
                    <item.icon className="h-8 w-8 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-semibold">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  const DashboardIcon = getDashboardIcon(userProfile?.userType);
  const statCards = getStatCards(userProfile?.userType, userProfile || undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto space-y-6 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage your account and preferences
            </p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
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
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white via-blue-50 to-purple-50">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center text-center lg:text-left">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                        <AvatarImage src={userProfile.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
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
                        <DashboardIcon className="h-5 w-5 text-blue-600" />
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                            <Button size="sm" onClick={() => {
                              // In real app, save to backend
                              setUserProfile(prev => prev ? {...prev, bio: tempBio} : null);
                              setIsEditingBio(false);
                            }}>
                              <Save className="h-4 w-4 mr-1" />
                              Save
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
                        { action: "Order completed", time: "2 hours ago", icon: CheckCircle, color: "text-green-600" },
                        { action: "Profile updated", time: "1 day ago", icon: User, color: "text-blue-600" },
                        { action: "New message received", time: "3 days ago", icon: Mail, color: "text-purple-600" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
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
                        { label: "Update Profile", icon: User, color: "bg-blue-500" },
                        { label: "Change Password", icon: Lock, color: "bg-purple-500" },
                        { label: "Notification Settings", icon: Bell, color: "bg-green-500" },
                        { label: "Privacy Settings", icon: Shield, color: "bg-orange-500" },
                      ].map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start h-12"
                        >
                          <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                            <action.icon className="h-4 w-4 text-white" />
                          </div>
                          {action.label}
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
                          description: "You've completed your profile setup", 
                          time: "Today", 
                          icon: CheckCircle, 
                          color: "text-green-600" 
                        },
                        { 
                          title: "First Order", 
                          description: "Successfully placed your first order", 
                          time: "2 days ago", 
                          icon: Package, 
                          color: "text-blue-600" 
                        },
                        { 
                          title: "Account Verified", 
                          description: "Your account has been verified", 
                          time: "1 week ago", 
                          icon: Shield, 
                          color: "text-purple-600" 
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`p-2 rounded-full bg-gray-100`}>
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-gray-600">{item.description}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                          </div>
                        </div>
                      ))}
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
                        { label: "Email Notifications", key: "emailUpdates", icon: Mail },
                        { label: "SMS Alerts", key: "smsAlerts", icon: Smartphone },
                        { label: "Push Notifications", key: "notifications", icon: Bell },
                      ].map((pref, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <pref.icon className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">{pref.label}</span>
                          </div>
                          <Switch 
                            checked={userProfile.preferences?.[pref.key as keyof typeof userProfile.preferences] || false}
                            onCheckedChange={(checked) => {
                              // In real app, update preferences
                              console.log(`${pref.key}: ${checked}`);
                            }}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Security */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="mr-3 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-3 h-4 w-4" />
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-3 h-4 w-4" />
                        Privacy Settings
                      </Button>
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
