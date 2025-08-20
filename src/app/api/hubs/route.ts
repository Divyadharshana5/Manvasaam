import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { createHub, getAllHubs } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function GET() {
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
    
    // Get all hubs (admin only for now)
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
