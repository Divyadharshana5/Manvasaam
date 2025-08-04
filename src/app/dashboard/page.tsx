"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to Manvaasam. Firebase integration has been removed.
            </p>
          </div>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Functionality Disabled</CardTitle>
            </CardHeader>
            <CardContent>
                <p>User authentication and data management have been disabled because Firebase has been removed from the project.</p>
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
