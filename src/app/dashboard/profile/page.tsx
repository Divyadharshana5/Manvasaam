
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
          photoURL: user.photoURL || data.photoURL,
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
            if (user.photoURL !== photoURL) {
              await updateProfile(user, { photoURL });
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
        
        await user.reload(); 
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.profile.title}</h2>
            <p className="text-muted-foreground">
              {t.profile.description}
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-2 border-primary/10">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle>{t.profile.cardTitle}</CardTitle>
                <CardDescription>{t.profile.cardDescription}</CardDescription>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">{t.profile.editProfile}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.profile.editDialogTitle}</DialogTitle>
                        <DialogDescription>
                            {t.profile.editDialogDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.profile.profilePicture}</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={imagePreview || undefined} />
                                            <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                                        </Avatar>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs"/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            {userProfile?.userType === 'hub' ? (
                                <FormField
                                    control={form.control}
                                    name="branchName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.profile.branchName}</FormLabel>
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
                                            <FormLabel>{t.profile.username}</FormLabel>
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
                                        <FormLabel>{t.profile.email}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="m@example.com" {...field} />
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
                                        <FormLabel>{t.profile.phone}</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="123-456-7890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             {uploadProgress !== null && (
                                <Progress value={uploadProgress} />
                            )}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">{t.profile.cancel}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.profile.saveChanges}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                 <div className="flex items-center space-x-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ) : userProfile ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-28 w-28 border-4 border-primary/20">
                        <AvatarImage src={userProfile.photoURL || undefined} />
                        <AvatarFallback>
                            <User className="h-12 w-12" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-3xl font-bold text-center sm:text-left">{userProfile.username || userProfile.branchName}</h3>
                        <p className="text-muted-foreground text-center sm:text-left text-lg">{userProfile.email}</p>
                    </div>
                </div>
                <div className="border-t border-dashed pt-6">
                 {renderProfileDetails()}
                </div>
              </div>
            ) : (
              <p>{t.profile.loadError}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
