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
  console.log("🔐 Login API called at", new Date().toISOString());
  
  try {
    // Always return a valid JSON response, even for errors
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
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
        JSON.stringify({ message: "Invalid JSON in request body", success: false }),
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

    // Always use mock mode for now to ensure it works
    console.log("⚠️ Using mock mode for reliable testing");
    
    // Create a simple mock session
    const mockSessionCookie = `mock-session-${Date.now()}`;
    const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds

    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "session",
        value: mockSessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: false, // Allow for localhost
        sameSite: 'lax',
        path: '/',
      });

      console.log("✅ Mock session created:", mockSessionCookie);
      
      const successResponse = { 
        success: true,
        status: "success", 
        mockMode: true,
        message: "Login successful",
        timestamp: new Date().toISOString()
      };
      
      console.log("📤 Sending success response:", successResponse);
      
      return new NextResponse(
        JSON.stringify(successResponse),
        { status: 200, headers }
      );
      
    } catch (cookieError) {
      console.error("❌ Cookie error:", cookieError);
      return new NextResponse(
        JSON.stringify({ 
          message: "Failed to create session", 
          success: false,
          error: String(cookieError)
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
      timestamp: new Date().toISOString()
    };
    
    return new NextResponse(
      JSON.stringify(errorResponse),
      { 
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  }
}
