"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Truck,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Download,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  // Mock data - in a real app, this would be fetched based on params.id
  const order = {
    id: params.id,
    supplier: "Green Valley Farm",
    supplierContact: "+91 98765 43210",
    supplierEmail: "orders@greenvalleyfarm.com",
    items: [
      { name: "Fresh Tomatoes", quantity: "25 kg", price: 80, total: 2000 },
      { name: "Fresh Onions", quantity: "20 kg", price: 60, total: 1200 },
      { name: "Potatoes", quantity: "30 kg", price: 40, total: 1200 },
      { name: "Carrots", quantity: "15 kg", price: 70, total: 1050 },
    ],
    subtotal: 5450,
    tax: 272.5,
    shipping: 100,
    totalAmount: 5822.5,
    status: "pending",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-16",
    deliveryAddress: "123 Market Street, Downtown, City - 400001",
    paymentStatus: "pending",
    priority: "medium",
    notes: "Please ensure fresh vegetables. Call before delivery.",
    orderHistory: [
      { date: "2024-01-15 10:30 AM", status: "Order Placed", description: "Order created and sent to supplier" },
      { date: "2024-01-15 11:15 AM", status: "Order Confirmed", description: "Supplier confirmed the order" },
    ]
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

  const handleProcessOrder = async () => {
    if (order.status !== 'pending') {
      alert('Only pending orders can be processed.');
      return;
    }

    // Show detailed confirmation
    const orderSummary = `
ORDER PROCESSING CONFIRMATION

Order ID: ${order.id}
Supplier: ${order.supplier}
Items: ${order.items.length} products
Total Value: ₹${order.totalAmount.toLocaleString()}
Delivery Date: ${order.deliveryDate}

Actions that will be taken:
✓ Order status → PROCESSING
✓ Supplier notification sent
✓ Inventory allocation
✓ Delivery scheduling
✓ Payment processing initiated

Continue with processing?
    `;

    const confirmProcess = confirm(orderSummary);
    if (!confirmProcess) return;

    setIsProcessing(true);

    try {
      // Simulate processing steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 1: Update order status
      console.log('Step 1: Updating order status...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Send supplier notification
      console.log('Step 2: Sending supplier notification...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Allocate inventory
      console.log('Step 3: Allocating inventory...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 4: Schedule delivery
      console.log('Step 4: Scheduling delivery...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const successMessage = `
✅ ORDER PROCESSED SUCCESSFULLY!

Order ${order.id} Status: PROCESSING

Completed Actions:
✓ Order status updated
✓ ${order.supplier} notified via email & SMS
✓ Inventory allocated for ${order.items.length} items
✓ Delivery scheduled for ${order.deliveryDate}
✓ Payment processing initiated

Next Steps:
• Supplier will prepare items
• You'll receive updates via notifications
• Track progress in the orders dashboard

Estimated completion: ${order.deliveryDate}
      `;

      alert(successMessage);
      
      // In a real app, you would update the order status and refresh data
      // For demo purposes, we'll navigate back to orders list
      const stayOnPage = confirm('Order processed successfully!\n\nStay on this page to view details?');
      if (!stayOnPage) {
        router.push('/dashboard/retail/orders');
      }
      
    } catch (error) {
      console.error('Failed to process order:', error);
      alert('❌ Failed to process order. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportOrder = async () => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create comprehensive order data for export
      const exportData = {
        orderInfo: {
          orderId: order.id,
          supplier: order.supplier,
          supplierContact: order.supplierContact,
          supplierEmail: order.supplierEmail,
          status: order.status,
          priority: order.priority,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          deliveryAddress: order.deliveryAddress,
          paymentStatus: order.paymentStatus,
          notes: order.notes
        },
        items: order.items,
        financials: {
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          total: order.totalAmount
        },
        history: order.orderHistory
      };

      // Choose export format
      const exportFormat = confirm(
        "Choose export format:\n\nOK = PDF Report\nCancel = CSV Data"
      );

      if (exportFormat) {
        // Export as PDF-style text report
        const pdfContent = `
ORDER REPORT - ${order.id}
Generated: ${new Date().toLocaleString()}
========================================

SUPPLIER INFORMATION:
Company: ${order.supplier}
Email: ${order.supplierEmail}
Phone: ${order.supplierContact}

ORDER DETAILS:
Status: ${order.status.toUpperCase()}
Priority: ${order.priority.toUpperCase()}
Order Date: ${order.orderDate}
Delivery Date: ${order.deliveryDate}
Payment Status: ${order.paymentStatus.toUpperCase()}

DELIVERY ADDRESS:
${order.deliveryAddress}

ITEMS ORDERED:
${order.items.map((item, index) => 
  `${index + 1}. ${item.name}\n   Quantity: ${item.quantity}\n   Unit Price: ₹${item.price}\n   Total: ₹${item.total}`
).join('\n\n')}

FINANCIAL SUMMARY:
Subtotal: ₹${order.subtotal}
Tax (5%): ₹${order.tax}
Shipping: ₹${order.shipping}
TOTAL: ₹${order.totalAmount}

ORDER HISTORY:
${order.orderHistory.map(event => 
  `${event.date} - ${event.status}\n${event.description}`
).join('\n\n')}

${order.notes ? `\nNOTES:\n${order.notes}` : ''}

========================================
Report generated by Retail Management System
        `;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-report-${order.id}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } else {
        // Export as CSV
        const csvHeaders = ['Item Name', 'Quantity', 'Unit Price', 'Total Price'];
        const csvContent = [
          `Order ID: ${order.id}`,
          `Supplier: ${order.supplier}`,
          `Order Date: ${order.orderDate}`,
          `Status: ${order.status}`,
          '',
          csvHeaders.join(','),
          ...order.items.map(item => 
            `"${item.name}","${item.quantity}",${item.price},${item.total}`
          ),
          '',
          `Subtotal,,${order.subtotal}`,
          `Tax,,${order.tax}`,
          `Shipping,,${order.shipping}`,
          `Total,,${order.totalAmount}`
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-data-${order.id}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      alert('✅ Order exported successfully!\n\nThe file has been downloaded to your computer.');

    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Failed to export order. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleContactSupplier = async () => {
    const messageOptions = [
      `Hello ${order.supplier},\n\nRegarding order ${order.id} scheduled for delivery on ${order.deliveryDate}.\n\nPlease confirm the status and expected delivery time.\n\nThank you!`,
      `Hi ${order.supplier},\n\nI wanted to check on the progress of order ${order.id}.\n\nIs everything on track for delivery on ${order.deliveryDate}?\n\nBest regards`,
      `Dear ${order.supplier},\n\nOrder ${order.id} - Please provide an update on the preparation status.\n\nTotal items: ${order.items.length}\nDelivery address: ${order.deliveryAddress}\n\nThanks!`
    ];

    const selectedMessage = prompt(
      `Choose message type:\n\n1. Status confirmation\n2. Progress check\n3. Preparation update\n\nEnter 1, 2, or 3:`,
      "1"
    );

    if (!selectedMessage || !["1", "2", "3"].includes(selectedMessage)) {
      return;
    }

    const messageIndex = parseInt(selectedMessage) - 1;
    const message = messageOptions[messageIndex];

    const customMessage = prompt(
      `Edit message if needed:\n\n(Click OK to send as-is, or modify the text)`,
      message
    );

    if (!customMessage) return;

    setIsContacting(true);

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send email/SMS or create a notification
      console.log(`Message sent to ${order.supplier}:`, customMessage);
      
      alert(`✅ Message sent successfully to ${order.supplier}!\n\nSent via: Email (${order.supplierEmail})\nBackup: SMS (${order.supplierContact})\n\nThey will be notified immediately.`);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('❌ Failed to send message. Please try again or contact supplier directly.');
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/retail/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={handleExportOrder}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleContactSupplier}
            disabled={isContacting}
          >
            {isContacting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Supplier
              </>
            )}
          </Button>
          {order.status === 'pending' && (
            <Button 
              onClick={handleProcessOrder}
              disabled={isProcessing || isExporting || isContacting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Process Order'
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Status</span>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority} priority
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Order Date</p>
                    <p>{order.orderDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Delivery Date</p>
                    <p>{order.deliveryDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderHistory.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
                {order.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Awaiting Processing</p>
                      <p className="text-sm text-muted-foreground">Order is ready to be processed</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Supplier Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.supplier}</p>
                <p className="text-sm text-muted-foreground">{order.supplierEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.supplierContact}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.deliveryAddress}</p>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>₹{order.shipping.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <Badge className={`mt-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}