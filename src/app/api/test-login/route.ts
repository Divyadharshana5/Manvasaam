import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    console.log("🧪 Test login endpoint called");

    const body = await request.json();
    console.log("Request body:", body);

    // Create a simple test session
    const testSessionCookie = `test-session-${Date.now()}`;
    const expiresIn = 60 * 60 * 24; // 1 day in seconds

    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "test-session",
        value: testSessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: false, // Allow for localhost testing
        sameSite: "lax",
        path: "/",
      });

      console.log("✅ Test session cookie set successfully");

      return NextResponse.json(
        {
          status: "success",
          message: "Test session created successfully",
          sessionId: testSessionCookie,
        },
        { status: 200 }
      );
    } catch (cookieError) {
      console.error("❌ Cookie setting error:", cookieError);
      return NextResponse.json(
        {
          message: "Failed to set test cookie",
          error:
            cookieError instanceof Error
              ? cookieError.message
              : String(cookieError),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("❌ Test login error:", error);
    return NextResponse.json(
      {
        message: "Test login failed",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test login endpoint is working",
    timestamp: new Date().toISOString(),
  });
}
