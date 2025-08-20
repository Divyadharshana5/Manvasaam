import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHub, getInventoryItem, updateInventoryItem, deleteInventoryItem, updateInventoryQuantity } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { hubId: string; inventoryId: string } }
) {
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
    const { hubId, inventoryId } = params;

    const hub = await getHub(hubId);
    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this hub
    if (hub.managerId !== decodedToken.uid) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const inventoryItem = await getInventoryItem(inventoryId);
    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Verify the item belongs to this hub
    if (inventoryItem.hubId !== hubId) {
      return NextResponse.json(
        { message: "Inventory item does not belong to this hub" },
        { status: 403 }
      );
    }

    return NextResponse.json({ item: inventoryItem }, { status: 200 });
  } catch (error: any) {
    console.error("Get Inventory Item Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory item", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { hubId: string; inventoryId: string } }
) {
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
    const { hubId, inventoryId } = params;
    const updates = await request.json();

    const hub = await getHub(hubId);
    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this hub
    if (hub.managerId !== decodedToken.uid) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const inventoryItem = await getInventoryItem(inventoryId);
    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Verify the item belongs to this hub
    if (inventoryItem.hubId !== hubId) {
      return NextResponse.json(
        { message: "Inventory item does not belong to this hub" },
        { status: 403 }
      );
    }

    // Handle quantity updates separately to track stock movements
    if (updates.quantity !== undefined && updates.quantity !== inventoryItem.quantity) {
      await updateInventoryQuantity(
        inventoryId, 
        updates.quantity, 
        updates.reason || "Manual adjustment", 
        decodedToken.uid
      );
      delete updates.quantity; // Remove from general updates
    }

    // Filter allowed updates
    const allowedUpdates = {
      productName: updates.productName,
      category: updates.category,
      unit: updates.unit,
      pricePerUnit: updates.pricePerUnit,
      harvestDate: updates.harvestDate,
      expiryDate: updates.expiryDate,
      quality: updates.quality,
      status: updates.status,
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
        delete allowedUpdates[key as keyof typeof allowedUpdates];
      }
    });

    if (Object.keys(allowedUpdates).length > 0) {
      await updateInventoryItem(inventoryId, allowedUpdates);
    }

    return NextResponse.json(
      { message: "Inventory item updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Inventory Item Error:", error);
    return NextResponse.json(
      { message: "Failed to update inventory item", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { hubId: string; inventoryId: string } }
) {
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
    const { hubId, inventoryId } = params;

    const hub = await getHub(hubId);
    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this hub
    if (hub.managerId !== decodedToken.uid) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const inventoryItem = await getInventoryItem(inventoryId);
    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Verify the item belongs to this hub
    if (inventoryItem.hubId !== hubId) {
      return NextResponse.json(
        { message: "Inventory item does not belong to this hub" },
        { status: 403 }
      );
    }

    await deleteInventoryItem(inventoryId);

    return NextResponse.json(
      { message: "Inventory item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Inventory Item Error:", error);
    return NextResponse.json(
      { message: "Failed to delete inventory item", error: error.message },
      { status: 500 }
    );
  }
}
