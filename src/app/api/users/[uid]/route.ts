import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
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
  { params }: { params: { uid: string } }
) {
  try {
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    
    // You might want to validate the body here to ensure only allowed fields are updated
    // For example, filter out fields that shouldn't be changed by the user.
    const allowedUpdates: { [key: string]: any } = {};
    if (body.username) allowedUpdates.username = body.username;
    if (body.phone) allowedUpdates.phone = body.phone;
    if (body.branchName) allowedUpdates.branchName = body.branchName;

    if (Object.keys(allowedUpdates).length === 0) {
        return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    await adminDb.collection("users").doc(uid).update(allowedUpdates);

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("API Update User Error:", error);
    return NextResponse.json({ message: "Failed to update profile", error: error.message }, { status: 500 });
  }
}
