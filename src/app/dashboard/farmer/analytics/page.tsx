"use client";

import { useState } from "react";
import "@/styles/farmer-animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FarmerAnalytics() {
  const [selectedRange, setSelectedRange] = useState("30");

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

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 page-transition"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Analytics Dashboard
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Track your farm performance and sales insights
          </motion.p>
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* simple range selector - activate Last 30 Days */}
          {/* Last 30 Days button removed per request */}
          {/* Export goes to an export page which will provide downloads */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild variant="outline">
              <a
                href={`/dashboard/farmer/analytics/export?range=${selectedRange}`}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                </motion.div>
                Export Report
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                variants={numberVariants}
              >
                ₹45,231
              </motion.div>
              <motion.div 
                className="flex items-center text-xs text-green-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                </motion.div>
                +12% from last month
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Package className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                variants={numberVariants}
              >
                1,234
              </motion.div>
              <motion.div 
                className="flex items-center text-xs text-green-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                </motion.div>
                +8% from last month
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Users className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                variants={numberVariants}
              >
                24
              </motion.div>
              <motion.div 
                className="flex items-center text-xs text-red-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                </motion.div>
                -2% from last month
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Order Value
              </CardTitle>
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                variants={numberVariants}
              >
                ₹1,850
              </motion.div>
              <motion.div 
                className="flex items-center text-xs text-green-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                </motion.div>
                +5% from last month
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Sales chart will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Top selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Organic Tomatoes</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹12,450</div>
                  <Badge variant="secondary">35% of sales</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Fresh Spinach</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹8,920</div>
                  <Badge variant="secondary">25% of sales</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Organic Carrots</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹6,780</div>
                  <Badge variant="secondary">18% of sales</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
