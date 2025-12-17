"use client";

import { motion, AnimatePresence } from "framer-motion";
import "@/styles/transport-animations.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function DeliveriesPage() {
  const deliveries = [
    {
      id: "DEL-001",
      destination: "Downtown Market",
      status: "In Transit",
      driver: "John Smith",
      estimatedTime: "2:30 PM",
      items: 15,
      priority: "High",
    },
    {
      id: "DEL-002",
      destination: "Westside Store",
      status: "Delivered",
      driver: "Sarah Johnson",
      estimatedTime: "Completed",
      items: 8,
      priority: "Medium",
    },
    {
      id: "DEL-003",
      destination: "North Plaza",
      status: "Pending",
      driver: "Mike Wilson",
      estimatedTime: "4:15 PM",
      items: 22,
      priority: "Low",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold">Deliveries</h1>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/transport/deliveries/new">
            <Package className="mr-2 h-4 w-4" />
            New Delivery
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <Card className="border-l-4 border-l-blue-500 animate-scale-in stat-card stagger-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </div>
              <Package className="h-8 w-8 text-blue-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 animate-scale-in stat-card stagger-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Active deliveries</p>
              </div>
              <Truck className="h-8 w-8 text-green-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 animate-scale-in stat-card stagger-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-muted-foreground">Today's deliveries</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 animate-scale-in stat-card stagger-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="animate-fade-in-up stagger-5">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-4 border rounded-lg list-item"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{delivery.id}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {delivery.destination}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Driver: {delivery.driver}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {delivery.estimatedTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(delivery.priority)}>
                    {delivery.priority}
                  </Badge>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {delivery.items} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
