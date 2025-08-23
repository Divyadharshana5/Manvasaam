import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    // Check if Firebase is properly initialized
    const mockMode = !isFirebaseInitialized || !adminAuth;

    if (mockMode) {
      console.log("⚠️ Running in mock mode - Firebase not configured");
      
      // Validate mock token format (allow any format in mock mode for flexibility)
      if (!idToken.includes('mock-token-') && !idToken.includes('test-')) {
        console.log("Creating mock token for:", idToken);
      }

      // Create a mock session cookie
      const mockSessionCookie = `mock-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds

      try {
        const cookieStore = await cookies();
        cookieStore.set({
          name: "session",
          value: mockSessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        console.log("✅ Mock session created successfully");
        return NextResponse.json({ 
          status: "success", 
          mockMode: true,
          message: "Session created in mock mode"
        }, { status: 200 });
      } catch (cookieError) {
        console.error("Cookie setting error:", cookieError);
        return NextResponse.json(
          { message: "Failed to set session cookie.", error: cookieError },
          { status: 500 }
        );
      }
    }

    // Firebase mode - only proceed if adminAuth is available
    if (!adminAuth) {
      return NextResponse.json(
        { message: "Authentication service not available." },
        { status: 503 }
      );
    }

    try {
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // milliseconds
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      // Set cookie policy for session cookie.
      const cookieStore = await cookies();
      cookieStore.set({
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn / 1000, // convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      console.log("✅ Firebase session created successfully");
      return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (firebaseError: any) {
      console.error("Firebase session creation error:", firebaseError);
      return NextResponse.json(
        { message: "Failed to create Firebase session.", error: firebaseError.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("API Login Error:", error);
    return NextResponse.json(
      { message: "Failed to create session.", error: error.message },
      { status: 500 }
    );
  }
}
