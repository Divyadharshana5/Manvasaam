"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const orderDetails = {
    id: orderId,
    customer: "Priya Sharma",
    phone: "+91 9876543210",
    items: "Organic Tomatoes - 5kg",
    amount: 400,
    status: "pending",
    time: "10:30 AM",
    address: "123 Green Valley, Mumbai"
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/hub/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {orderId}</h1>
          <p className="text-muted-foreground">Order details and management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>{orderDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Customer:</span>
              <span>{orderDetails.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{orderDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Items:</span>
              <span>{orderDetails.items}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="font-bold">₹{orderDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge>{orderDetails.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Time:</span>
              <span>{orderDetails.time}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Call Customer
            </Button>
            <Button variant="outline" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Processing
            </Button>
            <Button variant="outline" className="w-full">
              <Truck className="mr-2 h-4 w-4" />
              Assign Delivery
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}