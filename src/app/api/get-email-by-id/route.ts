
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json({ message: "Restaurant ID is required." }, { status: 400 });
    }

    // Find user by their restaurantId in Firestore
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("restaurantId", "==", restaurantId).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Restaurant not found." }, { status: 404 });
    }

    const userData = snapshot.docs[0].data();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ message: "Email not found for this restaurant." }, { status: 404 });
    }

    return NextResponse.json({ email }, { status: 200 });

  } catch (error: any) {
    console.error("API Get Email by ID Error:", error);
    return NextResponse.json({ message: "Failed to retrieve email.", error: error.message }, { status: 500 });
  }
}
