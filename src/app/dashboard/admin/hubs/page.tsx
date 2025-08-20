import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getAllHubs } from "@/lib/hub-db";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  MapPin,
  Building2,
  Users,
  Package,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import Link from "next/link";
import { Hub } from "@/types/hub";

async function getUserProfile(uid: string) {
  // This would typically fetch from your database
  // For now, returning mock data for admin
  return {
    uid,
    userType: "admin",
    name: "Admin User",
    email: "admin@example.com",
  };
}

export default async function HubManagementPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  if (!isFirebaseInitialized || !adminAuth) {
    redirect("/");
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    redirect("/");
  }

  const userProfile = await getUserProfile(decodedToken.uid);
  
  // Only allow admin users
  if (userProfile.userType !== "admin") {
    redirect("/dashboard");
  }

  const hubs = await getAllHubs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hub Management</h2>
            <p className="text-muted-foreground">
              Manage all hubs in the network
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/hubs/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Hub
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hubs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hubs.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Hubs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hubs.filter(h => h.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hubs.reduce((sum, h) => sum + h.capacity, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                kg storage capacity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Load</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hubs.reduce((sum, h) => sum + h.currentLoad, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                kg currently stored
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hubs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Hubs</CardTitle>
            <CardDescription>
              Manage and monitor all hubs in the network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hubs.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hubs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new hub.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/dashboard/admin/hubs/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Hub
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hubs.map((hub) => (
                  <Card key={hub.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{hub.branchName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {hub.location}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(hub.status)}>
                          {hub.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p><strong>Branch ID:</strong> {hub.branchId}</p>
                        <p><strong>Pincode:</strong> {hub.pincode}</p>
                        <p><strong>Phone:</strong> {hub.phone}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Capacity</p>
                          <p className="font-medium">{hub.capacity.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Load</p>
                          <p className="font-medium">{hub.currentLoad.toLocaleString()} kg</p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((hub.currentLoad / hub.capacity) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {((hub.currentLoad / hub.capacity) * 100).toFixed(1)}% capacity used
                      </p>

                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link href={`/dashboard/admin/hubs/${hub.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link href={`/dashboard/admin/hubs/${hub.id}/edit`}>
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
