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
                    <h1 className="text-2xl font-bold tracking-tight">Retail Dashboard</h1>
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
                            <CardTitle className="flex items-center gap-2 text-lg">
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

                <TabsContent value="inventory" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Inventory Management</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {inventory.map((item, index) => (
                            <Card key={index} className={item.stock <= item.minStock ? "border-orange-200 bg-orange-50" : ""}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <item.icon className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.category} • {item.supplier}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold">₹{item.price}/kg</p>
                                                <p className="text-sm text-muted-foreground">Stock: {item.stock} kg</p>
                                            </div>
                                            <div className="w-24">
                                                <Progress
                                                    value={(item.stock / (item.minStock * 2)) * 100}
                                                    className="h-2"
                                                />
                                                {item.stock <= item.minStock && (
                                                    <p className="text-xs text-orange-600 mt-1">Low Stock!</p>
                                                )}
                                            </div>
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Reorder
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Order
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
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
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Truck className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Order Fulfillment Rate</span>
                                    <span className="font-semibold">94%</span>
                                </div>
                                <Progress value={94} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Customer Retention</span>
                                    <span className="font-semibold">87%</span>
                                </div>
                                <Progress value={87} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Supplier Reliability</span>
                                    <span className="font-semibold">91%</span>
                                </div>
                                <Progress value={91} className="h-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Monthly Goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Revenue Target</span>
                                    <span className="font-semibold">₹150K</span>
                                </div>
                                <Progress value={83} className="h-2" />
                                <p className="text-xs text-muted-foreground">₹125K achieved (83%)</p>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Orders Target</span>
                                    <span className="font-semibold">100</span>
                                </div>
                                <Progress value={89} className="h-2" />
                                <p className="text-xs text-muted-foreground">89 orders completed</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Bottom Section - Recent Activities and Suppliers */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5" />
                            Recent Activities
                        </CardTitle>
                        <CardDescription>Latest updates and notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <activity.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building className="h-5 w-5" />
                            Top Suppliers
                        </CardTitle>
                        <CardDescription>Your most reliable partners</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {suppliers.map((supplier, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${supplier.status === 'active' ? 'bg-green-100' : 'bg-orange-100'
                                            }`}>
                                            <Building className={`h-4 w-4 ${supplier.status === 'active' ? 'text-green-600' : 'text-orange-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{supplier.name}</p>
                                            <p className="text-xs text-muted-foreground">{supplier.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{supplier.rating}</span>
                                        </div>
                                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                            {supplier.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5" />
                            Sustainability Metrics
                        </CardTitle>
                        <CardDescription>Your environmental impact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Local Sourcing</span>
                                <span className="font-semibold">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Organic Products</span>
                                <span className="font-semibold">65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Waste Reduction</span>
                                <span className="font-semibold">82%</span>
                            </div>
                            <Progress value={82} className="h-2" />
                        </div>

                        <div className="pt-2 border-t">
                            <div className="flex items-center gap-2 text-green-600">
                                <Leaf className="h-4 w-4" />
                                <span className="text-sm font-medium">Eco-Friendly Store</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                You're contributing to sustainable agriculture!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Voice Assistant Integration */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Mic className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Voice Assistant</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ask me about orders, inventory, or get quick insights
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/voice-assistant">
                                <Mic className="h-4 w-4 mr-2" />
                                Start Voice Chat
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}