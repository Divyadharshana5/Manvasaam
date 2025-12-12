"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams, useRouter } from "next/navigation";
import "@/styles/farmer-animations.css";
import AppLayout from "@/components/app-layout";
import HubSelector from "@/components/hub-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Package,
  Truck,
  Calendar,
  IndianRupee,
  Weight,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Hub } from "@/types/hub";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: string;
  expiryDate: string;
  quality: string;
  hubId: string;
  hubName: string;
  status: string;
  createdAt: string;
}

function FarmerProductsContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const action = searchParams.get("action");
  const hubIdParam = searchParams.get("hubId");

  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: categoryFilter || "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    harvestDate: "",
    expiryDate: "",
    quality: "standard",
    description: "",
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  // Redirect to add page if action=add is in URL
  useEffect(() => {
    if (action === "add") {
      router.push('/dashboard/farmer/products/add');
    }
  }, [action, router]);

  // Update form category when URL parameter changes
  useEffect(() => {
    if (categoryFilter) {
      setFormData((prev) => ({ ...prev, category: categoryFilter }));
    }
  }, [categoryFilter]);

  // Scroll to form when it opens
  useEffect(() => {
    if (showAddForm) {
      setTimeout(() => {
        const formElement = document.getElementById("add-product-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [showAddForm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/farmer/products");
      if (response.ok) {
        const data = await response.json();
        const fetchedProducts = data.products || [];

        // Transform the products to match the expected format
        const transformedProducts = fetchedProducts.map((p: any) => ({
          id: p.id,
          name: p.productName || p.name,
          category: p.category,
          quantity: p.quantity,
          unit: p.unit,
          pricePerUnit: p.pricePerUnit,
          harvestDate: p.harvestDate || "",
          expiryDate: p.expiryDate || "",
          quality: p.quality || "standard",
          hubId: p.hubId,
          hubName: data.hub?.branchName || "Unknown Hub",
          status: p.status || "available",
          createdAt: p.createdAt || new Date().toISOString(),
        }));

        setProducts(transformedProducts);
      } else {
        console.error("Failed to fetch products");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.pricePerUnit
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields (name, category, quantity, and price)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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

      // Reset form but preserve category filter
      setFormData({
        name: "",
        category: categoryFilter || "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
        harvestDate: "",
        expiryDate: "",
        quality: "standard",
        description: "",
      });
      setShowAddForm(false);

      // Refresh products list
      await fetchProducts();

      // Refresh the parent dashboard if we're in an iframe or similar context
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: "PRODUCT_ADDED", product: result },
          "*"
        );
      }
    } catch (error: any) {
      console.error("Product submission error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p>Please log in to access this page.</p>
        </div>
      </AppLayout>
    );
  }

  // Filter products based on category
  const filteredProducts = categoryFilter
    ? products.filter(
        (product) =>
          product.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    : products;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 page-transition">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              My Products
              {categoryFilter && (
                <span className="text-2xl font-normal text-muted-foreground ml-2 capitalize">
                  - {categoryFilter}
                </span>
              )}
            </h2>
            <p className="text-muted-foreground">
              Manage your harvest and deliveries to hubs
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={() => router.push('/dashboard/farmer/products/add')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Hub Selection */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up stagger-1">
          <div className="md:col-span-2">
            <HubSelector
              farmerId={user.uid}
              onHubSelected={setSelectedHub}
              preselectedHubId={hubIdParam}
            />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {categoryFilter
                    ? `${categoryFilter} Products`
                    : "Total Products"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredProducts.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {categoryFilter ? `In ${categoryFilter}` : "In inventory"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Deliveries
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    filteredProducts.filter((p) => p.status === "pending")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Awaiting pickup</p>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Products List */}
        <Card className="animate-fade-in-up stagger-2 card-glow">
          <CardHeader>
            <CardTitle>
              Your Products
              {categoryFilter && (
                <span className="ml-2 text-sm font-normal text-muted-foreground capitalize">
                  - {categoryFilter}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {categoryFilter
                ? `Showing ${categoryFilter} products you've added to hubs`
                : "Products you've added to hubs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {products.length === 0
                    ? "No products yet"
                    : `No ${categoryFilter} products found`}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedHub
                    ? products.length === 0
                      ? "Start by adding your first product to the hub."
                      : `You haven't added any ${categoryFilter} products yet.`
                    : "Please select a hub first, then add your products."}
                </p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/dashboard/farmer/products/add')}>
                    <Plus className="mr-2 h-4 w-4" />
                    {products.length === 0
                      ? "Add Your First Product"
                      : `Add ${categoryFilter} Product`}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className={`border rounded-lg p-4 list-item animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.quantity} {product.unit} @ ₹
                          {product.pricePerUnit}/{product.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹
                          {(product.quantity * product.pricePerUnit).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.hubName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function FarmerProductsPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </AppLayout>
      }
    >
      <FarmerProductsContent />
    </Suspense>
  );
}
