"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  MapPin,
  Package,
  Truck,
  Clock,
  Star,
  Search
} from "lucide-react";
import { HubInventory, Hub } from "@/types/hub";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CartItem {
  inventoryId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  hubName: string;
  hubId: string;
  maxQuantity: number;
}

interface ProductBrowserProps {
  customerId: string;
}

export default function ProductBrowser({ customerId }: ProductBrowserProps) {
  const [products, setProducts] = useState<HubInventory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [customerLocation, setCustomerLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // This would fetch available products from all hubs
      // For now, using mock data
      setProducts([]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: HubInventory, hubName: string) => {
    const existingItem = cart.find(item => item.inventoryId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item => 
          item.inventoryId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Stock Limit",
          description: `Only ${product.quantity} ${product.unit} available`,
          variant: "destructive",
        });
      }
    } else {
      setCart([...cart, {
        inventoryId: product.id,
        productName: product.productName,
        quantity: 1,
        pricePerUnit: product.pricePerUnit,
        unit: product.unit,
        hubName,
        hubId: product.hubId,
        maxQuantity: product.quantity,
      }]);
    }
  };

  const updateCartQuantity = (inventoryId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.inventoryId !== inventoryId));
    } else {
      setCart(cart.map(item => 
        item.inventoryId === inventoryId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  };

  const checkAvailability = async () => {
    try {
      const items = cart.map(item => ({
        productName: item.productName,
        quantity: item.quantity
      }));

      const response = await fetch("/api/customer/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customerLocation
        }),
      });

      const result = await response.json();
      
      if (result.available) {
        return true;
      } else {
        toast({
          title: "Availability Issue",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive",
      });
      return false;
    }
  };

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter delivery address",
        variant: "destructive",
      });
      return;
    }

    // Check if all items are from the same hub
    const hubIds = [...new Set(cart.map(item => item.hubId))];
    if (hubIds.length > 1) {
      toast({
        title: "Multiple Hubs",
        description: "Please order from one hub at a time",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const items = cart.map(item => ({
        inventoryId: item.inventoryId,
        quantity: item.quantity
      }));

      const response = await fetch("/api/customer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          deliveryAddress,
          customerLocation,
          notes: orderNotes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      toast({
        title: "Order Placed Successfully",
        description: `Order #${result.orderId} has been placed. Total: ₹${result.totalAmount}`,
      });

      // Clear cart and close checkout
      setCart([]);
      setIsCheckoutOpen(false);
      setDeliveryAddress("");
      setOrderNotes("");

    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Products</CardTitle>
          <CardDescription>
            Fresh products from local farmers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Cart ({cart.length} items)</span>
              <Button onClick={() => setIsCheckoutOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Checkout - ₹{getCartTotal().toFixed(2)}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.inventoryId} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">{item.hubName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.inventoryId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.inventoryId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="ml-2 font-medium">
                      ₹{(item.quantity * item.pricePerUnit).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for fresh products from local farmers.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{product.productName}</span>
                  <Badge variant="secondary">{product.quality}</Badge>
                </CardTitle>
                <CardDescription>
                  From {product.farmerName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Available:</span>
                    <span>{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">₹{product.pricePerUnit}/{product.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Category:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expiry:</span>
                    <span>{new Date(product.expiryDate).toLocaleDateString()}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(product, "Hub Name")} // Hub name would come from API
                    disabled={product.quantity === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your order details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹50.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{(getCartTotal() + 50).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={placeOrder} disabled={isLoading}>
              {isLoading ? "Placing Order..." : "Place Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
