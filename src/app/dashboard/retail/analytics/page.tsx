"use client";

import "@/styles/retail-animations.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    IndianRupee,
    Package,
    Users,
    ArrowLeft,
    Calendar,
    Download,
    Target,
    Star,
    Clock,
    Truck,
    ShoppingCart,
    AlertTriangle,
    CheckCircle,
    Activity,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");
    const [isExporting, setIsExporting] = useState(false);

    const salesData = {
        totalRevenue: 125000,
        revenueGrowth: 12.5,
        totalOrders: 89,
        ordersGrowth: 8.3,
        avgOrderValue: 1404,
        avgOrderGrowth: 4.2,
        customerCount: 156,
        customerGrowth: 15.7
    };

    const topProducts = [
        { name: "Fresh Tomatoes", sales: 45, revenue: 3600, growth: 12 },
        { name: "Organic Milk", sales: 38, revenue: 2470, growth: -5 },
        { name: "Wheat Flour", sales: 32, revenue: 1440, growth: 8 },
        { name: "Fresh Apples", sales: 28, revenue: 3360, growth: 15 },
        { name: "Organic Carrots", sales: 25, revenue: 1500, growth: 3 }
    ];

    const supplierPerformance = [
        { name: "Green Valley Farm", orders: 23, onTime: 96, rating: 4.8, value: 45000 },
        { name: "Sunrise Dairy", orders: 18, onTime: 98, rating: 4.9, value: 32000 },
        { name: "Mountain Fruits", orders: 15, onTime: 94, rating: 4.7, value: 28000 },
        { name: "Golden Grains", orders: 12, onTime: 92, rating: 4.6, value: 22000 }
    ];

    const monthlyTrends = [
        { month: "Oct", revenue: 98000, orders: 67, customers: 134 },
        { month: "Nov", revenue: 112000, orders: 78, customers: 145 },
        { month: "Dec", revenue: 125000, orders: 89, customers: 156 }
    ];

    const categoryBreakdown = [
        { category: "Vegetables", percentage: 35, value: 43750, color: "bg-green-500" },
        { category: "Fruits", percentage: 28, value: 35000, color: "bg-orange-500" },
        { category: "Dairy", percentage: 22, value: 27500, color: "bg-blue-500" },
        { category: "Grains", percentage: 15, value: 18750, color: "bg-yellow-500" }
    ];

    const kpis = [
        { name: "Order Fulfillment Rate", value: 94, target: 95, status: "warning" },
        { name: "Customer Retention", value: 87, target: 85, status: "good" },
        { name: "Supplier Reliability", value: 91, target: 90, status: "good" },
        { name: "Inventory Turnover", value: 6.2, target: 6.0, status: "good" }
    ];

    const handleExportAnalytics = async () => {
        setIsExporting(true);
        
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create comprehensive analytics report
            const reportData = {
                reportDate: new Date().toISOString(),
                timeRange: timeRange,
                salesMetrics: salesData,
                topProducts: topProducts,
                supplierPerformance: supplierPerformance,
                monthlyTrends: monthlyTrends,
                categoryBreakdown: categoryBreakdown,
                kpis: kpis,
                operationalMetrics: {
                    orderProcessingTime: "2.3 hours",
                    inventoryAccuracy: "96%",
                    customerResponseTime: "1.5 hours"
                },
                financialHealth: {
                    profitMargin: "18%",
                    inventoryTurnover: "6.2x",
                    inventoryValue: "₹89K",
                    avgCollection: "15 days"
                }
            };
            
            // Convert to CSV format
            const csvContent = [
                // Sales Metrics
                "SALES METRICS",
                "Metric,Value,Growth",
                `Total Revenue,₹${salesData.totalRevenue.toLocaleString()},+${salesData.revenueGrowth}%`,
                `Total Orders,${salesData.totalOrders},+${salesData.ordersGrowth}%`,
                `Avg Order Value,₹${salesData.avgOrderValue},+${salesData.avgOrderGrowth}%`,
                `Active Customers,${salesData.customerCount},+${salesData.customerGrowth}%`,
                "",
                // Top Products
                "TOP PRODUCTS",
                "Product,Sales,Revenue,Growth",
                ...topProducts.map(p => `${p.name},${p.sales},₹${p.revenue.toLocaleString()},${p.growth > 0 ? '+' : ''}${p.growth}%`),
                "",
                // Supplier Performance
                "SUPPLIER PERFORMANCE",
                "Supplier,Orders,On-Time %,Rating,Total Value",
                ...supplierPerformance.map(s => `${s.name},${s.orders},${s.onTime}%,${s.rating},₹${s.value.toLocaleString()}`),
                "",
                // Category Breakdown
                "CATEGORY BREAKDOWN",
                "Category,Percentage,Value",
                ...categoryBreakdown.map(c => `${c.category},${c.percentage}%,₹${c.value.toLocaleString()}`),
                "",
                // KPIs
                "KEY PERFORMANCE INDICATORS",
                "KPI,Current Value,Target,Status",
                ...kpis.map(k => `${k.name},${k.value}${typeof k.value === 'number' && k.value < 10 ? '' : '%'},${k.target}${typeof k.target === 'number' && k.target < 10 ? '' : '%'},${k.status}`)
            ].join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert(`Analytics report exported successfully!\n\nReport includes:\n• Sales metrics and trends\n• Top performing products\n• Supplier performance data\n• Category breakdown\n• KPI dashboard\n• Operational metrics`);
            
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export analytics report. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 page-transition">
            {/* Header */}
            <div className="flex items-center gap-4 animate-fade-in-up">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/retail">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Comprehensive insights into your retail performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {["7d", "30d", "90d", "1y"].map((range) => (
                            <Button
                                key={range}
                                variant={timeRange === range ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTimeRange(range)}
                            >
                                {range}
                            </Button>
                        ))}
                    </div>
                    <Button 
                        variant="outline"
                        onClick={handleExportAnalytics}
                        disabled={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isExporting ? "Exporting..." : "Export"}
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">₹{salesData.totalRevenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">+{salesData.revenueGrowth}%</span>
                                </div>
                            </div>
                            <IndianRupee className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{salesData.totalOrders}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">+{salesData.ordersGrowth}%</span>
                                </div>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                                <p className="text-2xl font-bold">₹{salesData.avgOrderValue}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">+{salesData.avgOrderGrowth}%</span>
                                </div>
                            </div>
                            <Target className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                                <p className="text-2xl font-bold">{salesData.customerCount}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">+{salesData.customerGrowth}%</span>
                                </div>
                            </div>
                            <Users className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Category Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by Category</CardTitle>
                                <CardDescription>Revenue distribution across product categories</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {categoryBreakdown.map((category, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{category.category}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {category.percentage}% (₹{category.value.toLocaleString()})
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${category.color}`}
                                                style={{ width: `${category.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Monthly Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Trends</CardTitle>
                                <CardDescription>Revenue and order trends over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {monthlyTrends.map((month, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{month.month} 2024</p>
                                                <p className="text-sm text-muted-foreground">{month.orders} orders</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">₹{month.revenue.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground">{month.customers} customers</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* KPI Dashboard */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Performance Indicators</CardTitle>
                            <CardDescription>Track your business performance against targets</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {kpis.map((kpi, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">{kpi.name}</span>
                                            {kpi.status === "good" ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold">{kpi.value}{typeof kpi.value === 'number' && kpi.value < 10 ? '' : '%'}</span>
                                                <span className="text-sm text-muted-foreground">Target: {kpi.target}{typeof kpi.target === 'number' && kpi.target < 10 ? '' : '%'}</span>
                                            </div>
                                            <Progress 
                                                value={typeof kpi.value === 'number' && kpi.value < 10 ? (kpi.value / kpi.target) * 100 : kpi.value} 
                                                className="h-2" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Products</CardTitle>
                            <CardDescription>Best selling products by revenue and quantity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                                            <div className="flex items-center gap-1">
                                                {product.growth > 0 ? (
                                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                                )}
                                                <span className={`text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.growth > 0 ? '+' : ''}{product.growth}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suppliers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Performance Analysis</CardTitle>
                            <CardDescription>Evaluate supplier reliability and performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {supplierPerformance.map((supplier, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold">{supplier.name}</h4>
                                            <Badge variant="outline">
                                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                {supplier.rating}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-lg font-bold">{supplier.orders}</p>
                                                <p className="text-xs text-muted-foreground">Orders</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold">{supplier.onTime}%</p>
                                                <p className="text-xs text-muted-foreground">On-time Delivery</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold">₹{(supplier.value / 1000).toFixed(0)}K</p>
                                                <p className="text-xs text-muted-foreground">Total Value</p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Performance Score</span>
                                                <span>{Math.round((supplier.onTime + supplier.rating * 20) / 2)}%</span>
                                            </div>
                                            <Progress value={Math.round((supplier.onTime + supplier.rating * 20) / 2)} className="h-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Operational Efficiency</CardTitle>
                                <CardDescription>Key operational metrics and efficiency indicators</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Order Processing Time</span>
                                            <span className="text-sm font-medium">2.3 hours</span>
                                        </div>
                                        <Progress value={85} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Inventory Accuracy</span>
                                            <span className="text-sm font-medium">96%</span>
                                        </div>
                                        <Progress value={96} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Customer Response Time</span>
                                            <span className="text-sm font-medium">1.5 hours</span>
                                        </div>
                                        <Progress value={92} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Health</CardTitle>
                                <CardDescription>Financial performance and health indicators</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">18%</p>
                                        <p className="text-sm text-muted-foreground">Profit Margin</p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">6.2x</p>
                                        <p className="text-sm text-muted-foreground">Inventory Turnover</p>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <p className="text-2xl font-bold text-purple-600">₹89K</p>
                                        <p className="text-sm text-muted-foreground">Inventory Value</p>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <p className="text-2xl font-bold text-orange-600">15 days</p>
                                        <p className="text-sm text-muted-foreground">Avg Collection</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}