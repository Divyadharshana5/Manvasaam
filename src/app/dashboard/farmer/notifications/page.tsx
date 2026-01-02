"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Package,
  Sprout,
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
  ShoppingCart,
  TrendingUp,
  IndianRupee,
  Calendar,
  Leaf,
  Apple,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FarmerNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filters, setFilters] = useState({
    unreadOnly: false,
    showUrgent: true,
    showInfo: true,
    showSuccess: true,
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    urgentAlertsOnly: false,
    dailyDigest: true,
    weeklyReport: false,
  });

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "urgent",
      title: "Low Stock Alert",
      message:
        "Your organic tomatoes inventory is running low. Only 5kg remaining in stock.",
      time: "5 minutes ago",
      read: false,
      icon: AlertTriangle,
      category: "inventory",
    },
    {
      id: "2",
      type: "success",
      title: "Order Completed",
      message:
        "Order #ORD-001 for 25kg organic tomatoes has been successfully delivered to Green Valley Restaurant.",
      time: "15 minutes ago",
      read: false,
      icon: CheckCircle,
      category: "order",
    },
    {
      id: "3",
      type: "info",
      title: "New Order Received",
      message:
        "Fresh Market has placed an order for 20kg organic carrots. Expected delivery: Tomorrow.",
      time: "30 minutes ago",
      read: false,
      icon: ShoppingCart,
      category: "order",
    },
    {
      id: "4",
      type: "success",
      title: "Payment Received",
      message: "Payment of ₹2,500 received from City Hub for spinach delivery.",
      time: "1 hour ago",
      read: true,
      icon: IndianRupee,
      category: "payment",
    },
    {
      id: "5",
      type: "info",
      title: "Seasonal Demand Update",
      message:
        "High demand expected for winter vegetables. Consider increasing production of leafy greens.",
      time: "2 hours ago",
      read: true,
      icon: TrendingUp,
      category: "market",
    },
    {
      id: "6",
      type: "warning",
      title: "Weather Alert",
      message:
        "Heavy rain expected this weekend. Ensure proper crop protection measures are in place.",
      time: "3 hours ago",
      read: true,
      icon: Info,
      category: "weather",
    },
  ]);

  // Function to mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Function to delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "read" && notification.read);

    // Apply filters
    const matchesReadFilter = !filters.unreadOnly || !notification.read;
    const matchesTypeFilter =
      (notification.type === "urgent" && filters.showUrgent) ||
      (notification.type === "info" && filters.showInfo) ||
      (notification.type === "success" && filters.showSuccess);

    return (
      matchesSearch && matchesTab && matchesReadFilter && matchesTypeFilter
    );
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/farmer">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your farming operations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
          className={
            filters.unreadOnly ||
            !filters.showUrgent ||
            !filters.showInfo ||
            !filters.showSuccess
              ? "border-green-500 bg-green-50"
              : ""
          }
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      {/* Filter Dialog */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[2147483600]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl ring-2 ring-green-500/40 border border-green-200 animate-in zoom-in-95">
              <div className="sticky top-0 z-10 flex items-start justify-between p-4 border-b bg-white/90 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold">
                    Filter Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Customize your view
                  </p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Unread Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unreadOnly"
                    checked={filters.unreadOnly}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        unreadOnly: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="unreadOnly"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show unread only
                  </Label>
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Notification Types
                  </Label>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showUrgent"
                      checked={filters.showUrgent}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          showUrgent: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="showUrgent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Urgent Alerts
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showInfo"
                      checked={filters.showInfo}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          showInfo: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="showInfo"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <Info className="h-4 w-4 text-blue-500" />
                      Information
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showSuccess"
                      checked={filters.showSuccess}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          showSuccess: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="showSuccess"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Success Updates
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 p-4 border-t bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      unreadOnly: false,
                      showUrgent: true,
                      showInfo: true,
                      showSuccess: true,
                    });
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[2147483600]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl ring-2 ring-green-500/40 border border-green-200 animate-in zoom-in-95">
              <div className="sticky top-0 z-10 flex items-start justify-between p-4 border-b bg-white/90 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold">
                    Notification Settings
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your notification preferences
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Notification Channels
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Choose how you want to receive notifications
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-green-600" />
                      <Label
                        htmlFor="emailNotifications"
                        className="text-sm font-medium"
                      >
                        Email Notifications
                      </Label>
                    </div>
                    <Checkbox
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked as boolean,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <Label
                        htmlFor="pushNotifications"
                        className="text-sm font-medium"
                      >
                        Push Notifications
                      </Label>
                    </div>
                    <Checkbox
                      id="pushNotifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          pushNotifications: checked as boolean,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-purple-600" />
                      <Label
                        htmlFor="smsNotifications"
                        className="text-sm font-medium"
                      >
                        SMS Notifications
                      </Label>
                    </div>
                    <Checkbox
                      id="smsNotifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          smsNotifications: checked as boolean,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-4" />

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Notification Preferences
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Customize what notifications you receive
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <Label
                        htmlFor="urgentAlertsOnly"
                        className="text-sm font-medium"
                      >
                        Urgent Alerts Only
                      </Label>
                    </div>
                    <Checkbox
                      id="urgentAlertsOnly"
                      checked={settings.urgentAlertsOnly}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          urgentAlertsOnly: checked as boolean,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <Label
                        htmlFor="dailyDigest"
                        className="text-sm font-medium"
                      >
                        Daily Digest
                      </Label>
                    </div>
                    <Checkbox
                      id="dailyDigest"
                      checked={settings.dailyDigest}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          dailyDigest: checked as boolean,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <Label
                        htmlFor="weeklyReport"
                        className="text-sm font-medium"
                      >
                        Weekly Report
                      </Label>
                    </div>
                    <Checkbox
                      id="weeklyReport"
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          weeklyReport: checked as boolean,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 p-4 border-t bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSettings({
                      emailNotifications: true,
                      pushNotifications: true,
                      smsNotifications: false,
                      urgentAlertsOnly: false,
                      dailyDigest: true,
                      weeklyReport: false,
                    });
                  }}
                >
                  Reset to Default
                </Button>
                <Button
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
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
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${getTypeColor(
                          notification.type
                        )}`}
                      >
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
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              title="Delete notification"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
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
                <p className="text-2xl font-bold text-orange-600">
                  {unreadCount}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
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
    </motion.div>
  );
}
