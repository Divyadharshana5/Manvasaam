
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { detectFace } from "@/ai/flows/face-detection-flow";

// This is a simplified face login for demonstration purposes.
// In a production environment, you would use a dedicated face recognition service
// that compares biometric data (embeddings) instead of just detecting a face.

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
            .where('photoURL', '!=', null)
            .where('userType', '==', 'farmer')
            .limit(1)
            .get();

        if (usersWithFace.empty) {
            return NextResponse.json({ message: "No farmer found with a registered face. Please register first." }, { status: 404 });
        }
        
        const userDoc = usersWithFace.docs[0];
        const uid = userDoc.id;

        // 3. Create a custom token for the found user
        const customToken = await adminAuth.createCustomToken(uid);

        return NextResponse.json({ token: customToken, message: "Face login successful." }, { status: 200 });

    } catch (error: any) {
        console.error("API Face Login Error:", error);
        return NextResponse.json({ message: "Failed to log in with face.", error: error.message }, { status: 500 });
    }
}
