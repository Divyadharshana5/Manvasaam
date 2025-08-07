
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { restaurantId, password } = await request.json();

    if (!restaurantId || !password) {
      return NextResponse.json({ message: "Restaurant ID and password are required." }, { status: 400 });
    }

    // 1. Find user by their restaurantId in Firestore
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("restaurantId", "==", restaurantId).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Invalid Restaurant ID or password." }, { status: 401 });
    }

    const userData = snapshot.docs[0].data();
    const uid = userData.uid;

    if (!uid) {
        return NextResponse.json({ message: "User account is not properly configured." }, { status: 500 });
    }
    
    // This API route is no longer responsible for password verification.
    // The client will handle sign-in with email and password, and then request
    // a custom token. This route is now only for getting the UID for a custom token.
    
    // 2. Create a custom token for the found user
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ token: customToken }, { status: 200 });

  } catch (error: any) {
    console.error("API Restaurant Login Error:", error);
    return NextResponse.json({ message: "Failed to log in.", error: error.message }, { status: 500 });
  }
}
