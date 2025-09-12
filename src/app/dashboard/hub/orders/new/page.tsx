"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewOrderPage() {
  const [orderCreated, setOrderCreated] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");

  const handleCreateOrder = () => {
    // Simulate order creation
    const orderId = "ORD" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setNewOrderId(orderId);
    setOrderCreated(true);
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
          <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
          <p className="text-muted-foreground">Create a new order for the hub</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" placeholder="Enter customer name" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </div>
          <div>
            <Label htmlFor="items">Items</Label>
            <Input id="items" placeholder="Enter order items" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" placeholder="Enter quantity" />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Enter amount" />
            </div>
          </div>
          {!orderCreated ? (
            <div className="flex gap-2">
              <Button onClick={handleCreateOrder}>
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/hub/orders">Cancel</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium">Order {newOrderId} created successfully!</p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/dashboard/track?orderId=${newOrderId}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Track Order
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/hub/deliveries">View All Deliveries</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}