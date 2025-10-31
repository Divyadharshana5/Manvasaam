"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Package,
    Search,
    Filter,
    Download,
    Plus,
    ArrowLeft,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Eye,
    Edit,
    Trash2,
    Apple,
    Milk,
    Wheat,
    Leaf,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [isExporting, setIsExporting] = useState(false);

    const inventory = [
        { 
            id: 1,
            name: "Fresh Tomatoes", 
            category: "Vegetables", 
            stock: 45, 
            minStock: 20, 
            maxStock: 100,
            price: 80, 
            supplier: "Green Valley Farm", 
            icon: Apple,
            lastUpdated: "2024-01-15",
            trend: "up",
            value: 3600
        },
        { 
            id: 2,
            name: "Organic Milk", 
            category: "Dairy", 
            stock: 8, 
            minStock: 15, 
            maxStock: 50,
            price: 65, 
            supplier: "Sunrise Dairy", 
            icon: Milk,
            lastUpdated: "2024-01-14",
            trend: "down",
            value: 520
        },
        { 
            id: 3,
            name: "Wheat Flour", 
            category: "Grains", 
            stock: 25, 
            minStock: 10, 
            maxStock: 80,
            price: 45, 
            supplier: "Golden Grains", 
            icon: Wheat,
            lastUpdated: "2024-01-13",
            trend: "up",
            value: 1125
        },
        { 
            id: 4,
            name: "Fresh Apples", 
            category: "Fruits", 
            stock: 12, 
            minStock: 20, 
            maxStock: 60,
            price: 120, 
            supplier: "Mountain Fruits", 
            icon: Apple,
            lastUpdated: "2024-01-12",
            trend: "down",
            value: 1440
        },
        { 
            id: 5,
            name: "Organic Carrots", 
            category: "Vegetables", 
            stock: 35, 
            minStock: 15, 
            maxStock: 70,
            price: 60, 
            supplier: "Green Valley Farm", 
            icon: Apple,
            lastUpdated: "2024-01-15",
            trend: "up",
            value: 2100
        },
        { 
            id: 6,
            name: "Fresh Spinach", 
            category: "Vegetables", 
            stock: 5, 
            minStock: 10, 
            maxStock: 40,
            price: 40, 
            supplier: "Green Valley Farm", 
            icon: Leaf,
            lastUpdated: "2024-01-14",
            trend: "down",
            value: 200
        }
    ];

    const categories = ["all", "Vegetables", "Fruits", "Dairy", "Grains"];

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockItems = inventory.filter(item => item.stock <= item.minStock);
    const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.stock, 0);

    const getStockStatus = (item: any) => {
        if (item.stock <= item.minStock) return "low";
        if (item.stock >= item.maxStock * 0.8) return "high";
        return "normal";
    };

    const getStockColor = (status: string) => {
        switch (status) {
            case "low": return "text-red-600 bg-red-50 border-red-200";
            case "high": return "text-green-600 bg-green-50 border-green-200";
            default: return "text-blue-600 bg-blue-50 border-blue-200";
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create CSV content
            const headers = ['Name', 'Category', 'Stock', 'Min Stock', 'Max Stock', 'Price', 'Supplier', 'Value', 'Last Updated'];
            const csvContent = [
                headers.join(','),
                ...filteredInventory.map(item => [
                    item.name,
                    item.category,
                    item.stock,
                    item.minStock,
                    item.maxStock,
                    item.price,
                    item.supplier,
                    item.value,
                    item.lastUpdated
                ].join(','))
            ].join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('Inventory exported successfully!');
            
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export inventory. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleAddProduct = () => {
        // For now, show an alert. In a real app, this would open a modal or navigate to add product page
        alert('Add Product functionality - This would open a form to add a new product to inventory');
        // You could also navigate to a dedicated add product page:
        // router.push('/dashboard/retail/inventory/add');
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleViewProduct = (item: any) => {
        alert(`Viewing details for: ${item.name}\n\nCategory: ${item.category}\nStock: ${item.stock}/${item.maxStock}\nPrice: ₹${item.price}\nSupplier: ${item.supplier}\nValue: ₹${item.value}\nLast Updated: ${item.lastUpdated}`);
    };

    const handleEditProduct = (item: any) => {
        const newPrice = prompt(`Edit price for ${item.name}:`, item.price.toString());
        if (newPrice && !isNaN(Number(newPrice))) {
            // In a real app, this would update the database
            alert(`Price updated for ${item.name}: ₹${newPrice}`);
            console.log(`Updated ${item.name} price to ₹${newPrice}`);
        }
    };

    const handleAddStock = (item: any) => {
        const additionalStock = prompt(`Add stock for ${item.name} (current: ${item.stock}):`, "10");
        if (additionalStock && !isNaN(Number(additionalStock)) && Number(additionalStock) > 0) {
            const newStock = item.stock + Number(additionalStock);
            // In a real app, this would update the database
            alert(`Stock updated for ${item.name}: ${newStock} units (added ${additionalStock})`);
            console.log(`Added ${additionalStock} units to ${item.name}. New stock: ${newStock}`);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/retail">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <p className="text-muted-foreground">Monitor and manage your product inventory</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isExporting ? "Exporting..." : "Export"}
                    </Button>
                    <Button onClick={handleAddProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                                <p className="text-2xl font-bold">{totalItems}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                                <p className="text-2xl font-bold">{categories.length - 1}</p>
                            </div>
                            <Filter className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products or suppliers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-8"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSearch}
                                    className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={filterCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilterCategory(category)}
                                >
                                    {category === "all" ? "All" : category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-5 w-5" />
                            Low Stock Alert
                        </CardTitle>
                        <CardDescription className="text-red-600">
                            {lowStockItems.length} items are running low on stock
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {lowStockItems.map((item) => (
                                <Badge key={item.id} variant="destructive">
                                    {item.name} ({item.stock} left)
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Inventory List */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>
                        Showing {filteredInventory.length} of {inventory.length} products
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredInventory.map((item) => {
                            const status = getStockStatus(item);
                            const stockPercentage = (item.stock / item.maxStock) * 100;
                            
                            return (
                                <div key={item.id} className={`p-4 border rounded-lg ${getStockColor(status)}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white rounded-lg">
                                                <item.icon className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.category} • {item.supplier}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last updated: {item.lastUpdated}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Stock Level</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-24">
                                                        <Progress value={stockPercentage} className="h-2" />
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {item.stock}/{item.maxStock}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Price</p>
                                                <p className="text-lg font-bold">₹{item.price}</p>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Value</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-lg font-bold">₹{item.value}</p>
                                                    {item.trend === "up" ? (
                                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleViewProduct(item)}
                                                    className="hover:bg-blue-50 hover:border-blue-300"
                                                    title="View product details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleEditProduct(item)}
                                                    className="hover:bg-yellow-50 hover:border-yellow-300"
                                                    title="Edit product"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleAddStock(item)}
                                                    className="hover:bg-green-50 hover:border-green-300"
                                                    title="Add stock"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}