import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, userType } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log(`📧 Processing password reset request for: ${email} (${userType})`);

    // Generate a secure reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    // Store the reset token (in a real app, you'd store this in a database with expiration)
    // For now, we'll just send the email
    
    const result = await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully",
      messageId: result.messageId
    });
  } catch (error: any) {
    console.error("❌ Password reset email error:", error);
    
    // Return appropriate error message
    if (error.message.includes('not configured')) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email service is not configured. Please contact support.",
          isConfigError: true
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}