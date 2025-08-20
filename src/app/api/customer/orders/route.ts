import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { 
  createHubOrder, 
  reserveInventoryItems, 
  getInventoryItem,
  findNearestHubWithStock 
} from "@/lib/hub-db";
import { cookies } from "next/headers";
import { HubOrderItem } from "@/types/hub";

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

    const { 
      items, 
      deliveryAddress, 
      customerLocation,
      paymentMethod = "cash",
      notes 
    } = data;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Items array is required" },
        { status: 400 }
      );
    }

    if (!deliveryAddress) {
      return NextResponse.json(
        { message: "Delivery address is required" },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.inventoryId || !item.quantity) {
        return NextResponse.json(
          { message: "Each item must have inventoryId and quantity" },
          { status: 400 }
        );
      }
    }

    // Get customer profile (this would typically come from your user database)
    const customerName = `Customer-${decodedToken.uid.slice(0, 8)}`;
    const customerPhone = "9876543210"; // This should come from user profile

    // Verify inventory availability and calculate totals
    const orderItems: HubOrderItem[] = [];
    let subtotal = 0;
    let hubId = "";

    for (const item of items) {
      const inventoryItem = await getInventoryItem(item.inventoryId);
      if (!inventoryItem) {
        return NextResponse.json(
          { message: `Product not found: ${item.inventoryId}` },
          { status: 404 }
        );
      }

      if (inventoryItem.quantity < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${inventoryItem.productName}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      if (inventoryItem.status !== "available") {
        return NextResponse.json(
          { message: `Product ${inventoryItem.productName} is not available` },
          { status: 400 }
        );
      }

      // Ensure all items are from the same hub
      if (!hubId) {
        hubId = inventoryItem.hubId;
      } else if (hubId !== inventoryItem.hubId) {
        return NextResponse.json(
          { message: "All items must be from the same hub" },
          { status: 400 }
        );
      }

      const totalPrice = item.quantity * inventoryItem.pricePerUnit;
      subtotal += totalPrice;

      orderItems.push({
        productId: inventoryItem.productId,
        productName: inventoryItem.productName,
        quantity: item.quantity,
        unit: inventoryItem.unit,
        pricePerUnit: inventoryItem.pricePerUnit,
        totalPrice,
        inventoryId: inventoryItem.id,
        farmerId: inventoryItem.farmerId,
        farmerName: inventoryItem.farmerName,
      });
    }

    // Calculate delivery fee (simplified - could be based on distance, weight, etc.)
    const deliveryFee = 50; // Fixed delivery fee for now
    const totalAmount = subtotal + deliveryFee;

    // Create the order
    const orderId = await createHubOrder({
      hubId,
      customerId: decodedToken.uid,
      customerName,
      customerPhone,
      deliveryAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentStatus: "pending",
      paymentMethod,
      orderStatus: "pending",
      notes,
    });

    // Reserve inventory items
    try {
      await reserveInventoryItems(
        items.map((item: any) => ({
          inventoryId: item.inventoryId,
          quantity: item.quantity
        })),
        decodedToken.uid,
        orderId
      );

      // Update order status to confirmed
      // await updateHubOrder(orderId, { orderStatus: "confirmed" });

      return NextResponse.json({
        message: "Order placed successfully",
        orderId,
        hubId,
        totalAmount,
        estimatedDeliveryTime: "2-3 hours", // This could be calculated based on hub capacity
      }, { status: 201 });

    } catch (reservationError: any) {
      // If reservation fails, we might want to delete the order or mark it as failed
      return NextResponse.json(
        { message: "Failed to reserve items", error: reservationError.message },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
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
    
    // Get customer's orders across all hubs
    // This would require a different query structure in a real implementation
    // For now, returning empty array as placeholder
    const orders: any[] = [];

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Get Customer Orders Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
