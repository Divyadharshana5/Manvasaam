"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    Building,
    Apple,
    Milk,
    Wheat,
    Clock,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Truck,
    Search,
    Plus,
    Minus,
    Mic,
    MessageCircle,
    Phone,
    QrCode,
    CreditCard,
    MapPin,
    Bell,
    Eye,
    Settings,
    User,
    Star,
    Calendar,
    BarChart3,
    Filter,
    Download,
    RefreshCw,
    Zap,
    Target,
    Leaf,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RetailDashboard() {
    const [shopName] = useState("Fresh Market Store");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    // Enhanced Mock data
    const stats = {
        totalOrders: 89,
        pendingDeliveries: 12,
        totalSpent: 245000,
        activeProducts: 234,
        monthlyRevenue: 125000,
        customerSatisfaction: 4.8,
        inventoryValue: 89000,
        lowStockItems: 8
    };

    const todayStats = {
        ordersToday: 12,
        revenueToday: 8500,
        newCustomers: 3,
        deliveriesCompleted: 15
    };

    const orders = [
        {
            id: "ORD-001",
            supplier: "Green Valley Farm",
            items: "Fresh Vegetables",
            quantity: "50 kg",
            status: "delivered",
            amount: 2500,
            date: "2024-01-15"
        },
        {
            id: "ORD-002",
            supplier: "Sunrise Dairy",
            items: "Organic Milk",
            quantity: "100 L",
            status: "pending",
            amount: 4500,
            date: "2024-01-14"
        },
        {
            id: "ORD-003",
            supplier: "Mountain Fruits",
            items: "Seasonal Fruits",
            quantity: "75 kg",
            status: "processing",
            amount: 6750,
            date: "2024-01-13"
        }
    ];

    const suppliers = [
        { name: "Green Valley Farm", category: "Vegetables", rating: 4.8, orders: 23, lastDelivery: "2024-01-15", status: "active" },
        { name: "Sunrise Dairy", category: "Dairy", rating: 4.9, orders: 18, lastDelivery: "2024-01-14", status: "active" },
        { name: "Mountain Fruits", category: "Fruits", rating: 4.7, orders: 15, lastDelivery: "2024-01-13", status: "active" },
        { name: "Golden Grains", category: "Cereals", rating: 4.6, orders: 12, lastDelivery: "2024-01-12", status: "pending" }
    ];

    const inventory = [
        { name: "Fresh Tomatoes", category: "Vegetables", stock: 45, minStock: 20, price: 80, supplier: "Green Valley Farm", icon: Apple },
        { name: "Organic Milk", category: "Dairy", stock: 8, minStock: 15, price: 65, supplier: "Sunrise Dairy", icon: Milk },
        { name: "Wheat Flour", category: "Grains", stock: 25, minStock: 10, price: 45, supplier: "Golden Grains", icon: Wheat },
        { name: "Fresh Apples", category: "Fruits", stock: 12, minStock: 20, price: 120, supplier: "Mountain Fruits", icon: Apple }
    ];

    const recentActivities = [
        { type: "order", message: "New order from Green Valley Farm", time: "2 hours ago", icon: ShoppingCart },
        { type: "delivery", message: "Delivery completed for ORD-001", time: "4 hours ago", icon: Truck },
        { type: "stock", message: "Low stock alert: Organic Milk", time: "6 hours ago", icon: AlertCircle },
        { type: "payment", message: "Payment received ₹8,500", time: "8 hours ago", icon: DollarSign }
    ];

    const quickActions = [
        { name: "Place Order", icon: Plus, href: "/dashboard/retail/orders/new", color: "bg-green-500" },
        { name: "Check Inventory", icon: Package, href: "/dashboard/retail/inventory", color: "bg-blue-500" },
        { name: "Contact Supplier", icon: Phone, href: "/dashboard/retail/suppliers", color: "bg-purple-500" },
        { name: "View Analytics", icon: BarChart3, href: "/dashboard/retail/analytics", color: "bg-orange-500" }
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Retail Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {shopName}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Online
                        </Badge>
                        <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Last sync: 2 min ago
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders, products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-64"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Today's Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                                <p className="text-2xl font-bold text-green-600">{todayStats.ordersToday}</p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                                <p className="text-2xl font-bold text-blue-600">₹{todayStats.revenueToday.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                                <p className="text-2xl font-bold text-purple-600">{todayStats.newCustomers}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Deliveries</p>
                                <p className="text-2xl font-bold text-orange-600">{todayStats.deliveriesCompleted}</p>
                            </div>
                            <Truck className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Monthly Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                                <p className="text-xs text-muted-foreground">
                                    <TrendingUp className="inline h-3 w-3 mr-1" />
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <TrendingUp className="inline h-3 w-3 mr-1" />
                                    +8% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
                                <p className="text-xs text-muted-foreground">
                                    <Star className="inline h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    Excellent rating
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{stats.inventoryValue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <AlertCircle className="inline h-3 w-3 mr-1 text-orange-500" />
                                    {stats.lowStockItems} low stock items
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription>Frequently used actions for your retail operations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {quickActions.map((action, index) => (
                                    <Button key={index} variant="outline" className="h-20 flex-col" asChild>
                                        <Link href={action.href}>
                                            <div className={`p-2 rounded-full ${action.color} text-white mb-2`}>
                                                <action.icon className="h-6 w-6" />
                                            </div>
                                            <span>{action.name}</span>
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex-col" asChild>
                    <Link href="/dashboard/retail/orders">
                        <ShoppingCart className="h-6 w-6 mb-2" />
                        <span>View Orders</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/dashboard/retail/products">
                        <Package className="h-6 w-6 mb-2" />
                        <span>Manage Products</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/dashboard/retail/suppliers">
                        <Users className="h-6 w-6 mb-2" />
                        <span>Suppliers</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/dashboard/voice-assistant">
                        <Mic className="h-6 w-6 mb-2" />
                        <span>Voice Assistant</span>
                    </Link>
                </Button>
            </div>

            {/* Recent Orders and Suppliers */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your latest purchase orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{order.id}</span>
                                            <Badge variant={
                                                order.status === 'delivered' ? 'default' :
                                                    order.status === 'pending' ? 'secondary' : 'outline'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{order.supplier}</p>
                                        <p className="text-sm">{order.items} - {order.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{order.amount}</p>
                                        <p className="text-xs text-muted-foreground">{order.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Suppliers</CardTitle>
                        <CardDescription>Your most reliable suppliers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {suppliers.map((supplier, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Building className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{supplier.name}</p>
                                            <p className="text-sm text-muted-foreground">{supplier.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">⭐ {supplier.rating}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{supplier.orders} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}