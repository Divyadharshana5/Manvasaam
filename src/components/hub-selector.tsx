"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Building2, 
  Clock, 
  Package,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Hub } from "@/types/hub";

interface HubSelectorProps {
  farmerId: string;
  onHubSelected?: (hub: Hub) => void;
  selectedHubId?: string;
  showAssignedOnly?: boolean;
}

export default function HubSelector({ 
  farmerId, 
  onHubSelected, 
  selectedHubId,
  showAssignedOnly = false 
}: HubSelectorProps) {
  const [assignedHub, setAssignedHub] = useState<Hub | null>(null);
  const [allHubs, setAllHubs] = useState<Hub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFarmerHub();
    if (!showAssignedOnly) {
      fetchAllHubs();
    }
  }, [farmerId, showAssignedOnly]);

  const fetchFarmerHub = async () => {
    try {
      const response = await fetch(`/api/farmers/assign-hub?farmerId=${farmerId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Farmer hub assignment:', data);
        setAssignedHub(data.hub);
        if (onHubSelected) {
          onHubSelected(data.hub);
        }
      } else if (response.status === 404) {
        console.log('No hub assigned to farmer yet');
        setAssignedHub(null);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching farmer hub:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllHubs = async () => {
    try {
      const response = await fetch("/api/hubs");
      if (response.ok) {
        const data = await response.json();
        const activeHubs = (data.hubs || []).filter((hub: Hub) => hub.status === "active");
        setAllHubs(activeHubs);
        console.log('Fetched active hubs:', activeHubs.map(h => ({ id: h.id, name: h.branchName, location: h.location })));
      } else {
        console.error('Failed to fetch hubs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching hubs:", error);
      toast({
        title: "Error",
        description: "Failed to load available hubs",
        variant: "destructive",
      });
    }
  };

  const handleAutoAssign = async () => {
    setIsAssigning(true);
    try {
      // Get user's location
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch("/api/farmers/assign-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId,
          coordinates: { latitude, longitude },
          assignmentType: "auto",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign hub");
      }

      setAssignedHub(data.hub);
      if (onHubSelected) {
        onHubSelected(data.hub);
      }

      toast({
        title: "Hub Assigned Successfully",
        description: `You have been assigned to ${data.hub.branchName}`,
      });
    } catch (error: any) {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign hub automatically",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleManualAssign = async (hubId: string) => {
    setIsAssigning(true);
    try {
      const response = await fetch("/api/farmers/assign-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId,
          hubId,
          assignmentType: "manual",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign hub");
      }

      setAssignedHub(data.hub);
      if (onHubSelected) {
        onHubSelected(data.hub);
      }

      toast({
        title: "Hub Assigned Successfully",
        description: `You have been assigned to ${data.hub.branchName}`,
      });
    } catch (error: any) {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign hub",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading hub information...</span>
        </CardContent>
      </Card>
    );
  }

  if (showAssignedOnly && assignedHub) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Assigned Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold">{assignedHub.branchName}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {assignedHub.location}
              </p>
              <p className="text-sm text-gray-600">
                {assignedHub.address}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {assignedHub.branchId}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {assignedHub.operatingHours.open} - {assignedHub.operatingHours.close}
                </Badge>
              </div>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignedHub) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Your Assigned Hub
          </CardTitle>
          <CardDescription>
            Products will be delivered to this hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border rounded-lg bg-green-50">
              <div className="space-y-2">
                <h3 className="font-semibold">{assignedHub.branchName}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {assignedHub.location}
                </p>
                <p className="text-sm text-gray-600">
                  {assignedHub.address}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {assignedHub.branchId}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {assignedHub.operatingHours.open} - {assignedHub.operatingHours.close}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Capacity: {assignedHub.capacity.toLocaleString()} kg</p>
                  <p>Current Load: {assignedHub.currentLoad.toLocaleString()} kg</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            {!showAssignedOnly && (
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-3">
                  Want to change your hub assignment?
                </p>
                <Select onValueChange={handleManualAssign} disabled={isAssigning}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a different hub" />
                  </SelectTrigger>
                  <SelectContent>
                    {allHubs
                      .filter(hub => hub.id !== assignedHub.id)
                      .map((hub) => (
                        <SelectItem key={hub.id} value={hub.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{hub.branchName}</span>
                            <span className="text-xs text-gray-500">{hub.location}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          No Hub Assigned
        </CardTitle>
        <CardDescription>
          You need to be assigned to a hub before you can add products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Choose how you'd like to be assigned to a hub
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleAutoAssign} 
              disabled={isAssigning}
              className="w-full"
            >
              {isAssigning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Auto-assign to Nearest Hub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Manually:</label>
              <Select onValueChange={handleManualAssign} disabled={isAssigning}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a hub" />
                </SelectTrigger>
                <SelectContent>
                  {allHubs.map((hub) => (
                    <SelectItem key={hub.id} value={hub.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{hub.branchName}</span>
                        <span className="text-xs text-gray-500">{hub.location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
