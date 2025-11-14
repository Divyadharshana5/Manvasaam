"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Wifi, Settings as Cog } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function TransportSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [defaultHub, setDefaultHub] = useState("");

  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/transport">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Transport Settings</h1>
              <p className="text-muted-foreground">
                Configure transport preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">General</CardTitle>
              <CardDescription>
                Core settings for your transport hub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive transport alerts
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(v) => setNotificationsEnabled(Boolean(v))}
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Auto-assign drivers</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign drivers to new deliveries
                  </p>
                </div>
                <Switch
                  checked={autoAssignDrivers}
                  onCheckedChange={(v) => setAutoAssignDrivers(Boolean(v))}
                />
              </div>

              <div className="mb-3">
                <p className="font-medium">Default Hub</p>
                <Input
                  placeholder="Enter hub name or ID"
                  value={defaultHub}
                  onChange={(e) => setDefaultHub(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Integrations
              </CardTitle>
              <CardDescription>
                Connect GPS and third-party services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">GPS Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Enable vehicle tracking
                    </p>
                  </div>
                </div>
                <Switch
                  checked={gpsEnabled}
                  onCheckedChange={(v) => setGpsEnabled(Boolean(v))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telematics API</p>
                    <p className="text-sm text-muted-foreground">
                      Connect to your telematics provider
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Advanced</CardTitle>
            <CardDescription>
              Advanced transport settings and maintenance thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Manage advanced preferences like driver allocation and service
              reminders.
            </p>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="ghost">Reset to Defaults</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
