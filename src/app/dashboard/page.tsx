"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

interface UserProfile {
  username?: string;
  userType?: string;
  branchName?: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        // This part needs to be updated to fetch from your new API
        // For now, we'll just display a message.
        // In a real app, you would fetch from /api/users/{user.uid}
      }
    }
    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <h2 className="text-3xl font-bold tracking-tight">Loading Dashboard...</h2>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}!
            </p>
          </div>
        </div>
        
        {/* Placeholder for role-specific dashboard content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </Header>
                <CardContent>
                    <p>User details are now stored in MongoDB.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Feature 2</CardTitle>
                </Header>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
