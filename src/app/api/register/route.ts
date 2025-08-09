
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
        // Generate a unique restaurant ID
        restaurantId = `REST-${randomBytes(4).toString('hex').toUpperCase()}`;
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


    // Store additional user information in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set(firestoreData);

    // Send email notification, but don't let it block the registration process
    try {
        await sendRegistrationNotification(data, restaurantId);
    } catch (emailError: any) {
        console.error("Failed to send registration email, but user was created:", emailError.message);
        // Do not re-throw the error, allow the successful response to be sent.
    }

    return NextResponse.json({ message: "User created successfully", uid: userRecord.uid }, { status: 201 });
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
