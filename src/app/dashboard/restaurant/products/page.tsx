"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ShoppingCart,
  Leaf,
  Apple,
  Milk,
  Wheat,
  Star,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const products = [
  {
    id: "1",
    name: "Organic Tomatoes",
    category: "vegetables",
    farmer: "Green Valley Farm",
    location: "Karnataka",
    price: "₹90/kg",
    stock: "150kg",
    rating: 4.8,
    organic: true,
    seasonal: true,
    image: "/api/placeholder/150/150",
  },
  {
    id: "2",
    name: "Fresh Spinach",
    category: "vegetables",
    farmer: "Sunrise Organics",
    location: "Tamil Nadu",
    price: "₹60/kg",
    stock: "80kg",
    rating: 4.6,
    organic: true,
    seasonal: false,
    image: "/api/placeholder/150/150",
  },
  {
    id: "3",
    name: "Organic Apples",
    category: "fruits",
    farmer: "Hill Station Farms",
    location: "Himachal Pradesh",
    price: "₹180/kg",
    stock: "200kg",
    rating: 4.9,
    organic: true,
    seasonal: true,
    image: "/api/placeholder/150/150",
  },
  {
    id: "4",
    name: "Farm Fresh Milk",
    category: "dairy",
    farmer: "Happy Cow Dairy",
    location: "Punjab",
    price: "₹65/L",
    stock: "500L",
    rating: 4.7,
    organic: true,
    seasonal: false,
    image: "/api/placeholder/150/150",
  },
  {
    id: "5",
    name: "Finger Millet",
    category: "millets",
    farmer: "Millet Masters",
    location: "Andhra Pradesh",
    price: "₹120/kg",
    stock: "100kg",
    rating: 4.5,
    organic: true,
    seasonal: false,
    image: "/api/placeholder/150/150",
  },
  {
    id: "6",
    name: "Organic Carrots",
    category: "vegetables",
    farmer: "Root Vegetable Co.",
    location: "Maharashtra",
    price: "₹70/kg",
    stock: "120kg",
    rating: 4.4,
    organic: true,
    seasonal: false,
    image: "/api/placeholder/150/150",
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "vegetables":
      return <Leaf className="h-4 w-4 text-green-600" />;
    case "fruits":
      return <Apple className="h-4 w-4 text-orange-600" />;
    case "dairy":
      return <Milk className="h-4 w-4 text-blue-600" />;
    case "millets":
      return <Wheat className="h-4 w-4 text-amber-600" />;
    default:
      return <Leaf className="h-4 w-4 text-gray-600" />;
  }
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const handleOrderClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsOrderDialogOpen(true);
  };

  const handlePlaceOrder = () => {
    // Add order logic here
    alert(`Order placed for ${selectedProduct?.name}!`);
    setIsOrderDialogOpen(false);
  };


  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, ""));
        case "rating":
          return b.rating - a.rating;
        case "stock":
          return parseInt(b.stock.replace(/[^\d]/g, "")) - parseInt(a.stock.replace(/[^\d]/g, ""));
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoryStats = {
    all: products.length,
    vegetables: products.filter(p => p.category === "vegetables").length,
    fruits: products.filter(p => p.category === "fruits").length,
    dairy: products.filter(p => p.category === "dairy").length,
    millets: products.filter(p => p.category === "millets").length,
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Browse organic products from your contract farmers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="cursor-pointer" onClick={() => setActiveCategory("all")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">All Products</p>
              <p className="text-2xl font-bold">{categoryStats.all}</p>
            </div>
            <Filter className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setActiveCategory("vegetables")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Vegetables</p>
              <p className="text-2xl font-bold text-green-600">{categoryStats.vegetables}</p>
            </div>
            <Leaf className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setActiveCategory("fruits")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Fruits</p>
              <p className="text-2xl font-bold text-orange-600">{categoryStats.fruits}</p>
            </div>
            <Apple className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setActiveCategory("dairy")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Dairy</p>
              <p className="text-2xl font-bold text-blue-600">{categoryStats.dairy}</p>
            </div>
            <Milk className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setActiveCategory("millets")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Millets</p>
              <p className="text-2xl font-bold text-amber-600">{categoryStats.millets}</p>
            </div>
            <Wheat className="h-8 w-8 text-amber-600" />
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="aspect-square bg-muted relative">
              <div className="absolute top-2 left-2 flex gap-1">
                {product.organic && (
                  <Badge className="bg-green-100 text-green-800 font-medium">Organic</Badge>
                )}
                {product.seasonal && (
                  <Badge className="bg-orange-100 text-orange-800 font-medium">Seasonal</Badge>
                )}
              </div>
              <div className="absolute top-2 right-2">
                {getCategoryIcon(product.category)}
              </div>
            </div>
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex-1 space-y-3 min-h-0">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{product.farmer}, {product.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xl font-bold text-green-600">{product.price}</p>
                  <p className="text-sm text-muted-foreground">Available: {product.stock}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button 
                  className="w-full h-12 font-semibold text-base bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0 rounded-lg" 
                  onClick={() => handleOrderClick(product)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or category filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Order {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Place a bulk order for organic {selectedProduct?.name} from {selectedProduct?.farmer}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Farmer</p>
                  <p className="font-medium">{selectedProduct.farmer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedProduct.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="font-medium text-primary">{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="font-medium">{selectedProduct.stock}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity Required *</label>
                  <Input 
                    placeholder="e.g., 50kg for weekly supply" 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Delivery Date *</label>
                  <Input type="date" className="h-10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Requirements</label>
                  <Input 
                    placeholder="e.g., specific packaging, delivery time..." 
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 h-11" onClick={handlePlaceOrder}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
                <Button variant="outline" className="h-11">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Farmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}