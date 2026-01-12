import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { addInventoryItem, getFarmerHub, getHubInventory } from "@/lib/hub-db";
import { cookies } from "next/headers";
import { readCookie } from "@/lib/read-cookie";

export async function POST(request: Request) {
  try {
    if (!isFirebaseInitialized) {
      // Mock mode - simulate successful product addition
      const data = await request.json();
      return NextResponse.json(
        {
          message: "Product added successfully",
          inventoryId: "mock-inventory-" + Date.now(),
          batchId: "BATCH-" + Date.now(),
        },
        { status: 201 }
      );
    }

    const sessionCookie = await readCookie("session");

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "quantity", "pricePerUnit", "hubId"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Verify farmer is assigned to the specified hub
    const farmerHub = await getFarmerHub(decodedToken.uid);
    if (!farmerHub || farmerHub.id !== data.hubId) {
      return NextResponse.json(
        { message: "You are not assigned to this hub" },
        { status: 403 }
      );
    }

    // Generate batch ID
    const batchId = `BATCH-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Get farmer name (this would typically come from user profile)
    const farmerName = `Farmer-${decodedToken.uid.slice(0, 8)}`;

    // Add product to hub inventory
    const inventoryId = await addInventoryItem({
      hubId: data.hubId,
      productName: data.name,
      category: data.category || "uncategorized",
      quantity: data.quantity,
      unit: data.unit || "kg",
      pricePerUnit: data.pricePerUnit,
      farmerId: decodedToken.uid,
      farmerName,
      harvestDate: data.harvestDate || new Date().toISOString().split("T")[0],
      expiryDate:
        data.expiryDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // Default 7 days
      quality: data.quality || "standard",
      batchId,
    });

    return NextResponse.json(
      {
        message: "Product added successfully",
        inventoryId,
        batchId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add Product Error:", error);
    return NextResponse.json(
      { message: "Failed to add product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!isFirebaseInitialized) {
      // Return mock products when Firebase is not configured
      const mockProducts = [
        {
          id: "prod1",
          productName: "Organic Tomatoes",
          category: "vegetables",
          quantity: 25,
          unit: "kg",
          pricePerUnit: 80,
          status: "available",
          hubId: "hub1",
          createdAt: new Date().toISOString(),
          harvestDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          quality: "premium",
          batchId: "BATCH-001",
        },
        {
          id: "prod2",
          productName: "Fresh Spinach",
          category: "vegetables",
          quantity: 15,
          unit: "kg",
          pricePerUnit: 60,
          status: "available",
          hubId: "hub1",
          createdAt: new Date().toISOString(),
          harvestDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          quality: "standard",
          batchId: "BATCH-002",
        },
      ];

      const mockHub = {
        id: "hub1",
        branchName: "Green Valley Hub",
        location: "Bangalore North",
      };

      return NextResponse.json(
        { products: mockProducts, hub: mockHub },
        { status: 200 }
      );
    }

    const sessionCookie = await readCookie("session");

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    const farmerHub = await getFarmerHub(decodedToken.uid);
    if (!farmerHub) {
      return NextResponse.json(
        { message: "No hub assigned", products: [] },
        { status: 200 }
      );
    }

    const { getHubInventory } = await import("@/lib/hub-db");
    const hubInventory = await getHubInventory(farmerHub.id);

    const products = hubInventory
      .filter((item) => item.farmerId === decodedToken.uid)
      .map((item) => ({
        id: item.id,
        productName: item.productName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit,
        status: item.status,
        hubId: item.hubId,
        createdAt: item.createdAt,
        harvestDate: item.harvestDate,
        expiryDate: item.expiryDate,
        quality: item.quality,
        batchId: item.batchId,
      }));

    return NextResponse.json({ products, hub: farmerHub }, { status: 200 });
  } catch (error: any) {
    console.error("Get Farmer Products Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
