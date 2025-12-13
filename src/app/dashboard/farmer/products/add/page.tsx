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
    Sprout,
    Calendar,
    Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import HubSelector from "@/components/hub-selector";
import { Hub } from "@/types/hub";
import AppLayout from "@/components/app-layout";

export default function AddProductPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
        harvestDate: "",
        expiryDate: "",
        quality: "standard",
        description: "",
    });

    const categories = [
        "vegetables",
        "fruits", 
        "grains",
        "dairy",
        "herbs",
        "spices",
        "nuts",
        "other"
    ];

    const units = [
        { value: "kg", label: "Kilograms" },
        { value: "pieces", label: "Pieces" },
        { value: "liters", label: "Liters" },
        { value: "bags", label: "Bags" },
        { value: "boxes", label: "Boxes" }
    ];

    const qualities = [
        { value: "premium", label: "Premium" },
        { value: "standard", label: "Standard" },
        { value: "economy", label: "Economy" }
    ];

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedHub) {
            toast({
                title: "Hub Required",
                description: "Please select a hub before adding products",
                variant: "destructive",
            });
            return;
        }

        if (!formData.name || !formData.category || !formData.quantity || !formData.pricePerUnit) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields (name, category, quantity, and price)",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/farmer/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    quantity: parseFloat(formData.quantity),
                    unit: formData.unit,
                    pricePerUnit: parseFloat(formData.pricePerUnit),
                    harvestDate: formData.harvestDate,
                    expiryDate: formData.expiryDate,
                    quality: formData.quality,
                    description: formData.description,
                    hubId: selectedHub.id,
                    farmerId: user?.uid,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add product");
            }

            toast({
                title: "Product Added Successfully",
                description: `${formData.name} has been added to ${selectedHub.branchName}`,
            });
            
            // Navigate back to products page
            router.push("/dashboard/farmer/products");
            
        } catch (error: any) {
            console.error("Failed to add product:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to add product. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (Object.values(formData).some(value => value.trim() !== "")) {
            if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
                router.push("/dashboard/farmer/products");
            }
        } else {
            router.push("/dashboard/farmer/products");
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

    if (!user) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="ml-2">Loading...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
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
                    <p className="text-muted-foreground">Add your harvest to a hub for distribution</p>
                </motion.div>
            </motion.div>

            {/* Hub Selection */}
            <motion.div variants={itemVariants}>
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sprout className="h-5 w-5" />
                            Select Hub
                        </CardTitle>
                        <CardDescription>
                            Choose which hub to deliver your products to
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HubSelector
                            farmerId={user.uid}
                            onHubSelected={setSelectedHub}
                        />
                        {!selectedHub && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Please select a hub to continue
                            </p>
                        )}
                    </CardContent>
                </Card>
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
                                Basic details about your harvest
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
                                        placeholder="e.g., Tomatoes, Rice, Apples"
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
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger className="transition-all duration-300 focus:shadow-md">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>

                            <motion.div 
                                className="grid grid-cols-2 gap-4"
                                variants={containerVariants}
                            >
                                <motion.div 
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <Label htmlFor="quantity">Quantity *</Label>
                                    <motion.div variants={inputVariants} whileFocus="focus">
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="100"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            min="0"
                                            step="0.01"
                                            required
                                            className="transition-all duration-300 focus:shadow-md"
                                        />
                                    </motion.div>
                                </motion.div>
                                <motion.div 
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                        <SelectTrigger className="transition-all duration-300 focus:shadow-md">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="quality">Quality</Label>
                                <Select value={formData.quality} onValueChange={(value) => handleInputChange("quality", value)}>
                                    <SelectTrigger className="transition-all duration-300 focus:shadow-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {qualities.map((quality) => (
                                            <SelectItem key={quality.value} value={quality.value}>
                                                {quality.label}
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
                                        placeholder="Additional details about the product..."
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

                {/* Pricing and Dates */}
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
                                    <IndianRupee className="h-5 w-5" />
                                </motion.div>
                                Pricing & Dates
                            </CardTitle>
                            <CardDescription>
                                Set pricing and important dates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="pricePerUnit">Price per {formData.unit} (₹) *</Label>
                                <motion.div 
                                    className="relative"
                                    variants={inputVariants} 
                                    whileFocus="focus"
                                >
                                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="pricePerUnit"
                                        type="number"
                                        placeholder="50.00"
                                        value={formData.pricePerUnit}
                                        onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
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
                                <Label htmlFor="harvestDate">Harvest Date</Label>
                                <motion.div 
                                    className="relative"
                                    variants={inputVariants} 
                                    whileFocus="focus"
                                >
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="harvestDate"
                                        type="date"
                                        value={formData.harvestDate}
                                        onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                                        className="pl-10 transition-all duration-300 focus:shadow-md"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="space-y-2"
                                variants={itemVariants}
                            >
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <motion.div 
                                    className="relative"
                                    variants={inputVariants} 
                                    whileFocus="focus"
                                >
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="expiryDate"
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                        className="pl-10 transition-all duration-300 focus:shadow-md"
                                    />
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
                                        • Total value: ₹{formData.quantity && formData.pricePerUnit ? (parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit)).toFixed(2) : '0.00'}
                                    </motion.p>
                                    <motion.p variants={itemVariants} whileHover={{ x: 5 }}>
                                        • Hub: {selectedHub?.branchName || 'Please select a hub'}
                                    </motion.p>
                                    <motion.p variants={itemVariants} whileHover={{ x: 5 }}>
                                        • Quality: {formData.quality.charAt(0).toUpperCase() + formData.quality.slice(1)}
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
            <motion.div
                variants={cardVariants}
                whileHover="hover"
            >
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="p-4">
                        <motion.div 
                            className="flex justify-end gap-4"
                            variants={containerVariants}
                        >
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="transition-all duration-300 hover:shadow-sm"
                                >
                                    Cancel
                                </Button>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !selectedHub}
                                    className="min-w-[120px] transition-all duration-300 hover:shadow-sm"
                                >
                                    <AnimatePresence mode="wait">
                                        {isSubmitting ? (
                                            <motion.div
                                                key="submitting"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center"
                                            >
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Adding...
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center"
                                            >
                                                <motion.div
                                                    animate={{ rotate: [0, 15, -15, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                </motion.div>
                                                Add Product
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
        </AppLayout>
    );
}