"use client";

import { notFound, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import type { OrderStatus, LogisticsUpdate, Order } from "@/lib/types";
import { CheckCircle, Circle, Dot, Truck, Package, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

const LogisticsTimeline = ({ updates }: { updates: LogisticsUpdate[] }) => {
  const getIcon = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="text-primary" />;
      case "In Transit":
        return <Truck className="text-blue-500" />;
      case "Accepted":
        return <Package className="text-accent-foreground" />;
      default:
        return <Circle className="text-muted-foreground" />;
    }
  };
  
  // Sort updates by timestamp descending to show the latest first
  const sortedUpdates = [...updates].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8">
      {sortedUpdates.map((update, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center size-8 rounded-full bg-muted">
              {getIcon(update.status)}
            </div>
            {index < sortedUpdates.length - 1 && (
              <div className="w-px h-full bg-border" />
            )}
          </div>
          <div>
            <p className="font-semibold">{update.status}</p>
            <p className="text-sm text-muted-foreground">{update.notes}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(update.timestamp).toLocaleString()} at {update.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if(user) {
      const unsub = onSnapshot(doc(db, "orders", params.id), (doc) => {
        if (doc.exists()) {
           const data = doc.data();
           const logistics = data.logistics.map((l:any) => ({...l, timestamp: l.timestamp.toDate()}));
           setOrder({ id: doc.id, ...data, orderDate: data.orderDate.toDate(), logistics } as Order);
        } else {
          notFound();
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user, params.id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", params.id));
        toast({ title: "Order Deleted", description: "The order has been successfully deleted." });
        router.push("/orders");
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete order." });
      }
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
     try {
        const newLogEntry: LogisticsUpdate = {
          timestamp: new Date(),
          status: newStatus,
          location: "System",
          notes: `Order status updated to ${newStatus}`
        }
        await updateDoc(doc(db, "orders", params.id), { 
          status: newStatus,
          logistics: [...(order?.logistics || []), newLogEntry]
        });
        toast({ title: "Order Updated", description: `Order status set to ${newStatus}.` });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update order status." });
      }
  }


  if (loading) {
    return <div>Loading order details...</div>
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
          <p className="text-muted-foreground">
            Tracking information for order <span className="font-mono">{order.id.substring(0,7)}</span>
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("In Transit")}>Mark as In Transit</Button>
            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("Delivered")}>Mark as Delivered</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete Order</Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Logistics Tracking</CardTitle>
              <CardDescription>
                Follow your order from the farm to your door.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogisticsTimeline updates={order.logistics} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Summary</CardTitle>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Image
                  src={order.crop.imageUrl}
                  alt={order.crop.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                  data-ai-hint={`${order.crop.type} ${order.crop.name}`}
                />
                <div>
                  <p className="font-semibold">{order.crop.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.quantity} kg
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    $
                    {(order.crop.price * order.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$10.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Ordered on {new Date(order.orderDate).toLocaleDateString()}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
