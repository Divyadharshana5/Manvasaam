import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { createHub, getAllHubs } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    if (!isFirebaseInitialized) {
      // Return mock data when Firebase is not configured
      const mockHubs = [
        {
          id: "hub1",
          branchId: "HUB-001",
          branchName: "Green Valley Hub",
          location: "Bangalore North",
          address: "123 Green Valley Road, Hebbal, Bangalore",
          pincode: "560024",
          phone: "+91 9876543210",
          email: "greenvalley@manvaasam.com",
          capacity: 5000,
          currentLoad: 1200,
          status: "active",
          operatingHours: { open: "06:00", close: "20:00" },
          coordinates: { latitude: 13.0358, longitude: 77.5970 },
          managerId: "mock-manager",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "hub2",
          branchId: "HUB-002",
          branchName: "Fresh Market Hub",
          location: "Bangalore South",
          address: "456 Market Street, Koramangala, Bangalore",
          pincode: "560034",
          phone: "+91 9876543211",
          email: "freshmarket@manvaasam.com",
          capacity: 7500,
          currentLoad: 2100,
          status: "active",
          operatingHours: { open: "05:30", close: "21:00" },
          coordinates: { latitude: 12.9279, longitude: 77.6271 },
          managerId: "mock-manager",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      return NextResponse.json({ hubs: mockHubs }, { status: 200 });
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
    
    const hubs = await getAllHubs();
    
    return NextResponse.json({ hubs }, { status: 200 });
  } catch (error: any) {
    console.error("Get Hubs Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch hubs", error: error.message },
      { status: 500 }
    );
  }
}

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
    const requiredFields = ['branchName', 'location', 'address', 'pincode', 'phone', 'email', 'capacity'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create hub
    const hubId = await createHub({
      ...data,
      managerId: decodedToken.uid,
    });

    return NextResponse.json(
      { message: "Hub created successfully", hubId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Hub Error:", error);
    return NextResponse.json(
      { message: "Failed to create hub", error: error.message },
      { status: 500 }
    );
  }
}
