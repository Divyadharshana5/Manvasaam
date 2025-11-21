"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditRoutePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  // Mock initial data — replace with API fetch when available
  const initial = {
    id,
    name: id === "RT-001" ? "Downtown Circuit" : `Route ${id}`,
    distance: "25.4 km",
    estimatedTime: "45 min",
    stops: "8",
    assignedVehicle: "TRK-001",
  };

  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [stops, setStops] = useState("");
  const [assignedVehicle, setAssignedVehicle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // populate form with initial/mock data
    setName(initial.name);
    setDistance(initial.distance);
    setEstimatedTime(initial.estimatedTime);
    setStops(initial.stops);
    setAssignedVehicle(initial.assignedVehicle);
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id,
        name,
        distance,
        estimatedTime,
        stops,
        assignedVehicle,
      };
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Saved route:", payload);
      // redirect back to route details
      router.push(`/dashboard/transport/routes/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save route");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/transport/routes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Route</h1>
          <p className="text-muted-foreground">Modify route {id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Route Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Route Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="stops">Stops</Label>
              <Input
                id="stops"
                value={stops}
                onChange={(e) => setStops(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="assignedVehicle">Assigned Vehicle</Label>
              <Input
                id="assignedVehicle"
                value={assignedVehicle}
                onChange={(e) => setAssignedVehicle(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/dashboard/transport/routes" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
