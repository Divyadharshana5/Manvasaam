
"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/order";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, PackageCheck, CalendarClock, Truck } from "lucide-react";


interface ShippingDetails {
    currentLocation: string;
    hasReachedState: boolean;
    estimatedDelivery: string;
    path: { location: string; time: string; }[];
}

const mockShippingDetails: { [key: string]: ShippingDetails } = {
    "ORD001": {
        currentLocation: "Delivered to Customer",
        hasReachedState: true,
        estimatedDelivery: "2024-07-20",
        path: [
             { location: "Customer's Location", time: "July 20, 10:30 AM"},
             { location: "Local Hub, Pune", time: "July 20, 8:00 AM"},
             { location: "State Warehouse, Maharashtra", time: "July 19, 11:00 PM"},
             { location: "Origin Hub, Bangalore", time: "July 19, 2:00 PM"},
        ]
    },
    "ORD002": {
        currentLocation: "Out for Delivery",
        hasReachedState: true,
        estimatedDelivery: "2024-07-21",
        path: [
             { location: "Out for Delivery", time: "July 21, 9:00 AM"},
             { location: "Local Hub, Mumbai", time: "July 21, 7:30 AM"},
             { location: "State Warehouse, Maharashtra", time: "July 20, 10:00 PM"},
             { location: "Origin Hub, Chennai", time: "July 20, 1:00 PM"},
        ]
    },
    "ORD003": {
        currentLocation: "In Transit to Local Hub",
        hasReachedState: true,
        estimatedDelivery: "2024-07-22",
        path: [
            { location: "In Transit to Local Hub", time: "July 21, 5:00 PM"},
            { location: "State Warehouse, Gujarat", time: "July 21, 1:00 PM"},
            { location: "Origin Hub, Ahmedabad", time: "July 20, 8:00 PM"},
        ]
    },
    "ORD005": {
        currentLocation: "State Warehouse, Tamil Nadu",
        hasReachedState: false,
        estimatedDelivery: "2024-07-24",
        path: [
            { location: "State Warehouse, Tamil Nadu", time: "July 22, 10:00 AM"},
            { location: "Origin Hub, Madurai", time: "July 22, 6:00 AM"},
        ]
    }
}


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const apiOrders = await response.json();
        const localOrdersJSON = localStorage.getItem("mockOrders");
        const localOrders = localOrdersJSON ? JSON.parse(localOrdersJSON) : [];
        const combinedOrders = [...localOrders, ...apiOrders];
        const uniqueOrders = Array.from(new Set(combinedOrders.map(o => o.id)))
            .map(id => combinedOrders.find(o => o.id === id)!);
        setOrders(uniqueOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);
  
  const handleRowClick = (order: Order) => {
    if (order.status !== 'Cancelled') {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
        case "Delivered":
            return "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30";
        case "Shipped":
            return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30";
        case "Processing":
            return "bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30";
        case "Cancelled":
            return "bg-red-500/20 text-red-700 border-red-500/30";
        default:
            return "";
    }
  }

  const shippingInfo = selectedOrder ? mockShippingDetails[selectedOrder.id] : null;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              Here's a list of all the recent orders.
            </p>
          </div>
        </div>
        <Card className="shadow-lg border-2 border-primary/10">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex-1">
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Review and manage all customer orders. Click on an order to view details.
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredOrders.map((order) => (
                        <TableRow key={order.id} onClick={() => handleRowClick(order)} className={order.status !== 'Cancelled' ? 'cursor-pointer' : ''}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                            <Badge
                                variant="outline"
                                className={getStatusBadgeClass(order.status)}
                            >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                            {order.total.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                            })}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
             </div>
            )}
          </CardContent>
        </Card>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Order Tracking: {selectedOrder?.id}</DialogTitle>
                    <DialogDescription>
                        Live shipping and delivery updates for your order.
                    </DialogDescription>
                </DialogHeader>
                {shippingInfo ? (
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-4">
                            <MapPin className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Current Location</p>
                                <p className="font-semibold">{shippingInfo.currentLocation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <PackageCheck className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Reached Your State</p>
                                <p className="font-semibold">{shippingInfo.hasReachedState ? 'Yes' : 'Not Yet'}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <CalendarClock className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                                <p className="font-semibold">{new Date(shippingInfo.estimatedDelivery).toDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                             <h4 className="font-semibold">Shipment History</h4>
                             <div className="relative pl-6">
                                <div className="absolute left-[11px] top-1 h-full w-0.5 bg-border"></div>
                                {shippingInfo.path.map((stop, index) => (
                                    <div key={index} className="relative flex items-start gap-4 mb-4">
                                        <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                           <Truck className="h-4 w-4"/>
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <p className="font-semibold">{stop.location}</p>
                                            <p className="text-xs text-muted-foreground">{stop.time}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                ) : (
                    <p className="py-4">No shipping details available for this order yet.</p>
                )}
            </DialogContent>
        </Dialog>
    </AppLayout>
  );
}
