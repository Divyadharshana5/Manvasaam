"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Hub } from "@/types/hub";

interface HubSelectorProps {
  farmerId: string;
  onHubSelected: (hub: Hub | null) => void;
}

export default function HubSelector({
  farmerId,
  onHubSelected,
}: HubSelectorProps) {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHubs();
  }, [farmerId]);

  const fetchHubs = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockHubs: Hub[] = [
        {
          id: "hub-1",
          branchName: "Maharashtra Organic Hub",
          location: "Nashik, Maharashtra",
          address: "Plot 45, MIDC Area, Nashik - 422010",
          contactPerson: "Rajesh Kumar",
          contactPhone: "+91 98765 43210",
          contactEmail: "nashik@organichub.com",
          capacity: "10,000 kg/month",
          services: ["Storage", "Processing", "Distribution"],
          status: "active",
        },
        {
          id: "hub-2",
          branchName: "South India Fresh Hub",
          location: "Bangalore, Karnataka",
          address: "Sector 12, Electronic City, Bangalore - 560100",
          contactPerson: "Priya Sharma",
          contactPhone: "+91 87654 32109",
          contactEmail: "bangalore@freshhub.com",
          capacity: "15,000 kg/month",
          services: ["Processing", "Packaging", "Quality Control"],
          status: "active",
        },
        {
          id: "hub-3",
          branchName: "Gujarat Agri Center",
          location: "Ahmedabad, Gujarat",
          address: "NH 8 Highway, Ahmedabad - 380015",
          contactPerson: "Amit Patel",
          contactPhone: "+91 76543 21098",
          contactEmail: "ahmedabad@agricenter.com",
          capacity: "8,000 kg/month",
          services: ["Storage", "Distribution"],
          status: "active",
        },
      ];

      setHubs(mockHubs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching hubs:", error);
      setIsLoading(false);
    }
  };

  const handleSelectHub = (hub: Hub) => {
    setSelectedHub(hub);
    onHubSelected(hub);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Distribution Hub</CardTitle>
          <CardDescription>Choose a hub to add your products</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (hubs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Distribution Hub</CardTitle>
          <CardDescription>No hubs available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No distribution hubs found in your area.</p>
            <p className="text-sm mt-2">
              Please contact support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Distribution Hub</CardTitle>
        <CardDescription>
          {selectedHub
            ? `Connected to ${selectedHub.branchName}`
            : "Choose a hub to manage your products"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                selectedHub?.id === hub.id
                  ? "border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-50"
                  : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
              }`}
              onClick={() => handleSelectHub(hub)}
            >
              {selectedHub?.id === hub.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-base">
                      {hub.branchName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{hub.location}</span>
                    </div>
                  </div>

                  {hub.services && hub.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hub.services.map((service, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2">
                    {hub.contactPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{hub.contactPhone}</span>
                      </div>
                    )}
                    {hub.capacity && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{hub.capacity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedHub && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              setSelectedHub(null);
              onHubSelected(null);
            }}
          >
            Clear Selection
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
