import { NextResponse } from "next/server";
import {
  adminAuth,
  adminDb,
  isFirebaseInitialized,
} from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    // Check if Firebase is properly initialized
    const mockMode = !isFirebaseInitialized || !adminAuth || !adminDb;

    if (mockMode) {
      console.log("⚠️ Running in mock mode - Firebase not configured");
      // In mock mode, we'll simulate the registration process
      const data = await request.json();
      const { userType, email, branchName } = data;

      // Validate required fields
      if (!email || !userType) {
        return NextResponse.json(
          { message: "Email and user type are required." },
          { status: 400 }
        );
      }

      if (userType === "hub" && !branchName) {
        return NextResponse.json(
          { message: "Branch name is required for hub registration." },
          { status: 400 }
        );
      }

      let branchId: string | undefined = undefined;
      if (userType === "hub") {
        branchId = `HUB-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`;
      }

      console.log(`✅ Mock registration successful for ${userType}: ${email}`);

      // Simulate successful registration
      return NextResponse.json(
        {
          message: "Hub registered successfully (Mock Mode)",
          uid: `mock-uid-${Date.now()}`,
          branchId,
          mockMode: true,
          email: email,
          branchName: branchName,
        },
        { status: 201 }
      );
    }

    const data = await request.json();
    const { email, password, passkeyCredentialId, ...userData } = data;
    const { userType } = userData;

    // Validate passkey for farmers
    if (userType === "farmer" && !passkeyCredentialId) {
      return NextResponse.json(
        {
          message: "Passkey authentication is required for farmers.",
        },
        { status: 400 }
      );
    }

    let restaurantId: string | undefined = undefined;
    if (userType === "restaurant") {
      restaurantId = `REST-${randomBytes(4).toString("hex").toUpperCase()}`;
    }

    let branchId: string | undefined = undefined;
    if (userType === "hub") {
      branchId = `HUB-${randomBytes(3).toString("hex").toUpperCase()}`;
    }

    const authPayload: { [key: string]: any } = {
      email: email,
      password: password,
      emailVerified: false,
      disabled: false,
    };

    // Ensure Firebase services are available
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { message: "Firebase services not available." },
        { status: 503 }
      );
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser(authPayload);

    const firestoreData: { [key: string]: any } = {
      ...userData,
      uid: userRecord.uid,
      email: email, // store email in firestore as well
      createdAt: new Date().toISOString(),
    };

    if (passkeyCredentialId) {
      firestoreData.passkeyCredentialId = passkeyCredentialId;
      firestoreData.authMethod = "passkey";
    }
    if (restaurantId) {
      firestoreData.restaurantId = restaurantId;
    }
    if (branchId) {
      firestoreData.branchId = branchId;
    }

    // Store additional user information in Firestore
    // adminDb is guaranteed to be non-null here due to the check above
    await adminDb.collection("users").doc(userRecord.uid).set(firestoreData);

    // Send the response immediately
    const response = NextResponse.json(
      { message: "User created successfully", uid: userRecord.uid, branchId },
      { status: 201 }
    );

    // Send email notification in the background without awaiting it
    sendPasswordResetEmail(data.email || data.restaurantEmail || "", userRecord.uid).catch(
      (emailError) => {
        // Log errors but don't fail the request because of it
        console.error(
          "Failed to send registration email, but user was created:",
          emailError.message
        );
      }
    );

    return response;
  } catch (error: any) {
    console.error("API Enhanced Registration Error:", error);
    let message = "Failed to create user";
    if (error.code === "auth/email-already-exists") {
      message = "An account with this email already exists.";
    }
    return NextResponse.json(
      { message: message, error: error.message },
      { status: 500 }
    );
  }
}
