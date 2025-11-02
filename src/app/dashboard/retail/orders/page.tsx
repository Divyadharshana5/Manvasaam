"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Truck,
  Search,
  Plus,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const orders = [
    {
      id: "ORD-001",
      supplier: "Green Valley Farm",
      supplierContact: "+91 98765 43210",
      items: [
        { name: "Fresh Tomatoes", quantity: "25 kg", price: 80 },
        { name: "Fresh Onions", quantity: "20 kg", price: 60 },
        { name: "Potatoes", quantity: "30 kg", price: 40 }
      ],
      totalAmount: 4700,
      status: "delivered",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-16",
      deliveryAddress: "123 Market Street, Downtown",
      paymentStatus: "paid",
      priority: "medium"
    },
    {
      id: "ORD-002",
      supplier: "Sunrise Dairy",
      supplierContact: "+91 98765 43211",
      items: [
        { name: "Organic Milk", quantity: "50 L", price: 65 },
        { name: "Fresh Yogurt", quantity: "20 cups", price: 45 },
        { name: "Cheese", quantity: "5 kg", price: 200 }
      ],
      totalAmount: 4150,
      status: "pending",
      orderDate: "2024-01-14",
      deliveryDate: "2024-01-17",
      deliveryAddress: "456 Fresh Avenue, Midtown",
      paymentStatus: "pending",
      priority: "high"
    },
    {
      id: "ORD-003",
      supplier: "Mountain Fruits",
      supplierContact: "+91 98765 43212",
      items: [
        { name: "Fresh Apples", quantity: "40 kg", price: 120 },
        { name: "Bananas", quantity: "30 kg", price: 80 },
        { name: "Oranges", quantity: "25 kg", price: 100 }
      ],
      totalAmount: 7300,
      status: "processing",
      orderDate: "2024-01-13",
      deliveryDate: "2024-01-18",
      deliveryAddress: "789 Fruit Market, Uptown",
      paymentStatus: "paid",
      priority: "low"
    },
    {
      id: "ORD-004",
      supplier: "Golden Grains",
      supplierContact: "+91 98765 43213",
      items: [
        { name: "Wheat Flour", quantity: "50 kg", price: 45 },
        { name: "Rice", quantity: "40 kg", price: 70 },
        { name: "Lentils", quantity: "20 kg", price: 90 }
      ],
      totalAmount: 6050,
      status: "cancelled",
      orderDate: "2024-01-12",
      deliveryDate: "2024-01-19",
      deliveryAddress: "321 Grain Street, Southside",
      paymentStatus: "refunded",
      priority: "medium"
    }
  ];

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    processingOrders: orders.filter(o => o.status === 'processing').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "refunded": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    const matchesSupplier = supplierFilter === "all" || order.supplier === supplierFilter;
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTab && matchesPriority && matchesPayment && matchesSupplier && matchesDate;
  });

  const handleViewOrder = (order: any) => {
    // Navigate to detailed order view
    router.push(`/dashboard/retail/orders/${order.id}`);
  };

  const handleProcessOrder = async (order: any) => {
    if (order.status !== 'pending') {
      alert('Only pending orders can be processed.');
      return;
    }

    const confirmProcess = confirm(
      `Are you sure you want to process order ${order.id}?\n\n` +
      `Supplier: ${order.supplier}\n` +
      `Total Amount: ₹${order.totalAmount.toLocaleString()}\n\n` +
      `This will change the status to "processing".`
    );

    if (!confirmProcess) return;

    setProcessingOrderId(order.id);

    try {
      // Simulate API call to process the order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to update the order status
      console.log(`Processing order ${order.id}`);
      
      alert(`Order ${order.id} has been successfully processed!\n\nStatus updated to: PROCESSING\nThe supplier has been notified.`);
      
      // In a real app, you would update the order status in your state/database
      // For now, we'll just show the success message
      
    } catch (error) {
      console.error('Failed to process order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleTrackOrder = (order: any) => {
    const trackingInfo = `
TRACKING INFORMATION - ${order.id}

Current Status: ${order.status.toUpperCase()}
Supplier: ${order.supplier}

Tracking Timeline:
✓ Order Placed - ${order.orderDate}
✓ Order Confirmed - ${order.orderDate}
🚛 In Transit - Expected ${order.deliveryDate}
📦 Out for Delivery - ${order.deliveryDate}
🏠 Delivered - Pending

Estimated Delivery: ${order.deliveryDate}
Delivery Address: ${order.deliveryAddress}

For real-time updates, contact supplier at ${order.supplierContact}
    `;
    
    alert(trackingInfo);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would fetch fresh data from the API
      console.log('Refreshing orders data...');
      
      // Show success message
      alert('Orders data refreshed successfully!');
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setPriorityFilter("all");
    setPaymentFilter("all");
    setSupplierFilter("all");
    setActiveTab("all");
  };

  const uniqueSuppliers = [...new Set(orders.map(order => order.supplier))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage your supplier orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/dashboard/retail/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total order value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Start by creating your first order"}
                </p>
                <Button asChild>
                  <Link href="/dashboard/retail/orders/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewOrder(order)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority} priority
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.supplier}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{order.supplierContact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Ordered: {order.orderDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>Delivery: {order.deliveryDate}</span>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{order.deliveryAddress}</span>
                          </div>
                        </div>

                        {/* Items Summary */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} - {item.quantity}</span>
                                <span>₹{item.price}/unit</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{order.totalAmount.toLocaleString()}</p>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleProcessOrder(order)}
                              disabled={processingOrderId === order.id}
                            >
                              {processingOrderId === order.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                'Process'
                              )}
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleTrackOrder(order)}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          )}
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
    </div>
  );
}