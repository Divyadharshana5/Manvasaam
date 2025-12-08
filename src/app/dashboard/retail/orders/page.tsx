"use client";

import "@/styles/retail-animations.css";
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
  IndianRupee,
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
  X,
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

  const handleExport = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Order ID', 'Supplier', 'Contact', 'Items', 'Total Amount', 'Status', 'Order Date', 'Delivery Date', 'Payment Status', 'Priority'];
      const csvRows = filteredOrders.map(order => [
        order.id,
        order.supplier,
        order.supplierContact,
        order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
        order.totalAmount,
        order.status,
        order.orderDate,
        order.deliveryDate,
        order.paymentStatus,
        order.priority
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Successfully exported ${filteredOrders.length} orders to CSV!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export orders. Please try again.');
    }
  };

  const handleNewOrder = () => {
    router.push('/dashboard/retail/orders/new');
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage your supplier orders</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={filteredOrders.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleNewOrder}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 stat-card card-glow animate-fade-in-up stagger-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 stat-card card-glow animate-fade-in-up stagger-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 stat-card card-glow animate-fade-in-up stagger-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 stat-card card-glow animate-fade-in-up stagger-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total order value</p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-500 icon-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none z-10" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
          {/* Active Filters Indicator */}
          {(searchQuery || statusFilter !== "all" || dateFilter !== "all" || priorityFilter !== "all" || paymentFilter !== "all" || supplierFilter !== "all") && (
            <Badge variant="secondary" className="ml-2">
              {[
                searchQuery ? "search" : null,
                statusFilter !== "all" ? "status" : null,
                dateFilter !== "all" ? "date" : null,
                priorityFilter !== "all" ? "priority" : null,
                paymentFilter !== "all" ? "payment" : null,
                supplierFilter !== "all" ? "supplier" : null
              ].filter(Boolean).length} active
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMoreFilters}
            className={showMoreFilters ? "bg-blue-50 border-blue-200" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* More Filters Panel */}
      {showMoreFilters && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Payment Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {uniqueSuppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
              {(dateFilter !== "all" || priorityFilter !== "all" || paymentFilter !== "all" || supplierFilter !== "all") && (
                <Badge variant="secondary" className="ml-2">
                  {[dateFilter, priorityFilter, paymentFilter, supplierFilter]
                    .filter(f => f !== "all").length} filters active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 tab-content">
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
                <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer animate-fade-in-up list-item" onClick={() => handleViewOrder(order)}>
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