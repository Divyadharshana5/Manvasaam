"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("userType");
    const email = localStorage.getItem("userEmail");

    if (!userType || userType !== "customer") {
      router.push("/login/customer");
      return;
    }

    setUserEmail(email || "");
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock customer data
  const customerStats = {
    pendingOrders: 2,
    completedOrders: 18,
    totalSpent: "₹12,850.75",
    newProducts: [
      { name: "Organic Strawberries", price: "₹299" },
      { name: "Fresh Basil", price: "₹89" },
      { name: "Artisanal Cheese", price: "₹450" },
    ],
    recentOrders: [
      {
        id: "ORD001",
        date: "2024-07-20",
        status: "Delivered",
        total: "₹150.75",
      },
      {
        id: "ORD005",
        date: "2024-07-21",
        status: "Processing",
        total: "₹99.99",
      },
      { id: "ORD002", date: "2024-07-19", status: "Shipped", total: "₹85.50" },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            Welcome back, Customer!
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400">
            {userEmail ? `Logged in as: ${userEmail}` : "Customer Dashboard"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {customerStats.pendingOrders}
              </div>
              <p className="text-xs text-emerald-600">Awaiting delivery</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Orders
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {customerStats.completedOrders}
              </div>
              <p className="text-xs text-green-600">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {customerStats.totalSpent}
              </div>
              <p className="text-xs text-emerald-600">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Products
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {customerStats.newProducts.length}
              </div>
              <p className="text-xs text-emerald-600">Available now</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link href="/dashboard/products">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>

          <Link href="/dashboard/orders">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Package className="mr-2 h-4 w-4" />
              View Orders
            </Button>
          </Link>

          <Link href="/dashboard/track">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Truck className="mr-2 h-4 w-4" />
              Track Orders
            </Button>
          </Link>

          <Link href="/dashboard/profile">
            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
              <Users className="mr-2 h-4 w-4" />
              My Profile
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader>
              <CardTitle className="text-emerald-800 dark:text-emerald-200">
                Recent Orders
              </CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerStats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-emerald-800 dark:text-emerald-200">
                        {order.id}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-1">
                        {order.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
            <CardHeader>
              <CardTitle className="text-emerald-800 dark:text-emerald-200">
                New Products
              </CardTitle>
              <CardDescription>Fresh items just for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerStats.newProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-emerald-800 dark:text-emerald-200">
                        {product.name}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Fresh from farm
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {product.price}
                      </p>
                      <Button
                        size="sm"
                        className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
