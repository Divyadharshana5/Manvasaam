
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        // First, fetch the static mock orders from the API
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const apiOrders = await response.json();
        
        // Next, check localStorage for any newly placed orders
        const localOrdersJSON = localStorage.getItem("mockOrders");
        const localOrders = localOrdersJSON ? JSON.parse(localOrdersJSON) : [];

        // Combine the local orders with the API orders, ensuring no duplicates.
        // We'll use the API orders as the base and prepend local orders.
        const combinedOrders = [...localOrders, ...apiOrders];
        const uniqueOrders = Array.from(new Set(combinedOrders.map(o => o.id)))
            .map(id => combinedOrders.find(o => o.id === id)!);
        
        setOrders(uniqueOrders);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
        case "Delivered":
            return "default";
        case "Shipped":
            return "secondary";
        case "Processing":
            return "secondary";
        case "Cancelled":
            return "destructive";
        default:
            return "outline";
    }
  }

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
        case "Delivered":
            return "bg-green-500/20 text-green-700 border-green-500/30";
        case "Shipped":
            return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
        case "Processing":
            return "bg-blue-500/20 text-blue-700 border-blue-500/30";
        case "Cancelled":
            return "bg-red-500/20 text-red-700 border-red-500/30";
        default:
            return "";
    }
  }


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
                Review and manage all customer orders.
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
                        <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                            <Badge
                            variant={getStatusBadgeVariant(order.status)}
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
    </AppLayout>
  );
}
