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
