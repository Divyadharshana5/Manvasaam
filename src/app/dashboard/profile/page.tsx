
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
  username: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  branchName: z.string().min(2, "Branch name must be at least 2 characters").optional().or(z.literal("")),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  photo: z.any().optional(),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);



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
        console.log("Enhanced profile data:", enhancedProfile);
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
        setHasUnsavedChanges(false);
    }
  }, [userProfile, isEditDialogOpen, form]);

  // Watch for form changes to detect unsaved changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Debug effect to track profile data changes
  useEffect(() => {
    console.log("Profile data changed:", {
      userProfile,
      loading: authLoading || profileLoading,
      user: user?.uid
    });
  }, [userProfile, authLoading, profileLoading, user]);

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
        
        // Update local state immediately for better UX
        setUserProfile(prev => prev ? { ...prev, ...updateData } : null);
        
        toast({
            title: "✅ Profile Updated Successfully",
            description: "Your profile information has been saved and updated.",
            duration: 3000,
        });
        
        // Skip user reload for demo mode
        if (typeof (user as any).reload === 'function') {
          await (user as any).reload();
        }
        
        // Refresh profile data from server
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
