"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Apple, Wheat, Sprout, Package, Loader2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  quality: string;
  farmerName: string;
  hubId: string;
}

interface ProductShowcaseProps {
  maxItemsPerCategory?: number;
  showAllCategories?: boolean;
}

export default function ProductShowcase({ 
  maxItemsPerCategory = 3, 
  showAllCategories = true 
}: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      // Fetch products from public API
      const response = await fetch('/api/public-products?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Set empty array on error to show "no products" message
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .slice(0, maxItemsPerCategory);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vegetables':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'fruits':
        return <Apple className="h-5 w-5 text-orange-600" />;
      case 'grains':
        return <Wheat className="h-5 w-5 text-amber-600" />;
      case 'herbs':
        return <Sprout className="h-5 w-5 text-emerald-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vegetables':
        return 'border-green-200 bg-green-50';
      case 'fruits':
        return 'border-orange-200 bg-orange-50';
      case 'grains':
        return 'border-amber-200 bg-amber-50';
      case 'herbs':
        return 'border-emerald-200 bg-emerald-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const categories = ['vegetables', 'fruits', 'grains', 'herbs'];

  if (isLoading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Fresh Products Available</h2>
        <p className="text-muted-foreground">
          Discover fresh, quality products directly from our farmers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category);
          const totalCount = products.filter(p => p.category.toLowerCase() === category.toLowerCase()).length;
          
          return (
            <Card key={category} className={`${getCategoryColor(category)} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <CardTitle className="text-lg capitalize">{category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {totalCount}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {totalCount > 0 ? 'Available now' : 'Coming soon'}
                </p>
                
                <div className="space-y-2 mb-4">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="bg-white/80 rounded-lg p-2 text-xs">
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-gray-600">
                        {product.quantity}{product.unit} @ ₹{product.pricePerUnit}/{product.unit}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.quality}
                        </Badge>
                        <span className="text-gray-500">by {product.farmerName}</span>
                      </div>
                    </div>
                  ))}
                  {totalCount > maxItemsPerCategory && (
                    <div className="text-xs text-gray-500 text-center">
                      +{totalCount - maxItemsPerCategory} more available
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/products?category=${category}`}>
                    Browse {category}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button asChild>
          <Link href="/dashboard/products">
            <Package className="mr-2 h-4 w-4" />
            View All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}