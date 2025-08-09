
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  // Check if email service is configured
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.error("Email service not configured. Please set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD in your .env file.");
    return NextResponse.json({ message: "The email service is not configured on the server. Please contact support." }, { status: 500 });
  }

  try {
    const { identifier } = await request.json();
    if (!identifier) {
      return NextResponse.json({ message: "Email or Restaurant ID is required." }, { status: 400 });
    }

    let email: string | undefined;

    // Check if the identifier is an email or a Restaurant ID
    if (identifier.includes('@')) {
        email = identifier;
    } else {
        // Assume it's a Restaurant ID, find the user in Firestore
        const usersRef = adminDb.collection("users");
        const snapshot = await usersRef.where("restaurantId", "==", identifier).limit(1).get();
        if (!snapshot.empty) {
            email = snapshot.docs[0].data().email;
        }
    }
    
    // If no email was found either directly or via ID, exit gracefully to prevent user enumeration.
    if (!email) {
      console.log(`Password reset requested for non-existent identifier: ${identifier}`);
      return NextResponse.json({ message: "If an account exists with that identifier, a password reset email has been sent." }, { status: 200 });
    }

    // Check if the user actually exists in Firebase Auth
    try {
        await adminAuth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.log(`Password reset requested for non-existent user: ${email}`);
            return NextResponse.json({ message: "If an account exists with that identifier, a password reset email has been sent." }, { status: 200 });
        }
        throw error; // Re-throw other errors
    }

    // Generate password reset link and send email
    const link = await adminAuth.generatePasswordResetLink(email);
    await sendPasswordResetEmail({ email, link });

    return NextResponse.json({ message: "Password reset email sent successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("API Forgot Password Error:", error);
    let errorMessage = "Failed to send password reset email.";
    return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
  }
}
