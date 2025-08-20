import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { autoAssignFarmerToNearestHub, assignFarmerToHub, getFarmerHub } from "@/lib/hub-db";
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

    const { farmerId, coordinates, hubId, assignmentType = "auto" } = data;

    // Validate required fields
    if (!farmerId) {
      return NextResponse.json(
        { message: "Farmer ID is required" },
        { status: 400 }
      );
    }

    let assignmentId: string | null = null;

    if (assignmentType === "manual" && hubId) {
      // Manual assignment to specific hub
      assignmentId = await assignFarmerToHub(farmerId, hubId, 0, "manual");
    } else if (assignmentType === "auto" && coordinates) {
      // Auto assignment based on location
      const { latitude, longitude } = coordinates;
      
      if (!latitude || !longitude) {
        return NextResponse.json(
          { message: "Coordinates are required for auto assignment" },
          { status: 400 }
        );
      }

      assignmentId = await autoAssignFarmerToNearestHub(farmerId, { latitude, longitude });
    } else {
      return NextResponse.json(
        { message: "Invalid assignment parameters" },
        { status: 400 }
      );
    }

    if (!assignmentId) {
      return NextResponse.json(
        { message: "No suitable hub found for assignment" },
        { status: 404 }
      );
    }

    // Get the assigned hub details
    const assignedHub = await getFarmerHub(farmerId);

    return NextResponse.json(
      { 
        message: "Farmer assigned to hub successfully",
        assignmentId,
        hub: assignedHub
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Assign Farmer to Hub Error:", error);
    return NextResponse.json(
      { message: "Failed to assign farmer to hub", error: error.message },
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
    const url = new URL(request.url);
    const farmerId = url.searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { message: "Farmer ID is required" },
        { status: 400 }
      );
    }

    // Get farmer's assigned hub
    const assignedHub = await getFarmerHub(farmerId);

    if (!assignedHub) {
      return NextResponse.json(
        { message: "No hub assigned to this farmer" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { hub: assignedHub },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Farmer Hub Error:", error);
    return NextResponse.json(
      { message: "Failed to get farmer hub", error: error.message },
      { status: 500 }
    );
  }
}
