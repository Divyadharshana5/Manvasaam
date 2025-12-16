"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/farmer-animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  TrendingUp,
  Leaf,
  Apple,
  Wheat,
  Sprout,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  Plus,
  Loader2,
  Bell,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  status: string;
  hubId: string;
  createdAt: string;
}

function AddProductButton({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  // try to pick a hubId from existing products (most recent with a hub)
  const defaultHubId = products?.find((p) => p.hubId)?.hubId || null;

  const href = `/dashboard/farmer/products?action=add${
    defaultHubId ? `&hubId=${encodeURIComponent(defaultHubId)}` : ""
  }`;

  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(href)}
      className={cn(buttonVariants(), className)}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Product
    </Button>
  );
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  const [stats, setStats] = useState({
    activeProducts: 0,
    totalOrders: 24,
    connectedBuyers: 12,
    monthlyRevenue: 18450,
    vegetables: 0,
    fruits: 0,
    grains: 0,
    herbs: 0,
  });

  useEffect(() => {
    if (user) {
      fetchFarmerProducts();
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PRODUCT_ADDED") {
        fetchFarmerProducts();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const fetchFarmerProducts = async () => {
    try {
      const response = await fetch("/api/farmer/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);

        const categoryCounts =
          data.products?.reduce((acc: any, product: Product) => {
            const category = product.category.toLowerCase();
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {}) || {};

        setStats((prev) => ({
          ...prev,
          activeProducts: data.products?.length || 0,
          vegetables: categoryCounts.vegetables || 0,
          fruits: categoryCounts.fruits || 0,
          grains: categoryCounts.grains || 0,
          herbs: categoryCounts.herbs || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
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
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Status and Search */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 badge-hover">
            <CheckCircle className="h-3 w-3 mr-1 checkmark-animate" />
            Farm Active
          </Badge>
          <Badge variant="secondary" className="badge-hover">
            <Clock className="h-3 w-3 mr-1" />
            Last update: 1 min ago
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-64 search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 elastic-bounce"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Link
            href="/dashboard/farmer/notifications"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "relative bell-ring"
            )}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium notification-badge">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchFarmerProducts}
            title="Refresh dashboard data"
            className="spin-on-hover"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your crops and connect with buyers
          </p>
        </div>
        <div className="flex gap-2">
          <AddProductButton products={products} />
        </div>
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
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              >
                <Package className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              {stats.activeProducts}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts > 0
                ? "In your inventory"
                : "No products yet"}
            </p>
          </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                {stats.totalOrders}
              </motion.div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
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
                Connected Buyers
              </CardTitle>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              >
                <Users className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
              >
                {stats.connectedBuyers}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Active relationships
              </p>
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
                Monthly Revenue
              </CardTitle>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              >
                ₹{stats.monthlyRevenue.toLocaleString()}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
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
          <Card className="border-green-200 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Leaf className="h-5 w-5 text-green-600" />
                </motion.div>
                <CardTitle className="text-lg">Vegetables</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
              >
                {stats.vegetables}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {stats.vegetables > 0 ? "Active crops" : "No vegetables yet"}
              </p>
              <div className="mt-2 space-y-1">
                {getProductsByCategory("vegetables")
                  .slice(0, 2)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {product.productName} - {product.quantity}
                      {product.unit}
                    </motion.div>
                  ))}
                {getProductsByCategory("vegetables").length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{getProductsByCategory("vegetables").length - 2} more
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full transition-all duration-300"
                  onClick={() =>
                    router.push("/dashboard/farmer/products?category=vegetables")
                  }
                >
                  Manage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="border-orange-200 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Apple className="h-5 w-5 text-orange-600" />
                </motion.div>
                <CardTitle className="text-lg">Fruits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-orange-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
              >
                {stats.fruits}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {stats.fruits > 0 ? "Seasonal harvest" : "No fruits yet"}
              </p>
              <div className="mt-2 space-y-1">
                {getProductsByCategory("fruits")
                  .slice(0, 2)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      {product.productName} - {product.quantity}
                      {product.unit}
                    </motion.div>
                  ))}
                {getProductsByCategory("fruits").length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{getProductsByCategory("fruits").length - 2} more
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full transition-all duration-300"
                  onClick={() =>
                    router.push("/dashboard/farmer/products?category=fruits")
                  }
                >
                  Manage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="border-amber-200 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Wheat className="h-5 w-5 text-amber-600" />
                </motion.div>
                <CardTitle className="text-lg">Grains</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-amber-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
              >
                {stats.grains}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {stats.grains > 0 ? "Ready to harvest" : "No grains yet"}
              </p>
              <div className="mt-2 space-y-1">
                {getProductsByCategory("grains")
                  .slice(0, 2)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="text-xs text-gray-600 bg-amber-50 px-2 py-1 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      {product.productName} - {product.quantity}
                      {product.unit}
                    </motion.div>
                  ))}
                {getProductsByCategory("grains").length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{getProductsByCategory("grains").length - 2} more
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full transition-all duration-300"
                  onClick={() =>
                    router.push("/dashboard/farmer/products?category=grains")
                  }
                >
                  Manage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="border-emerald-200 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 6 }}
                >
                  <Sprout className="h-5 w-5 text-emerald-600" />
                </motion.div>
                <CardTitle className="text-lg">Herbs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-emerald-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.9 }}
              >
                {stats.herbs}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {stats.herbs > 0 ? "Organic varieties" : "No herbs yet"}
              </p>
              <div className="mt-2 space-y-1">
                {getProductsByCategory("herbs")
                  .slice(0, 2)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                    >
                      {product.productName} - {product.quantity}
                      {product.unit}
                    </motion.div>
                  ))}
                {getProductsByCategory("herbs").length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{getProductsByCategory("herbs").length - 2} more
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full transition-all duration-300"
                  onClick={() =>
                    router.push("/dashboard/farmer/products?category=herbs")
                  }
                >
                  Manage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        variants={containerVariants}
      >
        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <motion.div 
                  className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Organic Tomatoes - 25kg</p>
                      <p className="text-sm text-muted-foreground">
                        Green Valley Restaurant
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Delivered</Badge>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Fresh Spinach - 15kg</p>
                      <p className="text-sm text-muted-foreground">City Hub</p>
                    </div>
                  </div>
                  <Badge variant="outline">Processing</Badge>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Organic Carrots - 20kg</p>
                      <p className="text-sm text-muted-foreground">
                        Fresh Market
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge>New Order</Badge>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/dashboard/orders"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full mt-4 transition-all duration-300"
                  )}
                >
                  View All Orders
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
        >
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used farmer operations</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="grid gap-3"
                variants={containerVariants}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AddProductButton products={products} className="justify-start transition-all duration-300" />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard/orders"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "justify-start transition-all duration-300"
                    )}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard/farmer/matchmaking"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "justify-start transition-all duration-300"
                    )}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Find Buyers
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard/farmer/analytics"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "justify-start transition-all duration-300"
                    )}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
