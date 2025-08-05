
"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
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
import { Loader2, User } from "lucide-react";
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
import Image from "next/image";


interface UserProfile {
  username?: string;
  email?: string;
  userType?: string;
  branchName?: string;
  branchId?: string;
  phone?: string;
  createdAt?: string;
  photoURL?: string;
}

const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).optional().or(z.literal('')),
  branchName: z.string().min(2, { message: "Branch name must be at least 2 characters." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional().or(z.literal('')),
  photo: z.any().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
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

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {},
  });

  const fetchUserProfile = async () => {
    if (user) {
      try {
        setProfileLoading(true);
        const response = await fetch(`/api/users/${user.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        setUserProfile({
          ...data,
          photoURL: user.photoURL || data.photoURL,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load user profile.",
        });
      } finally {
        setProfileLoading(false);
      }
    } else if (!authLoading) {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user, authLoading]);

  // Set form default values when profile data is loaded or dialog opens
  useEffect(() => {
    if (userProfile && isEditDialogOpen) {
        form.reset({
            username: userProfile.username || "",
            branchName: userProfile.branchName || "",
            phone: userProfile.phone || "",
            email: userProfile.email || "",
        });
        setImagePreview(userProfile.photoURL || null);
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
            title: "Success",
            description: "Your profile has been updated successfully.",
        });
        setIsEditDialogOpen(false);
        // We need to re-authenticate or refresh token to see auth changes reflected immediately
        // For now, we just refetch firestore data
        await user.reload(); 
        fetchUserProfile();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
      setUploadProgress(null);
    }
  }

  const loading = authLoading || profileLoading;

  const renderProfileDetails = () => {
    if (!userProfile) return <p>No profile data found.</p>;

    const details = [
      { label: "Username", value: userProfile.username },
      { label: "Branch Name", value: userProfile.branchName },
      { label: "Branch ID", value: userProfile.branchId },
      { label: "Email", value: userProfile.email },
      { label: "Phone", value: userProfile.phone },
      { label: "User Type", value: userProfile.userType },
      { label: "Member Since", value: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.filter(item => item.value).map(item => (
                <div key={item.label}>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-lg">{item.value}</p>
                </div>
            ))}
        </div>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
            <p className="text-muted-foreground">
              View and manage your account details.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your personal and account details.</CardDescription>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
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
                                            <FormLabel>Username</FormLabel>
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
                                        <FormLabel>Phone Number</FormLabel>
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
                                    <Button type="button" variant="secondary">Cancel</Button>
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
                <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={userProfile.photoURL || undefined} />
                        <AvatarFallback>
                            <User className="h-12 w-12" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-2xl font-bold">{userProfile.username || userProfile.branchName}</h3>
                        <p className="text-muted-foreground">{userProfile.email}</p>
                    </div>
                </div>
                {renderProfileDetails()}
              </div>
            ) : (
              <p>Could not load user profile.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

    
