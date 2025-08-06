
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendRegistrationNotification } from "@/lib/email";
import { detectFace } from "@/ai/flows/face-detection-flow";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, photoDataUri, ...userData } = data;

    // Optional: Validate face if provided
    if (photoDataUri) {
      const faceDetectionResult = await detectFace({ photoDataUri });
      if (!faceDetectionResult.faceDetected) {
        return NextResponse.json({ message: "No face detected in the provided image. Please capture a clear photo." }, { status: 400 });
      }
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        photoURL: photoDataUri, // Set photoURL if provided
        emailVerified: false,
        disabled: false,
    });

    // Store additional user information in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
        ...userData,
        uid: userRecord.uid,
        email: email, // store email in firestore as well
        photoURL: photoDataUri || null, // store photoURL
        createdAt: new Date().toISOString(),
    });

    // Send email notification to admin
    try {
        await sendRegistrationNotification(data);
    } catch (emailError: any) {
        console.error("Failed to send registration email:", emailError.message);
    }

    return NextResponse.json({ message: "User created successfully", uid: userRecord.uid }, { status: 201 });
  } catch (error: any)
   {
    console.error("API Error:", error);
    let message = "Failed to create user";
    if (error.code === 'auth/email-already-exists') {
        message = "An account with this email already exists.";
    }
    return NextResponse.json({ message: message, error: error.message }, { status: 500 });
  }
}
