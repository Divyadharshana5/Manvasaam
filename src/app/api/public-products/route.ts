import { NextResponse } from "next/server";
import { isFirebaseInitialized } from "@/lib/firebase-admin";
import { getAllHubs, getHubInventory } from "@/lib/hub-db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const parsedLimit = parseInt(url.searchParams.get("limit") || "50", 10);
    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 500)
        : 50;

    if (!isFirebaseInitialized) {
      console.warn("Firebase not configured - serving mock public products");
    }

    // Get all active hubs
    const hubs = await getAllHubs();
    const activeHubs = hubs.filter((hub) => hub.status === "active");

    const allProducts: any[] = [];

    // Fetch inventory from each hub
    for (const hub of activeHubs) {
      try {
        const inventory = await getHubInventory(hub.id, false); // Only available items

        const hubProducts = inventory
          .filter((item) => item.status === "available")
          .map((item) => ({
            id: item.id,
            productName: item.productName,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit,
            quality: item.quality,
            farmerName: item.farmerName,
            hubId: hub.id,
            hubName: hub.branchName,
            hubLocation: hub.location,
            harvestDate: item.harvestDate,
            expiryDate: item.expiryDate,
          }));

        allProducts.push(...hubProducts);
      } catch (error) {
        console.error(`Error fetching inventory for hub ${hub.id}:`, error);
      }
    }

    // Filter by category if specified
    let filteredProducts = allProducts;
    if (category) {
      filteredProducts = allProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by creation date (newest first) and limit results
    filteredProducts.sort(
      (a, b) =>
        new Date(b.harvestDate || "").getTime() -
        new Date(a.harvestDate || "").getTime()
    );
    filteredProducts = filteredProducts.slice(0, limit);

    // Group by category for easier consumption
    const productsByCategory = filteredProducts.reduce((acc, product) => {
      const cat = product.category.toLowerCase();
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(product);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json(
      {
        products: filteredProducts,
        productsByCategory,
        totalCount: filteredProducts.length,
        categories: Object.keys(productsByCategory),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Public Products Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
