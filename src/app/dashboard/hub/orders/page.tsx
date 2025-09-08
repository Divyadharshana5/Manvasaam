"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Clock, CheckCircle, Package, Search, Filter, Eye, Phone, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Opening new order form...",
    });
  };

  const handleFilter = () => {
    setFilterOpen(!filterOpen);
    toast({
      title: "Filter",
      description: "Filter options opened",
    });
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "View Order",
      description: `Opening order ${orderId} details...`,
    });
  };

  const handleCallCustomer = (customer: string) => {
    toast({
      title: "Call Customer",
      description: `Calling ${customer}...`,
    });
  };

  const handleProcessOrder = (orderId: string) => {
    toast({
      title: "Process Order",
      description: `Processing order ${orderId}...`,
    });
  };

  const orders = {
    pending: [
      { id: "ORD001", customer: "Priya Sharma", items: "Organic Tomatoes - 5kg", amount: 400, time: "10:30 AM" },
      { id: "ORD002", customer: "Green Valley Restaurant", items: "Mixed Vegetables - 25kg", amount: 2500, time: "11:15 AM" }
    ],
    processing: [
      { id: "ORD003", customer: "Amit Singh", items: "Fresh Spinach - 2kg", amount: 90, time: "09:45 AM" },
      { id: "ORD004", customer: "Farm Fresh Cafe", items: "Dairy Products - 10L", amount: 600, time: "12:00 PM" }
    ],
    completed: [
      { id: "ORD005", customer: "Sunita Devi", items: "Organic Apples - 3kg", amount: 360, time: "08:30 AM" },
      { id: "ORD006", customer: "Local Market", items: "Seasonal Fruits - 15kg", amount: 1800, time: "07:45 AM" }
    ]
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and process all hub orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={handleNewOrder}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            className="pl-10 pr-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({orders.pending.length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({orders.processing.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({orders.completed.length})</TabsTrigger>
        </TabsList>

        {Object.entries(orders).map(([status, orderList]) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orderList.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <Badge variant={status === 'completed' ? 'default' : status === 'processing' ? 'secondary' : 'outline'}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{order.customer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{order.items}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-lg">₹{order.amount}</span>
                      <span className="text-sm text-muted-foreground">{order.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleViewOrder(order.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCallCustomer(order.customer)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      {status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleProcessOrder(order.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}