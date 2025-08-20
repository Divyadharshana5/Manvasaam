
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Check if Firebase is configured
    if (!adminDb) {
      // Return mock user data for demo mode
      return NextResponse.json({
        uid: uid,
        userType: uid.includes('hub') ? 'hub' : 'customer',
        username: uid.includes('hub') ? 'Hub Manager' : 'Customer',
        email: uid.includes('hub') ? 'hub@demo.com' : 'customer@demo.com',
        mockMode: true
      }, { status: 200 });
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Ensure we don't send back sensitive data if any were stored
    const { password, ...safeUserData } = userData || {};

    return NextResponse.json(safeUserData, { status: 200 });

  } catch (error: any) {
    console.error("API Get User Error:", error);
    return NextResponse.json({ message: "Failed to fetch user data", error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    
    const allowedUpdates: { [key: string]: any } = {};
    const authUpdates: { [key: string]: any } = {};

    if (body.username) allowedUpdates.username = body.username;
    if (body.phone) allowedUpdates.phone = body.phone;
    if (body.branchName) allowedUpdates.branchName = body.branchName;
    if (body.photoURL) {
        allowedUpdates.photoURL = body.photoURL;
        authUpdates.photoURL = body.photoURL;
    }
    if (body.email) {
        allowedUpdates.email = body.email;
        authUpdates.email = body.email;
    }


    if (Object.keys(allowedUpdates).length === 0) {
        return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    // Update Firestore
    await adminDb.collection("users").doc(uid).update(allowedUpdates);

    // Update Firebase Auth user if needed
    if (Object.keys(authUpdates).length > 0) {
        await adminAuth.updateUser(uid, authUpdates);
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("API Update User Error:", error);
    let message = "Failed to update profile";
    if (error.code === 'auth/email-already-exists') {
        message = "An account with this email already exists.";
    } else if (error.code === 'auth/invalid-email') {
        message = "The new email address is not valid.";
    }
    return NextResponse.json({ message: message, error: error.message }, { status: 500 });
  }
}

    