
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    // The client-side will now handle the actual password verification
    // and just request a custom token for a given UID after it has authenticated.
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }
    
    // Create a custom token for the authenticated user UID
    const customToken = await adminAuth.createCustomToken(uid);
    
    return NextResponse.json({ token: customToken }, { status: 200 });

  } catch (error: any) {
    console.error("API Login Error:", error);
    let errorMessage = "Failed to create custom token.";
     if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found.";
    }
    return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
  }
}
