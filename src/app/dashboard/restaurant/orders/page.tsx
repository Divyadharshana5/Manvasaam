"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
} from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    farmer: "Green Valley Farm",
    items: "Organic Tomatoes, Spinach",
    quantity: "75kg",
    amount: "₹4,500",
    status: "delivered",
    date: "2024-01-15",
    deliveryDate: "2024-01-16",
  },
  {
    id: "ORD-002",
    farmer: "Sunrise Organics",
    items: "Fresh Carrots, Beetroot",
    quantity: "50kg",
    amount: "₹3,200",
    status: "in-transit",
    date: "2024-01-14",
    deliveryDate: "2024-01-17",
  },
  {
    id: "ORD-003",
    farmer: "Happy Cow Dairy",
    items: "Organic Milk, Paneer",
    quantity: "100L, 5kg",
    amount: "₹6,800",
    status: "delayed",
    date: "2024-01-13",
    deliveryDate: "2024-01-18",
  },
  {
    id: "ORD-004",
    farmer: "Millet Masters",
    items: "Finger Millet, Pearl Millet",
    quantity: "25kg",
    amount: "₹2,100",
    status: "pending",
    date: "2024-01-12",
    deliveryDate: "2024-01-19",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "in-transit":
      return <Package className="h-4 w-4 text-blue-600" />;
    case "delayed":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
    case "in-transit":
      return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>;
    case "delayed":
      return <Badge variant="destructive">Delayed</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage orders from your contract farmers
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Place a new order with one of your contract farmers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Order creation form would go here...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === "in-transit").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Track all your orders from contract farmers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="delayed">Delayed</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.farmer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}