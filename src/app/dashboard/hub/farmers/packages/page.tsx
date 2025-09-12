"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Phone, ArrowLeft, Package, ShoppingCart, Filter, Send } from "lucide-react";

function PackagesInner() {
  const params = useSearchParams();
  const name = params.get("with") || "Selected Farmer";
  const [search, setSearch] = useState("");

  // Mock packages for demo purposes
  const packages = useMemo(
    () => [
      { id: "PKG-VEG-01", title: "Leafy Greens Pack", items: ["Spinach 5kg", "Coriander 1kg", "Mint 1kg"], price: 1250, available: true },
      { id: "PKG-VEG-02", title: "Root Vegetables Pack", items: ["Carrot 10kg", "Beetroot 5kg", "Radish 5kg"], price: 2100, available: true },
      { id: "PKG-FR-01", title: "Seasonal Fruits Pack", items: ["Mango 8kg", "Banana 6kg", "Papaya 3kg"], price: 2650, available: false },
    ],
    []
  );

  const filtered = packages.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.items.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/hub/farmers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Packages from {name}</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Browse ready-to-order bundles and contact the farmer</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Predefined Packages
          </CardTitle>
          <CardDescription>Curated bundles for fast procurement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search packages or items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{pkg.title}</CardTitle>
                      <CardDescription className="text-xs">ID: {pkg.id}</CardDescription>
                    </div>
                    <Badge variant={pkg.available ? "default" : "secondary"} className="text-[10px]">
                      {pkg.available ? "Available" : "Out of stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <ul className="text-xs list-disc pl-5 space-y-1">
                    {pkg.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold">₹{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      <Button size="sm" className="w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href={`/dashboard/contact?mode=chat&with=${encodeURIComponent(name)}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Ask Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Contact</CardTitle>
          <CardDescription>Reach the farmer for custom bundles</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button asChild className="w-full">
            <Link href={`/dashboard/contact?mode=chat&with=${encodeURIComponent(name)}`}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Open Chat
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/contact?mode=call&with=${encodeURIComponent(name)}`}>
              <Phone className="h-4 w-4 mr-2" />
              Start Call
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PackagesInner />
    </Suspense>
  );
}
