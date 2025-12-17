"use client";

import { motion, AnimatePresence } from "framer-motion";
import "@/styles/transport-animations.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Activity, Fuel, Clock, IndianRupee, Users } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "₹45,231",
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee
    },
    {
      title: "Deliveries Completed",
      value: "1,247",
      change: "+8.2%", 
      trend: "up",
      icon: Activity
    },
    {
      title: "Fuel Consumption",
      value: "2,847L",
      change: "-5.1%",
      trend: "down",
      icon: Fuel
    },
    {
      title: "Average Delivery Time",
      value: "42 min",
      change: "-3.2%",
      trend: "down",
      icon: Clock
    }
  ];

  const performanceData = [
    { month: "Jan", deliveries: 980, revenue: 38500, efficiency: 87 },
    { month: "Feb", deliveries: 1120, revenue: 42300, efficiency: 89 },
    { month: "Mar", deliveries: 1247, revenue: 45231, efficiency: 92 },
  ];

  const topDrivers = [
    { name: "John Smith", deliveries: 156, rating: 4.9, efficiency: 95 },
    { name: "Sarah Johnson", deliveries: 142, rating: 4.8, efficiency: 93 },
    { name: "Mike Wilson", deliveries: 138, rating: 4.7, efficiency: 91 },
    { name: "Lisa Brown", deliveries: 134, rating: 4.6, efficiency: 89 }
  ];

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
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/transport/analytics/export">
              Export Report
            </Link>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/dashboard/transport/analytics/generate">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {metrics.map((metric, index) => {
          const colors = [
            { border: "border-l-green-500", icon: "text-green-500" },
            { border: "border-l-blue-500", icon: "text-blue-500" },
            { border: "border-l-orange-500", icon: "text-orange-500" },
            { border: "border-l-purple-500", icon: "text-purple-500" }
          ];
          const color = colors[index];
          
          return (
            <Card key={metric.title} className={`border-l-4 ${color.border} animate-scale-in stat-card`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center text-xs mt-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-green-600" />
                      )}
                      <span className="text-green-600">{metric.change}</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </div>
                  <metric.icon className={`h-8 w-8 ${color.icon} icon-bounce`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-slide-in-left stagger-1">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((data) => (
                <div key={data.month} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex flex-col">
                    <span className="font-medium">{data.month} 2024</span>
                    <span className="text-sm text-muted-foreground">
                      {data.deliveries} deliveries
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">₹{data.revenue.toLocaleString()}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {data.efficiency}% efficiency
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right stagger-2">
          <CardHeader>
            <CardTitle>Top Performing Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div key={driver.name} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{driver.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {driver.deliveries} deliveries
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">⭐ {driver.rating}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {driver.efficiency}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in-up stagger-1">
          <CardHeader>
            <CardTitle>Delivery Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded">
                    <div className="w-4/5 h-2 bg-green-500 rounded"></div>
                  </div>
                  <span className="text-sm font-medium">80%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">In Transit</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded">
                    <div className="w-1/5 h-2 bg-blue-500 rounded"></div>
                  </div>
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Delayed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded">
                    <div className="w-1/20 h-2 bg-red-500 rounded"></div>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-2">
          <CardHeader>
            <CardTitle>Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Active Vehicles</span>
                <span className="text-sm font-medium">12/15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Utilization</span>
                <span className="text-sm font-medium text-green-600">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maintenance Required</span>
                <span className="text-sm font-medium text-yellow-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fuel Efficiency</span>
                <span className="text-sm font-medium text-green-600">8.2L/100km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-3">
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Overall Rating</span>
                <span className="text-sm font-medium">4.7/5 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">On-time Delivery</span>
                <span className="text-sm font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Positive Feedback</span>
                <span className="text-sm font-medium text-green-600">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Repeat Customers</span>
                <span className="text-sm font-medium text-green-600">76%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}