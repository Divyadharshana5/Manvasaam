import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  console.log("🔍 Login API health check");
  return NextResponse.json({ 
    message: "Login API is working",
    timestamp: new Date().toISOString(),
    mockMode: !isFirebaseInitialized || !adminAuth,
    firebaseInitialized: isFirebaseInitialized
  });
}

export async function POST(request: Request) {
  console.log("🔐 Login API called");
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("📝 Request body parsed:", { hasIdToken: !!body.idToken });
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return NextResponse.json(
        { message: "Invalid request body", error: "JSON parse error" },
        { status: 400 }
      );
    }

    const { idToken } = body;

    if (!idToken) {
      console.log("❌ No ID token provided");
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    // Check if Firebase is properly initialized
    const mockMode = !isFirebaseInitialized || !adminAuth;
    console.log(`🔧 Mode: ${mockMode ? 'Mock' : 'Firebase'}`);

    if (mockMode) {
      console.log("⚠️ Running in mock mode - Firebase not configured");
      
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
        
        const successResponse = { 
          status: "success", 
          mockMode: true,
          message: "Session created in mock mode",
          sessionId: mockSessionCookie
        };
        
        console.log("📤 Sending response:", successResponse);
        return NextResponse.json(successResponse, { status: 200 });
        
      } catch (cookieError) {
        console.error("❌ Cookie setting error:", cookieError);
        return NextResponse.json(
          { 
            message: "Failed to set session cookie.", 
            error: cookieError instanceof Error ? cookieError.message : String(cookieError)
          },
          { status: 500 }
        );
      }
    }

    // Firebase mode - only proceed if adminAuth is available
    if (!adminAuth) {
      console.log("❌ AdminAuth not available");
      return NextResponse.json(
        { message: "Authentication service not available." },
        { status: 503 }
      );
    }

    try {
      console.log("🔥 Creating Firebase session...");
      
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
      
      const successResponse = { 
        status: "success", 
        mockMode: false,
        message: "Firebase session created"
      };
      
      console.log("📤 Sending response:", successResponse);
      return NextResponse.json(successResponse, { status: 200 });
      
    } catch (firebaseError: any) {
      console.error("❌ Firebase session creation error:", firebaseError);
      return NextResponse.json(
        { 
          message: "Failed to create Firebase session.", 
          error: firebaseError.message || String(firebaseError)
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("❌ API Login Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to create session.", 
        error: error.message || String(error)
      },
      { status: 500 }
    );
  }
}
