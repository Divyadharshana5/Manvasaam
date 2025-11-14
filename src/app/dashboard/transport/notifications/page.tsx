"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Truck,
  Package,
  Fuel,
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
  Route,
  Wrench,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function TransportNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [filterUnread, setFilterUnread] = useState(false);
  const filterBtnRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const initialNotifications = [
    {
      id: "1",
      type: "urgent",
      title: "Vehicle TRK-003 Breakdown",
      message:
        "TRK-003 has broken down on Highway 45. Driver Raj Kumar needs immediate assistance.",
      time: "5 minutes ago",
      read: false,
      icon: AlertTriangle,
      category: "vehicle",
    },
    {
      id: "2",
      type: "success",
      title: "Delivery Completed",
      message:
        "DEL-001 has been successfully delivered to Fresh Market Store. Customer rating: 5 stars.",
      time: "15 minutes ago",
      read: false,
      icon: CheckCircle,
      category: "delivery",
    },
    {
      id: "3",
      type: "warning",
      title: "Low Fuel Alert",
      message:
        "TRK-004 fuel level is below 20%. Please schedule refueling at the nearest station.",
      time: "30 minutes ago",
      read: false,
      icon: Fuel,
      category: "vehicle",
    },
    {
      id: "4",
      type: "info",
      title: "Route Optimization Complete",
      message:
        "New optimized route for City Route A will save 15% travel time and reduce fuel consumption.",
      time: "1 hour ago",
      read: true,
      icon: Route,
      category: "route",
    },
    {
      id: "5",
      type: "info",
      title: "Maintenance Scheduled",
      message:
        "TRK-002 is scheduled for routine maintenance tomorrow at 9:00 AM.",
      time: "2 hours ago",
      read: true,
      icon: Wrench,
      category: "maintenance",
    },
    {
      id: "6",
      type: "success",
      title: "Payment Received",
      message:
        "Payment of ₹12,500 received from Green Valley Farm for delivery DEL-002.",
      time: "3 hours ago",
      read: true,
      icon: DollarSign,
      category: "payment",
    },
    {
      id: "7",
      type: "info",
      title: "New Driver Assigned",
      message:
        "Vikram Yadav has been assigned to TRK-005 for the morning shift.",
      time: "4 hours ago",
      read: true,
      icon: User,
      category: "driver",
    },
    {
      id: "8",
      type: "warning",
      title: "Delivery Delay",
      message:
        "DEL-003 is running 30 minutes behind schedule due to traffic congestion.",
      time: "5 hours ago",
      read: true,
      icon: Clock,
      category: "delivery",
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const categories = Array.from(
    new Set(initialNotifications.map((n) => n.category))
  );

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "success":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "urgent" && notification.type === "urgent") ||
      notification.category === activeTab;
    const matchesCategory =
      filterCategory === "all" || notification.category === filterCategory;
    const matchesUnreadFilter = !filterUnread || !notification.read;
    return (
      matchesSearch && matchesTab && matchesCategory && matchesUnreadFilter
    );
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (!showFilter) return;
    const updatePos = () => {
      const el = filterBtnRef.current;
      if (!el) return setDropdownPos(null);
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.bottom + 8 + window.scrollY);
      const right = Math.round(window.innerWidth - rect.right + 8);
      setDropdownPos({ top, right });
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos);
    };
  }, [showFilter]);

  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/transport">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your transport operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{unreadCount} unread</Badge>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/transport/settings">
                <span className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative" ref={filterBtnRef}>
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => setShowFilter((s) => !s)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          {showFilter &&
            dropdownPos &&
            createPortal(
              <div
                style={{
                  top: dropdownPos.top,
                  right: dropdownPos.right,
                  width: 256,
                }}
                className="fixed rounded-md border border-gray-200 bg-white p-3 shadow-lg z-50"
              >
                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Category</p>
                  <div className="flex flex-col gap-1">
                    <button
                      className={`text-left text-sm p-1 rounded hover:bg-gray-100 ${
                        filterCategory === "all"
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                      onClick={() => setFilterCategory("all")}
                    >
                      All
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        className={`text-left text-sm p-1 rounded hover:bg-gray-100 ${
                          filterCategory === c ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => setFilterCategory(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filterUnread}
                      onChange={(e) => setFilterUnread(e.target.checked)}
                    />
                    Unread only
                  </label>
                </div>
              </div>,
              document.body
            )}
        </div>

        {/* Notification Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-7 min-w-[700px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="route">Route</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No notifications found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "You're all caught up!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${getNotificationColor(notification.type)} ${
                      !notification.read ? "border-l-4 border-l-blue-500" : ""
                    } hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full bg-white ${getIconColor(
                            notification.type
                          )} flex-shrink-0`}
                        >
                          <notification.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold mb-1 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMarkRead(notification.id)}
                                aria-label="Mark as read"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteNotification(notification.id)}
                                aria-label="Delete notification"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
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

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Notifications
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Unread
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {unreadCount}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Urgent
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {notifications.filter((n) => n.type === "urgent").length}
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Today
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      notifications.filter(
                        (n) =>
                          n.time.includes("hour") || n.time.includes("minute")
                      ).length
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
