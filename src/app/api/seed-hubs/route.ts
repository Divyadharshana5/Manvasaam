import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { createHub } from "@/lib/hub-db";
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

    // Sample hubs data
    const sampleHubs = [
      {
        branchName: "Green Valley Hub",
        location: "Bangalore North",
        address: "123 Green Valley Road, Hebbal, Bangalore",
        pincode: "560024",
        phone: "+91 9876543210",
        email: "greenvalley@manvaasam.com",
        capacity: 5000,
        operatingHours: {
          open: "06:00",
          close: "20:00"
        },
        coordinates: {
          latitude: 13.0358,
          longitude: 77.5970
        }
      },
      {
        branchName: "Fresh Market Hub",
        location: "Bangalore South",
        address: "456 Market Street, Koramangala, Bangalore",
        pincode: "560034",
        phone: "+91 9876543211",
        email: "freshmarket@manvaasam.com",
        capacity: 7500,
        operatingHours: {
          open: "05:30",
          close: "21:00"
        },
        coordinates: {
          latitude: 12.9279,
          longitude: 77.6271
        }
      },
      {
        branchName: "Organic Central Hub",
        location: "Bangalore East",
        address: "789 Organic Lane, Whitefield, Bangalore",
        pincode: "560066",
        phone: "+91 9876543212",
        email: "organic@manvaasam.com",
        capacity: 6000,
        operatingHours: {
          open: "06:00",
          close: "19:00"
        },
        coordinates: {
          latitude: 12.9698,
          longitude: 77.7500
        }
      },
      {
        branchName: "Farm Fresh Hub",
        location: "Bangalore West",
        address: "321 Farm Road, Rajajinagar, Bangalore",
        pincode: "560010",
        phone: "+91 9876543213",
        email: "farmfresh@manvaasam.com",
        capacity: 4500,
        operatingHours: {
          open: "05:00",
          close: "20:30"
        },
        coordinates: {
          latitude: 12.9916,
          longitude: 77.5712
        }
      }
    ];

    const createdHubs = [];
    
    for (const hubData of sampleHubs) {
      try {
        const hubId = await createHub({
          ...hubData,
          managerId: decodedToken.uid,
        });
        createdHubs.push({ id: hubId, ...hubData });
      } catch (error) {
        console.error(`Error creating hub ${hubData.branchName}:`, error);
      }
    }

    return NextResponse.json(
      { 
        message: "Sample hubs created successfully",
        hubs: createdHubs
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seed Hubs Error:", error);
    return NextResponse.json(
      { message: "Failed to create sample hubs", error: error.message },
      { status: 500 }
    );
  }
}