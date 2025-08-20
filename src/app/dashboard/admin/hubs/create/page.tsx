"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

const createHubSchema = z.object({
  branchName: z.string().min(2, "Branch name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  capacity: z.number().min(100, "Capacity must be at least 100 kg"),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type CreateHubForm = z.infer<typeof createHubSchema>;

export default function CreateHubPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateHubForm>({
    resolver: zodResolver(createHubSchema),
    defaultValues: {
      branchName: "",
      location: "",
      address: "",
      pincode: "",
      phone: "",
      email: "",
      capacity: 1000,
      openTime: "09:00",
      closeTime: "18:00",
    },
  });

  const onSubmit = async (data: CreateHubForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchName: data.branchName,
          location: data.location,
          address: data.address,
          pincode: data.pincode,
          phone: data.phone,
          email: data.email,
          capacity: data.capacity,
          operatingHours: {
            open: data.openTime,
            close: data.closeTime,
          },
          coordinates: data.latitude && data.longitude ? {
            latitude: data.latitude,
            longitude: data.longitude,
          } : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create hub");
      }

      toast({
        title: "Hub Created Successfully",
        description: `Hub ${data.branchName} has been created.`,
      });

      router.push("/dashboard/admin/hubs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create hub",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/hubs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hubs
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create New Hub</h2>
            <p className="text-muted-foreground">
              Add a new hub to the network
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hub Information
            </CardTitle>
            <CardDescription>
              Enter the details for the new hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch Name *</Label>
                  <Input
                    id="branchName"
                    placeholder="e.g., Central Hub Chennai"
                    {...form.register("branchName")}
                  />
                  {form.formState.errors.branchName && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.branchName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Chennai"
                    {...form.register("location")}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="600001"
                    {...form.register("pincode")}
                  />
                  {form.formState.errors.pincode && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.pincode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hub@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Storage Capacity (kg) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="1000"
                    {...form.register("capacity", { valueAsNumber: true })}
                  />
                  {form.formState.errors.capacity && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time *</Label>
                  <Input
                    id="openTime"
                    type="time"
                    {...form.register("openTime")}
                  />
                  {form.formState.errors.openTime && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.openTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time *</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    {...form.register("closeTime")}
                  />
                  {form.formState.errors.closeTime && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.closeTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Coordinates */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (Optional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="13.0827"
                    {...form.register("latitude", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="80.2707"
                    {...form.register("longitude", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Hub"}
                </Button>
                <Button asChild type="button" variant="outline" className="flex-1">
                  <Link href="/dashboard/admin/hubs">
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
