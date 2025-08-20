import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHub, getHubInventory, searchInventory } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { hubId: string } }
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
    const { hubId } = params;
    const url = new URL(request.url);
    
    // Get query parameters
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const status = url.searchParams.get("status") || "";
    const quality = url.searchParams.get("quality") || "";
    const farmerId = url.searchParams.get("farmerId") || "";
    const includeAll = url.searchParams.get("includeAll") === "true";

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

    let inventory;
    
    if (search || category || status || quality || farmerId) {
      // Use search function with filters
      inventory = await searchInventory(hubId, search, {
        category: category || undefined,
        status: status || undefined,
        quality: quality || undefined,
        farmerId: farmerId || undefined,
      });
    } else {
      // Get all inventory
      inventory = await getHubInventory(hubId, includeAll);
    }

    return NextResponse.json({ inventory }, { status: 200 });
  } catch (error: any) {
    console.error("Get Hub Inventory Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory", error: error.message },
      { status: 500 }
    );
  }
}
