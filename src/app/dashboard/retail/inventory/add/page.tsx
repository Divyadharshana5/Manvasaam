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
    IndianRupee,
    Warehouse,
    Tag,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    const inputVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div 
                className="flex items-center gap-4"
                variants={itemVariants}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button variant="outline" size="icon" onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </motion.div>
                <motion.div 
                    className="flex-1"
                    variants={itemVariants}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                    <p className="text-muted-foreground">Add a new product to your inventory</p>
                </motion.div>
            </motion.div>

            <motion.div 
                className="grid gap-6 md:grid-cols-2"
                variants={itemVariants}
            >
                {/* Product Information */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <Card className="transition-shadow duration-300 hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                                >
                                    <Package className="h-5 w-5" />
                                </motion.div>
                                Product Information
                            </CardTitle>
                            <CardDescription>
                                Basic details about the product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="name">Product Name *</Label>
                                <motion.div variants={inputVariants} whileFocus="focus">
                                    <Input
                                        id="name"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        className="transition-all duration-300 focus:shadow-md"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="sku">SKU</Label>
                                <motion.div variants={inputVariants} whileFocus="focus">
                                    <Input
                                        id="sku"
                                        placeholder="Product SKU (optional)"
                                        value={formData.sku}
                                        onChange={(e) => handleInputChange("sku", e.target.value)}
                                        className="transition-all duration-300 focus:shadow-md"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger className="transition-all duration-300 focus:shadow-md">
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
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="supplier">Supplier</Label>
                                <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                                    <SelectTrigger className="transition-all duration-300 focus:shadow-md">
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
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="description">Description</Label>
                                <motion.div variants={inputVariants} whileFocus="focus">
                                    <Textarea
                                        id="description"
                                        placeholder="Product description (optional)"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={3}
                                        className="transition-all duration-300 focus:shadow-md resize-none"
                                    />
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pricing and Inventory */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <Card className="transition-shadow duration-300 hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Warehouse className="h-5 w-5" />
                                </motion.div>
                                Pricing & Inventory
                            </CardTitle>
                            <CardDescription>
                                Set pricing and stock levels
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="price">Price (₹) *</Label>
                                <motion.div 
                                    className="relative"
                                    variants={inputVariants} 
                                    whileFocus="focus"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                    </motion.div>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        className="pl-10 transition-all duration-300 focus:shadow-md"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="currentStock">Current Stock *</Label>
                                <motion.div variants={inputVariants} whileFocus="focus">
                                    <Input
                                        id="currentStock"
                                        type="number"
                                        placeholder="Enter current stock quantity"
                                        value={formData.currentStock}
                                        onChange={(e) => handleInputChange("currentStock", e.target.value)}
                                        min="0"
                                        required
                                        className="transition-all duration-300 focus:shadow-md"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="grid grid-cols-2 gap-4"
                                variants={containerVariants}
                            >
                                <motion.div 
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <Label htmlFor="minStock">Minimum Stock</Label>
                                    <motion.div variants={inputVariants} whileFocus="focus">
                                        <Input
                                            id="minStock"
                                            type="number"
                                            placeholder="Min stock level"
                                            value={formData.minStock}
                                            onChange={(e) => handleInputChange("minStock", e.target.value)}
                                            min="0"
                                            className="transition-all duration-300 focus:shadow-md"
                                        />
                                    </motion.div>
                                </motion.div>
                                <motion.div 
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <Label htmlFor="maxStock">Maximum Stock</Label>
                                    <motion.div variants={inputVariants} whileFocus="focus">
                                        <Input
                                            id="maxStock"
                                            type="number"
                                            placeholder="Max stock level"
                                            value={formData.maxStock}
                                            onChange={(e) => handleInputChange("maxStock", e.target.value)}
                                            min="0"
                                            className="transition-all duration-300 focus:shadow-md"
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="pt-4 border-t"
                                variants={itemVariants}
                            >
                                <motion.div 
                                    className="text-sm text-muted-foreground space-y-1"
                                    variants={containerVariants}
                                >
                                    <motion.p variants={itemVariants} whileHover={{ x: 5 }}>
                                        • Minimum stock: Alert level for low inventory
                                    </motion.p>
                                    <motion.p variants={itemVariants} whileHover={{ x: 5 }}>
                                        • Maximum stock: Recommended maximum inventory level
                                    </motion.p>
                                    <motion.p variants={itemVariants} whileHover={{ x: 5 }}>
                                        • Fields marked with * are required
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

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