"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function MatchmakingPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Matchmaking</h2>
            <p className="text-muted-foreground">
              Intelligent crop matching between farmers and buyers.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Our intelligent matchmaking tool is under construction. Check back soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>We are building an advanced system to connect farmers and buyers based on crop availability, location, and pricing to provide intelligent recommendations.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
