import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/types";

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

const OrderTable = ({ orders }: { orders: Order[] }) => (
  <Card>
    <CardContent className="p-0">
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
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
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
                {order.orderDate.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/orders/${order.id}`} passHref>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function OrdersPage() {
  const allOrders = mockOrders;
  const activeOrders = mockOrders.filter(
    (o) => o.status === "Pending" || o.status === "Accepted" || o.status === "In Transit"
  );
  const completedOrders = mockOrders.filter((o) => o.status === "Delivered");
  const cancelledOrders = mockOrders.filter((o) => o.status === "Cancelled");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and track all your orders.
        </p>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OrderTable orders={allOrders} />
        </TabsContent>
        <TabsContent value="active">
          <OrderTable orders={activeOrders} />
        </TabsContent>
        <TabsContent value="completed">
          <OrderTable orders={completedOrders} />
        </TabsContent>
        <TabsContent value="cancelled">
          <OrderTable orders={cancelledOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
