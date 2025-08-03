"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        // Check farmers, then customers, then hubs
        const farmerDoc = await getDoc(doc(db, "farmers", user.uid));
        if (farmerDoc.exists()) {
          setUserData({ ...farmerDoc.data(), role: 'Farmer' });
          setLoading(false);
          return;
        }
        const customerDoc = await getDoc(doc(db, "customers", user.uid));
        if (customerDoc.exists()) {
          setUserData({ ...customerDoc.data(), role: 'Customer' });
          setLoading(false);
          return;
        }
        const hubDoc = await getDoc(doc(db, "hubs", user.uid));
        if (hubDoc.exists()) {
          setUserData({ ...hubDoc.data(), role: 'Hub' });
          setLoading(false);
          return;
        }
        // If user exists in auth but not in any collection, handle appropriately
        console.error("User document not found!");
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Redirect is handled by the hook
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user.displayName}! You are logged in as a {userData?.role}.
            </p>
          </div>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
                {userData?.role === "Farmer" && (
                    <div>
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                    </div>
                )}
                {userData?.role === "Customer" && (
                    <div>
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                    </div>
                )}
                {userData?.role === "Hub" && (
                     <div>
                        <p><strong>Branch Name:</strong> {userData.branchName}</p>
                        <p><strong>Branch ID:</strong> {userData.branchId}</p>
                        <p><strong>Admin Email:</strong> {userData.email}</p>
                    </div>
                )}
                 {!userData && <p>Could not load user details.</p>}
            </CardContent>
        </Card>
        
        {/* Placeholder for role-specific dashboard content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>Feature 1</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
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
      </div>
    </AppLayout>
  );
}
