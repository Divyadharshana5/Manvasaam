import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Check if Firebase is properly initialized
    const mockMode = !isFirebaseInitialized || !adminAuth;

    if (mockMode) {
      console.log("⚠️ Running in mock mode - Firebase not configured");
      // In mock mode, we'll simulate the login process
      const { idToken } = await request.json();

      if (!idToken) {
        return NextResponse.json(
          { message: "ID token is required." },
          { status: 400 }
        );
      }

      // Create a mock session cookie
      const mockSessionCookie = `mock-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

      const options = {
        name: "session",
        value: mockSessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: false, // Set to false for localhost
      };
      (await cookies()).set(options);

      return NextResponse.json({ status: "success", mockMode: true }, { status: 200 });
    }

    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie policy for session cookie.
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };
    (await cookies()).set(options);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("API Login Error:", error);
    return NextResponse.json(
      { message: "Failed to create session.", error: error.message },
      { status: 500 }
    );
  }
}
