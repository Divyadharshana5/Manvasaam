"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Building,
    Phone,
    Mail,
    MapPin,
    Star,
    ArrowLeft,
    Search,
    Plus,
    MessageCircle,
    Calendar,
    Package,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SuppliersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [messageDialog, setMessageDialog] = useState(false);

    const suppliers = [
        { 
            id: 1,
            name: "Green Valley Farm", 
            category: "Vegetables", 
            rating: 4.8, 
            orders: 23,
            lastDelivery: "2024-01-15",
            status: "active",
            phone: "+91 98765 43210",
            email: "contact@greenvalley.com",
            address: "Green Valley, Rural District, State",
            products: ["Tomatoes", "Carrots", "Spinach", "Onions"],
            totalValue: 45000,
            onTimeDelivery: 96,
            qualityRating: 4.9,
            responseTime: "2 hours"
        },
        { 
            id: 2,
            name: "Sunrise Dairy", 
            category: "Dairy", 
            rating: 4.9, 
            orders: 18,
            lastDelivery: "2024-01-14",
            status: "active",
            phone: "+91 98765 43211",
            email: "orders@sunrisedairy.com",
            address: "Dairy Farm Road, Milk District, State",
            products: ["Organic Milk", "Cheese", "Butter", "Yogurt"],
            totalValue: 32000,
            onTimeDelivery: 98,
            qualityRating: 4.8,
            responseTime: "1 hour"
        },
        { 
            id: 3,
            name: "Mountain Fruits", 
            category: "Fruits", 
            rating: 4.7, 
            orders: 15,
            lastDelivery: "2024-01-13",
            status: "active",
            phone: "+91 98765 43212",
            email: "sales@mountainfruits.com",
            address: "Mountain View, Fruit Valley, State",
            products: ["Apples", "Oranges", "Bananas", "Grapes"],
            totalValue: 28000,
            onTimeDelivery: 94,
            qualityRating: 4.6,
            responseTime: "3 hours"
        },
        { 
            id: 4,
            name: "Golden Grains", 
            category: "Cereals", 
            rating: 4.6, 
            orders: 12,
            lastDelivery: "2024-01-12",
            status: "pending",
            phone: "+91 98765 43213",
            email: "info@goldengrains.com",
            address: "Grain Market, Agricultural Zone, State",
            products: ["Wheat Flour", "Rice", "Barley", "Oats"],
            totalValue: 22000,
            onTimeDelivery: 92,
            qualityRating: 4.5,
            responseTime: "4 hours"
        }
    ];

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactSupplier = (supplier: any) => {
        setSelectedSupplier(supplier);
        setMessageDialog(true);
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
                    <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
                    <p className="text-muted-foreground">Manage your supplier relationships and communications</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Supplier
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                                <p className="text-2xl font-bold">{suppliers.length}</p>
                            </div>
                            <Building className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Suppliers</p>
                                <p className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                                <p className="text-2xl font-bold">4.7</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{suppliers.reduce((sum, s) => sum + s.orders, 0)}</p>
                            </div>
                            <Package className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search suppliers by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Suppliers Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {filteredSuppliers.map((supplier) => (
                    <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        {supplier.name}
                                    </CardTitle>
                                    <CardDescription>{supplier.category}</CardDescription>
                                </div>
                                <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                                    {supplier.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Contact Info */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{supplier.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{supplier.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{supplier.address}</span>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{supplier.rating}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Rating</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">{supplier.onTimeDelivery}%</p>
                                    <p className="text-xs text-muted-foreground">On-time</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">{supplier.orders}</p>
                                    <p className="text-xs text-muted-foreground">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">₹{(supplier.totalValue / 1000).toFixed(0)}K</p>
                                    <p className="text-xs text-muted-foreground">Total Value</p>
                                </div>
                            </div>

                            {/* Products */}
                            <div>
                                <p className="text-sm font-medium mb-2">Products:</p>
                                <div className="flex flex-wrap gap-1">
                                    {supplier.products.slice(0, 3).map((product, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {product}
                                        </Badge>
                                    ))}
                                    {supplier.products.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{supplier.products.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Last Delivery */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Last delivery: {supplier.lastDelivery}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleContactSupplier(supplier)}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Contact
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Package className="h-4 w-4 mr-2" />
                                    Order
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Contact Supplier Dialog */}
            <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Contact {selectedSupplier?.name}</DialogTitle>
                        <DialogDescription>
                            Send a message to your supplier about orders, delivery, or general inquiries.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., Inquiry about fresh vegetables" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea 
                                id="message" 
                                placeholder={`Hi ${selectedSupplier?.name}, I would like to inquire about...`}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <select className="w-full p-2 border rounded-md">
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setMessageDialog(false)} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}