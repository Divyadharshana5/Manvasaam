
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendRegistrationNotification } from "@/lib/email";
import { detectFace } from "@/ai/flows/face-detection-flow";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, photoDataUri, ...userData } = data;
    const { userType } = userData;

    // Optional: Validate face if provided for farmers
    if (userType === 'farmer' && photoDataUri) {
      const faceDetectionResult = await detectFace({ photoDataUri });
      if (!faceDetectionResult.faceDetected) {
        return NextResponse.json({ message: "No face detected in the provided image. Please capture a clear photo." }, { status: 400 });
      }
    }
    
    let restaurantId: string | undefined = undefined;
    if (userType === 'restaurant') {
        restaurantId = `REST-${randomBytes(4).toString('hex').toUpperCase()}`;
    }

    let branchId: string | undefined = undefined;
    if (userType === 'hub') {
        branchId = `HUB-${randomBytes(3).toString('hex').toUpperCase()}`;
    }

    const authPayload: { [key: string]: any } = {
        email: email,
        password: password,
        emailVerified: false,
        disabled: false,
    };

    if (photoDataUri) {
        authPayload.photoURL = photoDataUri;
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser(authPayload);
    
    const firestoreData: { [key: string]: any } = {
        ...userData,
        uid: userRecord.uid,
        email: email, // store email in firestore as well
        createdAt: new Date().toISOString(),
    };

    if (photoDataUri) {
        firestoreData.photoURL = photoDataUri;
    }
    if (restaurantId) {
        firestoreData.restaurantId = restaurantId;
    }
    if (branchId) {
        firestoreData.branchId = branchId;
    }


    // Store additional user information in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set(firestoreData);

    // Send the response immediately
    const response = NextResponse.json({ message: "User created successfully", uid: userRecord.uid, branchId }, { status: 201 });

    // Send email notification in the background without awaiting it
    sendRegistrationNotification(data, restaurantId, branchId).catch(emailError => {
        // Log errors but don't fail the request because of it
        console.error("Failed to send registration email, but user was created:", emailError.message);
    });

    return response;
    
  } catch (error: any)
   {
    console.error("API Registration Error:", error);
    let message = "Failed to create user";
    if (error.code === 'auth/email-already-exists') {
        message = "An account with this email already exists.";
    }
    return NextResponse.json({ message: message, error: error.message }, { status: 500 });
  }
}

    
