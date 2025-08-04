import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendRegistrationNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, ...userData } = data;

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        emailVerified: false, // Start with email as not verified
        disabled: false,
    });

    // Store additional user information in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
        ...userData,
        uid: userRecord.uid,
        email: email, // store email in firestore as well
        createdAt: new Date().toISOString(),
    });

    // Send email notification to admin
    try {
        await sendRegistrationNotification(data);
    } catch (emailError: any) {
        console.error("Failed to send registration email:", emailError.message);
    }

    // You could also trigger a verification email here
    // const link = await adminAuth.generateEmailVerificationLink(email);
    // await sendVerificationEmail({ email, link }); // You'd need to create this function

    return NextResponse.json({ message: "User created successfully", uid: userRecord.uid }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    let message = "Failed to create user";
    if (error.code === 'auth/email-already-exists') {
        message = "An account with this email already exists.";
    }
    return NextResponse.json({ message: message, error: error.message }, { status: 500 });
  }
}
