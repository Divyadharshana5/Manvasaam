"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Order, OrderStatus } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateOrderForm from "./create-order-form";

const getStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "default";
    case "In Transit":
      return "secondary";
    case "Pending":
      return "outline";
    case "Accepted":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderTable = ({ orders, loading }: { orders: Order[], loading: boolean }) => {

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium font-mono">{order.id?.substring(0, 7)}</TableCell>
                <TableCell>{order.crop.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/orders/${order.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
};


export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "orders"), where("buyerId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            ...data,
            orderDate: data.orderDate.toDate(),
          } as Order);
        });
        setOrders(ordersData);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const activeOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Accepted" || o.status === "In Transit"
  );
  const completedOrders = orders.filter((o) => o.status === "Delivered");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all your orders.
          </p>
        </div>
         <Dialog>
          <DialogTrigger asChild>
            <Button>Create Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Order</DialogTitle>
            </DialogHeader>
            <CreateOrderForm />
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OrderTable orders={orders} loading={loading} />
        </TabsContent>
        <TabsContent value="active">
          <OrderTable orders={activeOrders} loading={loading} />
        </TabsContent>
        <TabsContent value="completed">
          <OrderTable orders={completedOrders} loading={loading} />
        </TabsContent>
        <TabsContent value="cancelled">
          <OrderTable orders={cancelledOrders} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
