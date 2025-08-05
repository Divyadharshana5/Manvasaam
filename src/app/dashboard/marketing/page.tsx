"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function MarketingPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
            <p className="text-muted-foreground">
              Tools and analytics for your marketing campaigns.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This section is under construction. Check back later for exciting new marketing tools!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>We are working hard to bring you features like campaign tracking, analytics, and promotional tools.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
