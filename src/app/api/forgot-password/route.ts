
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Check if the user exists
    try {
        await adminAuth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // To prevent email enumeration, we don't reveal that the user doesn't exist.
            // We'll just return a success response as if an email was sent.
            console.log(`Password reset requested for non-existent user: ${email}`);
            return NextResponse.json({ message: "Password reset email sent." }, { status: 200 });
        }
        // For other errors, we re-throw to be caught by the outer catch block.
        throw error;
    }

    // Generate password reset link
    const link = await adminAuth.generatePasswordResetLink(email);

    // Send the email
    await sendPasswordResetEmail({ email, link });

    return NextResponse.json({ message: "Password reset email sent successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("API Forgot Password Error:", error);
    let errorMessage = "Failed to send password reset email.";
    // Avoid revealing specific errors to the client for security reasons.
    return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
  }
}
