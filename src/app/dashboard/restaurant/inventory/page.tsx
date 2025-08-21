"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

const inventory = [
  {
    id: "1",
    name: "Organic Tomatoes",
    category: "Vegetables",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unit: "kg",
    costPerUnit: 90,
    supplier: "Green Valley Farm",
    lastRestocked: "2024-01-15",
    expiryDate: "2024-01-20",
    status: "good",
  }, 
 {
    id: "2",
    name: "Fresh Spinach",
    category: "Vegetables",
    currentStock: 15,
    minStock: 25,
    maxStock: 80,
    unit: "kg",
    costPerUnit: 60,
    supplier: "Sunrise Organics",
    lastRestocked: "2024-01-14",
    expiryDate: "2024-01-18",
    status: "low",
  },
  {
    id: "3",
    name: "Organic Apples",
    category: "Fruits",
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    unit: "kg",
    costPerUnit: 180,
    supplier: "Hill Station Farms",
    lastRestocked: "2024-01-16",
    expiryDate: "2024-01-25",
    status: "good",
  },
  {
    id: "4",
    name: "Farm Fresh Milk",
    category: "Dairy",
    currentStock: 80,
    minStock: 100,
    maxStock: 500,
    unit: "L",
    costPerUnit: 65,
    supplier: "Happy Cow Dairy",
    lastRestocked: "2024-01-13",
    expiryDate: "2024-01-17",
    status: "critical",
  },
];

const getStatusBadge = (item: typeof inventory[0]) => {
  if (item.currentStock <= item.minStock * 0.5) {
    return <Badge variant="destructive">Critical</Badge>;
  } else if (item.currentStock <= item.minStock) {
    return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
  } else {
    return <Badge className="bg-green-100 text-green-800">Good</Badge>;
  }
};

const getStockPercentage = (item: typeof inventory[0]) => {
  return (item.currentStock / item.maxStock) * 100;
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = inventory.reduce((sum, item) => 
    sum + (item.currentStock * item.costPerUnit), 0
  );

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const criticalItems = inventory.filter(item => item.currentStock <= item.minStock * 0.5).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track stock levels for organic products
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>  
    {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">
              Urgent attention needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Dairy">Dairy</SelectItem>
            <SelectItem value="Millets">Millets</SelectItem>
          </SelectContent>
        </Select>
      </div>  
    {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>
            Monitor and manage your organic product inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.currentStock} {item.unit}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="space-y-1">
                      <Progress value={getStockPercentage(item)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}