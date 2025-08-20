import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { addInventoryItem, getFarmerHub } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    if (!isFirebaseInitialized || !adminAuth) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'quantity', 'pricePerUnit', 'hubId'];
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
    const batchId = `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

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
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days
      quality: data.quality || "standard",
      batchId,
    });

    return NextResponse.json(
      { 
        message: "Product added successfully",
        inventoryId,
        batchId
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
    if (!isFirebaseInitialized || !adminAuth) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Get farmer's hub
    const farmerHub = await getFarmerHub(decodedToken.uid);
    if (!farmerHub) {
      return NextResponse.json(
        { message: "No hub assigned", products: [] },
        { status: 200 }
      );
    }

    // Get farmer's products from hub inventory
    // This would typically query the hubInventory collection filtered by farmerId
    // For now, returning empty array as placeholder
    const products: any[] = [];

    return NextResponse.json(
      { products, hub: farmerHub },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Farmer Products Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
