
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { restaurantId, branchId, userType } = await request.json();

    if (!restaurantId && !branchId) {
      return NextResponse.json({ message: "Restaurant ID or Branch ID is required." }, { status: 400 });
    }

    const usersRef = adminDb.collection("users");
    let snapshot;

    if (restaurantId) {
        snapshot = await usersRef.where("restaurantId", "==", restaurantId).limit(1).get();
        if (snapshot.empty) {
            return NextResponse.json({ message: "Restaurant not found." }, { status: 404 });
        }
    } else if (branchId && userType === 'hub') {
        snapshot = await usersRef.where("branchId", "==", branchId).where("userType", "==", "hub").limit(1).get();
         if (snapshot.empty) {
            return NextResponse.json({ message: "Hub not found." }, { status: 404 });
        }
    } else {
        return NextResponse.json({ message: "Invalid request parameters." }, { status: 400 });
    }


    const userData = snapshot.docs[0].data();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ message: "Email not found for this user." }, { status: 404 });
    }

    return NextResponse.json({ email }, { status: 200 });

  } catch (error: any) {
    console.error("API Get Email by ID Error:", error);
    return NextResponse.json({ message: "Failed to retrieve email.", error: error.message }, { status: 500 });
  }
}

    

    