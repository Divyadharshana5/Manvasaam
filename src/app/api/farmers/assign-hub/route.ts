import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getFarmerHub } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    if (!isFirebaseInitialized) {
      // Mock assignment when Firebase is not configured
      const data = await request.json();
      const { hubId } = data;
      
      const mockHub = {
        id: hubId || "hub1",
        branchId: "HUB-001",
        branchName: "Green Valley Hub",
        location: "Bangalore North",
        address: "123 Green Valley Road, Hebbal, Bangalore",
        status: "active",
        operatingHours: { open: "06:00", close: "20:00" },
        capacity: 5000,
        currentLoad: 1200
      };
      
      return NextResponse.json(
        { 
          message: "Farmer assigned to hub successfully",
          assignmentId: "mock-assignment",
          hub: mockHub
        },
        { status: 200 }
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

    if (!farmerId) {
      return NextResponse.json(
        { message: "Farmer ID is required" },
        { status: 400 }
      );
    }

    let assignmentId: string | null = null;

    if (assignmentType === "manual" && hubId) {
      assignmentId = await assignFarmerToHub(farmerId, hubId, 0, "manual");
    } else if (assignmentType === "auto" && coordinates) {
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
    if (!isFirebaseInitialized) {
      // Return mock assignment when Firebase is not configured
      return NextResponse.json(
        { message: "No hub assigned to this farmer" },
        { status: 404 }
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
