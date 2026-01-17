"use client";

import "@/styles/retail-animations.css";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  IndianRupee,
  Calendar,
  Building,
  Phone,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function RetailNotifications() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifyInventory, setNotifyInventory] = useState(true);
  const [notifyDelivery, setNotifyDelivery] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifySuppliers, setNotifySuppliers] = useState(false);
  const [notifyFeedback, setNotifyFeedback] = useState(false);
  const [notifyPricing, setNotifyPricing] = useState(true);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "urgent",
      title: "Low Stock Alert",
      message:
        "Organic Milk inventory is critically low. Only 8 liters remaining. Reorder immediately.",
      time: "5 minutes ago",
      read: false,
      icon: AlertTriangle,
      category: "inventory",
    },
    {
      id: "2",
      type: "success",
      title: "Order Delivered",
      message:
        "Order #ORD-001 from Green Valley Farm has been successfully delivered. 50kg fresh vegetables received.",
      time: "15 minutes ago",
      read: false,
      icon: CheckCircle,
      category: "delivery",
    },
    {
      id: "3",
      type: "info",
      title: "New Order Placed",
      message:
        "Order #ORD-004 placed with Sunrise Dairy for 100L organic milk. Expected delivery: Tomorrow.",
      time: "30 minutes ago",
      read: false,
      icon: ShoppingCart,
      category: "order",
    },
    {
      id: "4",
      type: "success",
      title: "Payment Confirmed",
      message: "Payment of ₹8,500 received from customer for today's sales.",
      time: "1 hour ago",
      read: true,
      icon: IndianRupee,
      category: "payment",
    },
    {
      id: "5",
      type: "info",
      title: "Supplier Update",
      message:
        "Mountain Fruits has new seasonal fruits available. Check their latest catalog for fresh arrivals.",
      time: "2 hours ago",
      read: true,
      icon: Building,
      category: "supplier",
    },
    {
      id: "6",
      type: "warning",
      title: "Delivery Delay",
      message:
        "Order #ORD-002 from Sunrise Dairy is delayed by 2 hours due to traffic conditions.",
      time: "3 hours ago",
      read: true,
      icon: Truck,
      category: "delivery",
    },
    {
      id: "7",
      type: "info",
      title: "Customer Feedback",
      message:
        "Received 5-star rating from Green Valley Restaurant for fresh vegetable quality.",
      time: "4 hours ago",
      read: true,
      icon: TrendingUp,
      category: "feedback",
    },
    {
      id: "8",
      type: "warning",
      title: "Price Update",
      message:
        "Golden Grains has updated wheat flour prices. New rate: ₹48/kg (increased by ₹3).",
      time: "5 hours ago",
      read: true,
      icon: Info,
      category: "pricing",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
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
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(notification.type);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(notification.category);
    return matchesSearch && matchesTab && matchesType && matchesCategory;
  });

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
  };

  const activeFiltersCount = selectedTypes.length + selectedCategories.length;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 page-transition">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/retail">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {t?.notifications?.title ?? "Notifications"}
            </h1>
            <p className="text-muted-foreground">
              {t?.notifications?.desc ??
                "Stay updated with your retail operations"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {`${unreadCount} ${t?.notifications?.unread ?? "unread"}`}
          </Badge>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t?.notifications?.settings ?? "Settings"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {t?.notifications?.settingsTitle ?? "Notification Settings"}
                </DialogTitle>
                <DialogDescription>
                  {t?.notifications?.settingsDesc ??
                    "Manage your notification preferences and customize how you receive alerts."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    {t?.notifications?.generalPreferences ??
                      "General Preferences"}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        {t?.notifications?.emailNotificationsLabel ??
                          "Email Notifications"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t?.notifications?.emailNotificationsDesc ??
                          "Receive notifications via email"}
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">
                        {t?.notifications?.pushNotificationsLabel ??
                          "Push Notifications"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t?.notifications?.pushNotificationsDesc ??
                          "Receive push notifications in browser"}
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound-enabled">
                        {t?.notifications?.soundAlertsLabel ?? "Sound Alerts"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t?.notifications?.soundAlertsDesc ??
                          "Play sound for new notifications"}
                      </p>
                    </div>
                    <Switch
                      id="sound-enabled"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                </div>

                {/* Category Settings */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold">
                    {t?.notifications?.categoriesTitle ??
                      "Notification Categories"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t?.notifications?.categoriesDesc ??
                      "Choose which types of notifications you want to receive"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-inventory">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Low stock and inventory updates
                      </p>
                    </div>
                    <Switch
                      id="notify-inventory"
                      checked={notifyInventory}
                      onCheckedChange={setNotifyInventory}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-delivery">Delivery Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Delivery status and tracking
                      </p>
                    </div>
                    <Switch
                      id="notify-delivery"
                      checked={notifyDelivery}
                      onCheckedChange={setNotifyDelivery}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-orders">Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        New orders and order updates
                      </p>
                    </div>
                    <Switch
                      id="notify-orders"
                      checked={notifyOrders}
                      onCheckedChange={setNotifyOrders}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-payments">Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Payment confirmations and receipts
                      </p>
                    </div>
                    <Switch
                      id="notify-payments"
                      checked={notifyPayments}
                      onCheckedChange={setNotifyPayments}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-suppliers">Supplier Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New products and supplier news
                      </p>
                    </div>
                    <Switch
                      id="notify-suppliers"
                      checked={notifySuppliers}
                      onCheckedChange={setNotifySuppliers}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-feedback">Customer Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Reviews and ratings
                      </p>
                    </div>
                    <Switch
                      id="notify-feedback"
                      checked={notifyFeedback}
                      onCheckedChange={setNotifyFeedback}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-pricing">Price Changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Product price updates
                      </p>
                    </div>
                    <Switch
                      id="notify-pricing"
                      checked={notifyPricing}
                      onCheckedChange={setNotifyPricing}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSettingsOpen(false)}
                >
                  {t?.common?.cancel ?? "Cancel"}
                </Button>
                <Button onClick={() => setSettingsOpen(false)}>
                  {t?.common?.saveChanges ?? "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder={
                t?.notifications?.searchPlaceholder ?? "Search notifications..."
              }
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t?.notifications?.filter ?? "Filter"}
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {t?.notifications?.filters?.byType ?? "Filter by Type"}
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("urgent")}
              onCheckedChange={() => toggleType("urgent")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {t?.notifications?.types?.urgent ?? "Urgent"}
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("warning")}
              onCheckedChange={() => toggleType("warning")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                {t?.notifications?.types?.warning ?? "Warning"}
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("success")}
              onCheckedChange={() => toggleType("success")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {t?.notifications?.types?.success ?? "Success"}
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("info")}
              onCheckedChange={() => toggleType("info")}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {t?.notifications?.types?.info ?? "Info"}
              </span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>
              {t?.notifications?.filters?.byCategory ?? "Filter by Category"}
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("inventory")}
              onCheckedChange={() => toggleCategory("inventory")}
            >
              {t?.notifications?.categories?.inventory ?? "Inventory"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("delivery")}
              onCheckedChange={() => toggleCategory("delivery")}
            >
              {t?.notifications?.categories?.delivery ?? "Delivery"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("order")}
              onCheckedChange={() => toggleCategory("order")}
            >
              {t?.notifications?.categories?.order ?? "Order"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("payment")}
              onCheckedChange={() => toggleCategory("payment")}
            >
              {t?.notifications?.categories?.payment ?? "Payment"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("supplier")}
              onCheckedChange={() => toggleCategory("supplier")}
            >
              {t?.notifications?.categories?.supplier ?? "Supplier"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("feedback")}
              onCheckedChange={() => toggleCategory("feedback")}
            >
              {t?.notifications?.categories?.feedback ?? "Feedback"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes("pricing")}
              onCheckedChange={() => toggleCategory("pricing")}
            >
              {t?.notifications?.categories?.pricing ?? "Pricing"}
            </DropdownMenuCheckboxItem>

            {activeFiltersCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={clearFilters}
                >
                  {t?.filters?.clear ?? "Clear Filters"}
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
              <Bell className="h-8 w-8 text-blue-500 icon-bounce" />
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
              <Activity className="h-8 w-8 text-orange-500 icon-bounce" />
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
              <AlertTriangle className="h-8 w-8 text-red-500 icon-bounce" />
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
              <Calendar className="h-8 w-8 text-green-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
