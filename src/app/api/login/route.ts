import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  console.log("🔍 Login API health check");
  return NextResponse.json({
    message: "Login API is working",
    timestamp: new Date().toISOString(),
    mockMode: !isFirebaseInitialized || !adminAuth,
    firebaseInitialized: isFirebaseInitialized,
  });
}

export async function POST(request: Request) {
  console.log("🔐 Login API called at", new Date().toISOString());

  try {
    // Always return a valid JSON response, even for errors
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };

    // Parse request body with better error handling
    let body;
    try {
      const requestText = await request.text();
      console.log("📝 Raw request:", requestText);

      if (!requestText) {
        return new NextResponse(
          JSON.stringify({ message: "Empty request body", success: false }),
          { status: 400, headers }
        );
      }

      body = JSON.parse(requestText);
      console.log("📦 Parsed body:", { hasIdToken: !!body.idToken });
    } catch (parseError) {
      console.error("❌ Request parse error:", parseError);
      return new NextResponse(
        JSON.stringify({
          message: "Invalid JSON in request body",
          success: false,
        }),
        { status: 400, headers }
      );
    }

    const { idToken } = body;

    if (!idToken) {
      console.log("❌ No ID token provided");
      return new NextResponse(
        JSON.stringify({ message: "ID token is required", success: false }),
        { status: 400, headers }
      );
    }

    // Try to verify the token with Firebase Admin if available
    let userInfo = null;
    if (isFirebaseInitialized && adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userInfo = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
        };
        console.log("✅ Firebase token verified for user:", userInfo.email);
      } catch (firebaseError) {
        console.error("❌ Firebase token verification failed:", firebaseError);
        // Continue with mock mode if Firebase fails
      }
    }

    // Create session cookie
    const sessionCookie = userInfo
      ? `session-${userInfo.uid}-${Date.now()}`
      : `mock-session-${Date.now()}`;

    const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds

    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "lax",
        path: "/",
      });

      console.log("✅ Session created:", sessionCookie);

      // Try to determine user type from the request or token
      let detectedUserType = null;
      if (userInfo?.email) {
        // In a real app, you'd get this from your user database
        // For demo, we'll try to infer from email or use localStorage on client
        if (userInfo.email.includes('farmer')) detectedUserType = 'farmer';
        else if (userInfo.email.includes('hub')) detectedUserType = 'hub';
        else if (userInfo.email.includes('restaurant')) detectedUserType = 'restaurant';
        else detectedUserType = 'customer'; // default
      }

      const successResponse = {
        success: true,
        status: "success",
        mockMode: !userInfo,
        message: "Login successful",
        userType: detectedUserType,
        user: userInfo
          ? {
              uid: userInfo.uid,
              email: userInfo.email,
              emailVerified: userInfo.emailVerified,
            }
          : null,
        timestamp: new Date().toISOString(),
      };

      console.log("📤 Sending success response:", successResponse);

      return new NextResponse(JSON.stringify(successResponse), {
        status: 200,
        headers,
      });
    } catch (cookieError) {
      console.error("❌ Cookie error:", cookieError);
      return new NextResponse(
        JSON.stringify({
          message: "Failed to create session",
          success: false,
          error: String(cookieError),
        }),
        { status: 500, headers }
      );
    }
  } catch (error: any) {
    console.error("❌ Login API error:", error);

    // Always return valid JSON
    const errorResponse = {
      message: "Internal server error",
      success: false,
      error: error.message || String(error),
      timestamp: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
