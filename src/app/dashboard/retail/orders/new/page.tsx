"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ShoppingCart,
    Package,
    Plus,
    Minus,
    ArrowLeft,
    Search,
    Calendar,
    Truck,
    DollarSign,
    CheckCircle,
    Building,
    Apple,
    Milk,
    Wheat,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
    const router = useRouter();
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [orderItems, setOrderItems] = useState([
        { id: 1, product: "", quantity: 1, unit: "kg", price: 0 }
    ]);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    const suppliers = [
        { id: "1", name: "Green Valley Farm", category: "Vegetables", rating: 4.8 },
        { id: "2", name: "Sunrise Dairy", category: "Dairy", rating: 4.9 },
        { id: "3", name: "Mountain Fruits", category: "Fruits", rating: 4.7 },
        { id: "4", name: "Golden Grains", category: "Cereals", rating: 4.6 }
    ];

    const products = [
        { name: "Fresh Tomatoes", category: "Vegetables", price: 80, supplier: "Green Valley Farm", icon: Apple },
        { name: "Organic Milk", category: "Dairy", price: 65, supplier: "Sunrise Dairy", icon: Milk },
        { name: "Wheat Flour", category: "Grains", price: 45, supplier: "Golden Grains", icon: Wheat },
        { name: "Fresh Apples", category: "Fruits", price: 120, supplier: "Mountain Fruits", icon: Apple }
    ];

    const addOrderItem = () => {
        setOrderItems([...orderItems, {
            id: orderItems.length + 1,
            product: "",
            quantity: 1,
            unit: "kg",
            price: 0
        }]);
    };

    const removeOrderItem = (id: number) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    const updateOrderItem = (id: number, field: string, value: any) => {
        setOrderItems(orderItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.quantity * item.price), 0);
    };

    const validateOrder = () => {
        if (!selectedSupplier) {
            alert("Please select a supplier");
            return false;
        }

        const validItems = orderItems.filter(item => item.product && item.quantity > 0 && item.price > 0);
        if (validItems.length === 0) {
            alert("Please add at least one valid item to your order");
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateOrder()) return;

        setIsPlacingOrder(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create order object
            const orderData = {
                supplierId: selectedSupplier,
                items: orderItems.filter(item => item.product && item.quantity > 0),
                total: calculateTotal(),
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            console.log("Order placed:", orderData);
            alert("Order placed successfully!");

            // Redirect to orders page
            router.push("/dashboard/retail/orders");

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create draft object
            const draftData = {
                supplierId: selectedSupplier,
                items: orderItems,
                total: calculateTotal(),
                status: 'draft',
                savedAt: new Date().toISOString()
            };

            console.log("Draft saved:", draftData);
            alert("Order saved as draft!");

        } catch (error) {
            console.error("Error saving draft:", error);
            alert("Failed to save draft. Please try again.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleQuickAddProduct = (product: typeof products[0]) => {
        // Check if product already exists in order items
        const existingItemIndex = orderItems.findIndex(item => item.product === product.name);
        
        if (existingItemIndex !== -1) {
            // If product exists, increase quantity
            updateOrderItem(orderItems[existingItemIndex].id, 'quantity', orderItems[existingItemIndex].quantity + 1);
        } else {
            // Find first empty item or add new item
            const emptyItemIndex = orderItems.findIndex(item => !item.product);
            
            if (emptyItemIndex !== -1) {
                // Fill empty item
                const emptyItem = orderItems[emptyItemIndex];
                updateOrderItem(emptyItem.id, 'product', product.name);
                updateOrderItem(emptyItem.id, 'price', product.price);
                updateOrderItem(emptyItem.id, 'quantity', 1);
                updateOrderItem(emptyItem.id, 'unit', product.category === 'Dairy' ? 'liter' : 'kg');
            } else {
                // Add new item
                const newItem = {
                    id: orderItems.length + 1,
                    product: product.name,
                    quantity: 1,
                    unit: product.category === 'Dairy' ? 'liter' : 'kg',
                    price: product.price
                };
                setOrderItems([...orderItems, newItem]);
            }
        }
        
        // Auto-select supplier if not already selected
        if (!selectedSupplier) {
            const supplierMatch = suppliers.find(s => s.name === product.supplier);
            if (supplierMatch) {
                setSelectedSupplier(supplierMatch.id);
            }
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
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Place New Order</h1>
                    <p className="text-muted-foreground">Create a new purchase order from suppliers</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Order Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Supplier Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier">Select Supplier</Label>
                                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier) => (
                                            <SelectItem key={supplier.id} value={supplier.id}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{supplier.name}</span>
                                                    <Badge variant="outline" className="ml-2">
                                                        ⭐ {supplier.rating}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="delivery-date">Delivery Date</Label>
                                    <Input type="date" id="delivery-date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orderItems.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="flex-1 grid grid-cols-4 gap-4">
                                        <Select
                                            value={item.product}
                                            onValueChange={(value) => updateOrderItem(item.id, 'product', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product, idx) => (
                                                    <SelectItem key={idx} value={product.name}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateOrderItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                className="w-20 text-center"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateOrderItem(item.id, 'quantity', item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <Select
                                            value={item.unit}
                                            onValueChange={(value) => updateOrderItem(item.id, 'unit', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kg">kg</SelectItem>
                                                <SelectItem value="liter">Liter</SelectItem>
                                                <SelectItem value="piece">Piece</SelectItem>
                                                <SelectItem value="box">Box</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            placeholder="Price per unit"
                                            value={item.price}
                                            onChange={(e) => updateOrderItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>

                                    {orderItems.length > 1 && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeOrderItem(item.id)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <Button variant="outline" onClick={addOrderItem} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes">Special Instructions</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any special delivery instructions or notes..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {orderItems.map((item) => (
                                    item.product && (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.product} ({item.quantity} {item.unit})</span>
                                            <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Total Amount</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Button
                                    className="w-full"
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder || calculateTotal() === 0}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSaveDraft}
                                    disabled={isSavingDraft}
                                >
                                    {isSavingDraft ? "Saving..." : "Save as Draft"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Add Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {products.slice(0, 4).map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <product.icon className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">₹{product.price}/{product.category === 'Dairy' ? 'L' : 'kg'}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleQuickAddProduct(product)}
                                            className="hover:bg-green-50 hover:border-green-300"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}