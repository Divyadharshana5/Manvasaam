"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Hub } from "@/types/hub";

export default function TestHubDropdown() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHubs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hubs");
      if (response.ok) {
        const data = await response.json();
        setHubs(data.hubs || []);
        console.log("Fetched hubs:", data.hubs);
      } else {
        throw new Error("Failed to fetch hubs");
      }
    } catch (error) {
      console.error("Error fetching hubs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hubs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleHubs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/seed-hubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Created ${data.hubs.length} sample hubs`,
        });
        fetchHubs(); // Refresh the list
      } else {
        throw new Error("Failed to create sample hubs");
      }
    } catch (error) {
      console.error("Error creating sample hubs:", error);
      toast({
        title: "Error",
        description: "Failed to create sample hubs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Hub Dropdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Hub:</label>
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a hub" />
            </SelectTrigger>
            <SelectContent>
              {hubs.map((hub) => (
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

        <div className="space-y-2">
          <Button onClick={fetchHubs} disabled={isLoading} className="w-full">
            {isLoading ? "Loading..." : "Refresh Hubs"}
          </Button>
          <Button onClick={createSampleHubs} disabled={isLoading} variant="outline" className="w-full">
            Create Sample Hubs
          </Button>
        </div>

        {selectedHub && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium">Selected Hub:</p>
            <p className="text-sm text-gray-600">
              {hubs.find(h => h.id === selectedHub)?.branchName} - {hubs.find(h => h.id === selectedHub)?.location}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Total hubs: {hubs.length}</p>
          <p>Hub names: {hubs.map(h => h.branchName).join(", ")}</p>
        </div>
      </CardContent>
    </Card>
  );
}