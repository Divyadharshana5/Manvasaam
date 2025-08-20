"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus
} from "lucide-react";
import { HubInventory } from "@/types/hub";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface InventoryManagerProps {
  hubId: string;
  initialInventory?: HubInventory[];
}

export default function InventoryManager({ hubId, initialInventory = [] }: InventoryManagerProps) {
  const [inventory, setInventory] = useState<HubInventory[]>(initialInventory);
  const [filteredInventory, setFilteredInventory] = useState<HubInventory[]>(initialInventory);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<HubInventory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, [hubId]);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter, categoryFilter, qualityFilter]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (qualityFilter !== "all") params.append("quality", qualityFilter);

      const response = await fetch(`/api/hubs/${hubId}/inventory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(searchLower) ||
        item.farmerName.toLowerCase().includes(searchLower) ||
        item.batchId.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (qualityFilter !== "all") {
      filtered = filtered.filter(item => item.quality === qualityFilter);
    }

    setFilteredInventory(filtered);
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<HubInventory>) => {
    try {
      const response = await fetch(`/api/hubs/${hubId}/inventory/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update item");
      }

      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });

      fetchInventory(); // Refresh the list
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/hubs/${hubId}/inventory/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete item");
      }

      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });

      fetchInventory(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "economy":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [...new Set(inventory.map(item => item.category))];
  const statuses = ["available", "reserved", "sold", "expired"];
  const qualities = ["premium", "standard", "economy"];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Inventory Search & Filters</span>
            <Button onClick={fetchInventory} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualities</SelectItem>
                {qualities.map(quality => (
                  <SelectItem key={quality} value={quality}>
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setQualityFilter("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Inventory Items ({filteredInventory.length})
          </CardTitle>
          <CardDescription>
            Manage your hub's product inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {inventory.length === 0 ? "No inventory items" : "No items match your filters"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {inventory.length === 0 
                  ? "Start by adding products to your hub inventory."
                  : "Try adjusting your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInventory.map((item) => {
                const isLowStock = item.quantity < 10;
                const isExpiringSoon = new Date(item.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.productName}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge className={getQualityColor(item.quality)}>
                            {item.quality}
                          </Badge>
                          {isLowStock && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge variant="destructive" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Quantity</p>
                            <p>{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="font-medium">Price</p>
                            <p>₹{item.pricePerUnit}/{item.unit}</p>
                          </div>
                          <div>
                            <p className="font-medium">Farmer</p>
                            <p>{item.farmerName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Expiry</p>
                            <p>{new Date(item.expiryDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p><strong>Category:</strong> {item.category}</p>
                          <p><strong>Batch ID:</strong> {item.batchId}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">
                          ₹{(item.quantity * item.pricePerUnit).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Value</p>
                        
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingItem(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the details of {editingItem?.productName}
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    defaultValue={editingItem.quantity}
                    onChange={(e) => {
                      setEditingItem({
                        ...editingItem,
                        quantity: parseFloat(e.target.value) || 0
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price per {editingItem.unit}</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem.pricePerUnit}
                    onChange={(e) => {
                      setEditingItem({
                        ...editingItem,
                        pricePerUnit: parseFloat(e.target.value) || 0
                      });
                    }}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingItem.status} 
                    onValueChange={(value) => setEditingItem({...editingItem, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quality">Quality</Label>
                  <Select 
                    value={editingItem.quality} 
                    onValueChange={(value) => setEditingItem({...editingItem, quality: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map(quality => (
                        <SelectItem key={quality} value={quality}>
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingItem && handleUpdateItem(editingItem.id, editingItem)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
