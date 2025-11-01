"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeft,
    Save,
    Package,
    DollarSign,
    Warehouse,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        minStock: "",
        maxStock: "",
        currentStock: "",
        supplier: "",
        description: "",
        sku: "",
    });

    const categories = [
        "Vegetables",
        "Fruits", 
        "Dairy",
        "Grains",
        "Meat",
        "Beverages",
        "Snacks",
        "Other"
    ];

    const suppliers = [
        "Green Valley Farm",
        "Sunrise Dairy",
        "Golden Grains",
        "Mountain Fruits",
        "Fresh Foods Co.",
        "Organic Suppliers Ltd.",
        "Local Market",
        "Other"
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.category || !formData.price || !formData.currentStock) {
                alert("Please fill in all required fields");
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, this would make an API call to save the product
            console.log("Adding new product:", formData);
            
            alert(`Product "${formData.name}" added successfully!`);
            
            // Navigate back to inventory page
            router.push("/dashboard/retail/inventory");
            
        } catch (error) {
            console.error("Failed to add product:", error);
            alert("Failed to add product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (Object.values(formData).some(value => value.trim() !== "")) {
            if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
                router.push("/dashboard/retail/inventory");
            }
        } else {
            router.push("/dashboard/retail/inventory");
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleCancel}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                    <p className="text-muted-foreground">Add a new product to your inventory</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Information
                        </CardTitle>
                        <CardDescription>
                            Basic details about the product
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                placeholder="Product SKU (optional)"
                                value={formData.sku}
                                onChange={(e) => handleInputChange("sku", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier} value={supplier}>
                                            {supplier}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Product description (optional)"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing and Inventory */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Warehouse className="h-5 w-5" />
                            Pricing & Inventory
                        </CardTitle>
                        <CardDescription>
                            Set pricing and stock levels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    className="pl-10"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentStock">Current Stock *</Label>
                            <Input
                                id="currentStock"
                                type="number"
                                placeholder="Enter current stock quantity"
                                value={formData.currentStock}
                                onChange={(e) => handleInputChange("currentStock", e.target.value)}
                                min="0"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minStock">Minimum Stock</Label>
                                <Input
                                    id="minStock"
                                    type="number"
                                    placeholder="Min stock level"
                                    value={formData.minStock}
                                    onChange={(e) => handleInputChange("minStock", e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxStock">Maximum Stock</Label>
                                <Input
                                    id="maxStock"
                                    type="number"
                                    placeholder="Max stock level"
                                    value={formData.maxStock}
                                    onChange={(e) => handleInputChange("maxStock", e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>• Minimum stock: Alert level for low inventory</p>
                                <p>• Maximum stock: Recommended maximum inventory level</p>
                                <p>• Fields marked with * are required</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex justify-end gap-4">
                        <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Add Product
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}