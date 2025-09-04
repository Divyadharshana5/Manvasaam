import emailjs from "@emailjs/browser";
import { useEffect } from "react";

// EmailJS configuration
const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
  "NEXT_PUBLIC_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
  "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
  "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY";

// Auto-initialize EmailJS
if (
  typeof window !== "undefined" &&
  EMAILJS_PUBLIC_KEY !== "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Initialize EmailJS
export const initEmailJS = () => {
  try {
    if (EMAILJS_PUBLIC_KEY !== "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY") {
      console.log(
        "Initializing EmailJS with public key:",
        EMAILJS_PUBLIC_KEY.substring(0, 10) + "..."
      );
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log("EmailJS initialized successfully");
    } else {
      console.log("EmailJS not configured - using demo mode");
    }
  } catch (error) {
    console.error("Failed to initialize EmailJS:", error);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  userEmail: string,
  userName?: string,
  userType?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if EmailJS is properly configured
    if (
      EMAILJS_SERVICE_ID === "NEXT_PUBLIC_EMAILJS_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID" ||
      EMAILJS_PUBLIC_KEY === "your_public_key"
    ) {
      console.log("EmailJS not configured, returning demo mode response");
      return {
        success: true,
        message:
          "Password reset request received. Please check your email for instructions. (Demo Mode)",
      };
    }

    // Generate a simple reset token (in production, this should be more secure)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetLink = `${
      window.location.origin
    }/reset-password?token=${resetToken}&email=${encodeURIComponent(
      userEmail
    )}`;

    const templateParams = {
      to_email: userEmail,
      to_name: userName || "User",
      user_type: userType || "user",
      reset_link: resetLink,
      from_name: "Manvasaam Support Team",
      message: `Hello ${
        userName || "User"
      },\n\nWe received a request to reset your password for your ${
        userType || "user"
      } account.\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nManvasaam Support Team`,
    };

    // Validate required parameters
    if (!userEmail || !userEmail.includes("@")) {
      throw new Error("Invalid email address");
    }

    console.log("Sending email with EmailJS...", {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      to: userEmail,
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log("EmailJS response:", response);

    if (response.status === 200) {
      return {
        success: true,
        message: "Password reset email sent successfully!",
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error: any) {
    console.error("EmailJS Error:", error);
    const errorMessage =
      error?.text || error?.message || "Unknown error occurred";
    return {
      success: false,
      message: `Email service error: ${errorMessage}`,
    };
  }
};
