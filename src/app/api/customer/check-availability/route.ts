import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { checkProductAvailability, findNearestHubWithStock } from "@/lib/hub-db";
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

    const { items, customerLocation } = data;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Items array is required" },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.productName || !item.quantity) {
        return NextResponse.json(
          { message: "Each item must have productName and quantity" },
          { status: 400 }
        );
      }
    }

    let result;

    if (customerLocation && customerLocation.latitude && customerLocation.longitude) {
      // Find nearest hub with all required items
      result = await findNearestHubWithStock(customerLocation, items);
      
      if (result) {
        return NextResponse.json({
          available: true,
          hub: result.hub,
          availableItems: result.availableItems,
          message: `Found ${result.availableItems.length} items at ${result.hub.branchName}`
        }, { status: 200 });
      } else {
        // Check individual product availability across all hubs
        const availabilityChecks = await Promise.all(
          items.map(item => 
            checkProductAvailability(item.productName, item.quantity, customerLocation)
          )
        );

        const alternativeOptions = availabilityChecks.map((options, index) => ({
          productName: items[index].productName,
          requestedQuantity: items[index].quantity,
          availableOptions: options
        }));

        return NextResponse.json({
          available: false,
          message: "No single hub has all requested items",
          alternativeOptions
        }, { status: 200 });
      }
    } else {
      // Check availability without location preference
      const availabilityChecks = await Promise.all(
        items.map(item => 
          checkProductAvailability(item.productName, item.quantity)
        )
      );

      const allAvailable = availabilityChecks.every(options => options.length > 0);
      
      if (allAvailable) {
        return NextResponse.json({
          available: true,
          message: "All items are available",
          itemAvailability: availabilityChecks.map((options, index) => ({
            productName: items[index].productName,
            requestedQuantity: items[index].quantity,
            availableOptions: options
          }))
        }, { status: 200 });
      } else {
        const unavailableItems = items.filter((item, index) => 
          availabilityChecks[index].length === 0
        );

        return NextResponse.json({
          available: false,
          message: "Some items are not available",
          unavailableItems,
          itemAvailability: availabilityChecks.map((options, index) => ({
            productName: items[index].productName,
            requestedQuantity: items[index].quantity,
            availableOptions: options
          }))
        }, { status: 200 });
      }
    }
  } catch (error: any) {
    console.error("Check Availability Error:", error);
    return NextResponse.json(
      { message: "Failed to check availability", error: error.message },
      { status: 500 }
    );
  }
}
