"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    Info,
    Package,
    ShoppingCart,
    Clock,
    MapPin,
    User,
    Settings,
    Search,
    Filter,
    Check,
    Trash2,
    ArrowLeft,
    Activity,
    Truck,
    TrendingUp,
    DollarSign,
    Calendar,
    Building,
    Phone
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RetailNotifications() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const notifications = [
        {
            id: "1",
            type: "urgent",
            title: "Low Stock Alert",
            message: "Organic Milk inventory is critically low. Only 8 liters remaining. Reorder immediately.",
            time: "5 minutes ago",
            read: false,
            icon: AlertTriangle,
            category: "inventory"
        },
        {
            id: "2",
            type: "success",
            title: "Order Delivered",
            message: "Order #ORD-001 from Green Valley Farm has been successfully delivered. 50kg fresh vegetables received.",
            time: "15 minutes ago",
            read: false,
            icon: CheckCircle,
            category: "delivery"
        },
        {
            id: "3",
            type: "info",
            title: "New Order Placed",
            message: "Order #ORD-004 placed with Sunrise Dairy for 100L organic milk. Expected delivery: Tomorrow.",
            time: "30 minutes ago",
            read: false,
            icon: ShoppingCart,
            category: "order"
        },
        {
            id: "4",
            type: "success",
            title: "Payment Confirmed",
            message: "Payment of ₹8,500 received from customer for today's sales.",
            time: "1 hour ago",
            read: true,
            icon: DollarSign,
            category: "payment"
        },
        {
            id: "5",
            type: "info",
            title: "Supplier Update",
            message: "Mountain Fruits has new seasonal fruits available. Check their latest catalog for fresh arrivals.",
            time: "2 hours ago",
            read: true,
            icon: Building,
            category: "supplier"
        },
        {
            id: "6",
            type: "warning",
            title: "Delivery Delay",
            message: "Order #ORD-002 from Sunrise Dairy is delayed by 2 hours due to traffic conditions.",
            time: "3 hours ago",
            read: true,
            icon: Truck,
            category: "delivery"
        },
        {
            id: "7",
            type: "info",
            title: "Customer Feedback",
            message: "Received 5-star rating from Green Valley Restaurant for fresh vegetable quality.",
            time: "4 hours ago",
            read: true,
            icon: TrendingUp,
            category: "feedback"
        },
        {
            id: "8",
            type: "warning",
            title: "Price Update",
            message: "Golden Grains has updated wheat flour prices. New rate: ₹48/kg (increased by ₹3).",
            time: "5 hours ago",
            read: true,
            icon: Info,
            category: "pricing"
        }
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case "urgent": return "text-red-600 bg-red-50 border-red-200";
            case "warning": return "text-orange-600 bg-orange-50 border-orange-200";
            case "success": return "text-green-600 bg-green-50 border-green-200";
            case "info": return "text-blue-600 bg-blue-50 border-blue-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || 
            (activeTab === "unread" && !notification.read) ||
            (activeTab === "read" && notification.read);
        return matchesSearch && matchesTab;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/retail">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">
                            Stay updated with your retail operations
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {unreadCount} unread
                    </Badge>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                    <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery ? "Try adjusting your search terms" : "You're all caught up!"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {filteredNotifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`transition-all hover:shadow-md ${
                                        !notification.read ? "border-l-4 border-l-primary" : ""
                                    }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                                                <notification.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm mb-1">
                                                            {notification.title}
                                                            {!notification.read && (
                                                                <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                                                            )}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {notification.time}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {notification.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {!notification.read && (
                                                            <Button variant="ghost" size="sm">
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Notification Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                                <p className="text-2xl font-bold">{notifications.length}</p>
                            </div>
                            <Bell className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                            </div>
                            <Activity className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {notifications.filter(n => n.type === "urgent").length}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {notifications.filter(n => n.time.includes("hour") || n.time.includes("minute")).length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}