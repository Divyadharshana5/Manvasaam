
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { detectFace } from "@/ai/flows/face-detection-flow";

// This is a simplified face login for demonstration purposes.
// In a production environment, you would use a dedicated face recognition service
// that compares biometric data (embeddings) instead of just detecting a face.

export async function PUT(request: Request) {
  try {
    const { email, photoDataUri } = await request.json();

    if (!email || !photoDataUri) {
      return NextResponse.json({ message: "Email and photo are required." }, { status: 400 });
    }

    // 1. Detect if there's a face in the picture
    const faceDetectionResult = await detectFace({ photoDataUri });
    if (!faceDetectionResult.faceDetected) {
      return NextResponse.json({ message: "No face detected in the image. Please try again." }, { status: 400 });
    }
    
    // 2. Find user and update their profile with the face data URL
    const userRecord = await adminAuth.getUserByEmail(email);
    const userDoc = await adminDb.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists || userDoc.data()?.userType !== 'farmer') {
        return NextResponse.json({ message: "Face registration is only available for farmers." }, { status: 403 });
    }

    await adminDb.collection("users").doc(userRecord.uid).update({
        facePhotoUrl: photoDataUri // In a real app, store this securely or store an embedding
    });

    return NextResponse.json({ message: "Face registered successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("API Face Registration Error:", error);
    let message = "Failed to register face.";
    if (error.code === 'auth/user-not-found') {
        message = "User with this email not found. Please register first.";
    }
    return NextResponse.json({ message, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const { photoDataUri, userType } = await request.json();

        if (!photoDataUri) {
            return NextResponse.json({ message: "Photo is required for face login." }, { status: 400 });
        }
        if (userType !== 'farmer') {
            return NextResponse.json({ message: "Face login is only available for farmers." }, { status: 403 });
        }

        // 1. Detect if there's a face in the picture
        const faceDetectionResult = await detectFace({ photoDataUri });
        if (!faceDetectionResult.faceDetected) {
            return NextResponse.json({ message: "No face detected. Please position your face in the camera." }, { status: 400 });
        }
        
        // 2. Find a farmer user with a matching face
        // THIS IS A SIMPLIFIED LOOKUP. A real application would use a vector database
        // to find the user with the closest facial embedding. Here we just find the *first*
        // farmer with any face data registered. This is NOT secure and for DEMO only.
        const usersWithFace = await adminDb.collection('users')
            .where('facePhotoUrl', '!=', null)
            .where('userType', '==', 'farmer')
            .limit(1)
            .get();

        if (usersWithFace.empty) {
            return NextResponse.json({ message: "No farmer found with a registered face. Please register first." }, { status: 404 });
        }
        
        const user = usersWithFace.docs[0].data();
        const uid = user.uid;

        // 3. Create a custom token for the found user
        const customToken = await adminAuth.createCustomToken(uid);

        return NextResponse.json({ token: customToken, message: "Face login successful." }, { status: 200 });

    } catch (error: any) {
        console.error("API Face Login Error:", error);
        return NextResponse.json({ message: "Failed to log in with face.", error: error.message }, { status: 500 });
    }
}
