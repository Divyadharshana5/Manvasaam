import { notFound } from "next/navigation";
import { mockOrders } from "@/lib/data";
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
import type { OrderStatus, LogisticsUpdate } from "@/lib/types";
import { CheckCircle, Circle, Dot, Truck, Package } from "lucide-react";

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

  return (
    <div className="space-y-8">
      {updates.map((update, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center size-8 rounded-full bg-muted">
              {getIcon(update.status)}
            </div>
            {index < updates.length - 1 && (
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
  const order = mockOrders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
        <p className="text-muted-foreground">
          Tracking information for order <span className="font-mono">{order.id}</span>
        </p>
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
