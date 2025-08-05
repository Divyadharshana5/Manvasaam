"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  username?: string;
  email?: string;
  userType?: string;
  branchName?: string;
  branchId?: string;
  phone?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error(error);
        } finally {
          setProfileLoading(false);
        }
      } else if (!authLoading) {
        // If there's no user and auth is not loading, we can stop loading profile
        setProfileLoading(false);
      }
    }
    fetchUserProfile();
  }, [user, authLoading]);

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
            <Button variant="outline">Edit Profile</Button>
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
                        <AvatarImage src={user?.photoURL || undefined} />
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
