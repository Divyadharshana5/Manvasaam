"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  username?: string;
  userType?: string;
  branchName?: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  
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
      } else if (!loading) {
        setProfileLoading(false);
      }
    }
    fetchUserProfile();
  }, [user, loading]);

  const displayName = userProfile?.username || userProfile?.branchName || user?.email;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {loading || profileLoading ? (
          <h2 className="text-3xl font-bold tracking-tight">Loading Dashboard...</h2>
        ) : (
          <>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                  Welcome back, {displayName}!
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>User Type:</strong> {userProfile?.userType}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Feature 2</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Coming soon...</p>
                    </CardContent>
                </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
