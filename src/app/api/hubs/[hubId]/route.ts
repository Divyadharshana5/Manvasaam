import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHub, updateHub, getHubStats } from "@/lib/hub-db";
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

    return NextResponse.json({ hub }, { status: 200 });
  } catch (error: any) {
    console.error("Get Hub Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch hub", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    // Filter allowed updates
    const allowedUpdates = {
      branchName: updates.branchName,
      location: updates.location,
      address: updates.address,
      pincode: updates.pincode,
      phone: updates.phone,
      capacity: updates.capacity,
      operatingHours: updates.operatingHours,
      coordinates: updates.coordinates,
      status: updates.status,
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
        delete allowedUpdates[key as keyof typeof allowedUpdates];
      }
    });

    await updateHub(hubId, allowedUpdates);

    return NextResponse.json(
      { message: "Hub updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Hub Error:", error);
    return NextResponse.json(
      { message: "Failed to update hub", error: error.message },
      { status: 500 }
    );
  }
}
