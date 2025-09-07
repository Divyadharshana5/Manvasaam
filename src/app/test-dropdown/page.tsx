"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestDropdown() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [selectedHub, setSelectedHub] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHubs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hubs');
      const data = await response.json();
      console.log('Hubs response:', data);
      setHubs(data.hubs || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Hub Dropdown Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Hub:</label>
            <Select value={selectedHub} onValueChange={setSelectedHub}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a hub" />
              </SelectTrigger>
              <SelectContent>
                {hubs.map((hub) => (
                  <SelectItem key={hub.id} value={hub.id}>
                    <div>
                      <div className="font-medium">{hub.branchName}</div>
                      <div className="text-xs text-gray-500">{hub.location}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={fetchHubs} disabled={loading} className="w-full">
            {loading ? "Loading..." : "Refresh Hubs"}
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>Found {hubs.length} hubs</p>
            {selectedHub && (
              <p>Selected: {hubs.find(h => h.id === selectedHub)?.branchName}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}