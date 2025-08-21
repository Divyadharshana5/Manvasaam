"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Search,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const payments = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    farmer: "Green Valley Farm",
    amount: "₹4,500",
    status: "completed",
    method: "UPI",
    date: "2024-01-16",
    dueDate: "2024-01-15",
    description: "Organic Tomatoes, Spinach",
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    farmer: "Sunrise Organics",
    amount: "₹3,200",
    status: "pending",
    method: "Bank Transfer",
    date: "2024-01-17",
    dueDate: "2024-01-17",
    description: "Fresh Carrots, Beetroot",
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    farmer: "Happy Cow Dairy",
    amount: "₹6,800",
    status: "overdue",
    method: "UPI",
    date: "2024-01-18",
    dueDate: "2024-01-16",
    description: "Organic Milk, Paneer",
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    farmer: "Millet Masters",
    amount: "₹2,100",
    status: "scheduled",
    method: "Bank Transfer",
    date: "2024-01-19",
    dueDate: "2024-01-19",
    description: "Finger Millet, Pearl Millet",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "scheduled":
      return <Calendar className="h-4 w-4 text-blue-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const totalAmount = payments.reduce((sum, payment) => 
    sum + parseInt(payment.amount.replace(/[^\d]/g, "")), 0
  );

  const completedAmount = payments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => sum + parseInt(payment.amount.replace(/[^\d]/g, "")), 0);

  const pendingAmount = payments
    .filter(p => p.status === "pending" || p.status === "scheduled")
    .reduce((sum, payment) => sum + parseInt(payment.amount.replace(/[^\d]/g, "")), 0);

  const overdueAmount = payments
    .filter(p => p.status === "overdue")
    .reduce((sum, payment) => sum + parseInt(payment.amount.replace(/[^\d]/g, "")), 0);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track transactions with your contract farmers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{completedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === "completed").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === "pending" || p.status === "scheduled").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All transactions with your contract farmers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.farmer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {payment.description}
                      </TableCell>
                      <TableCell className="font-medium">{payment.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {payment.method}
                        </div>
                      </TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          {getStatusBadge(payment.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payment.status === "pending" && (
                            <Button size="sm">Pay Now</Button>
                          )}
                          {payment.status === "overdue" && (
                            <Button size="sm" variant="destructive">Pay Now</Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your preferred payment options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">restaurant@upi</p>
                </div>
              </div>
              <Badge>Primary</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">****1234</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common payment operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Pay All Pending
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Payments
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Statements
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Payment Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}