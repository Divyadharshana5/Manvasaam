import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  console.log("🔓 Logout API called at", new Date().toISOString());

  try {
    const cookieStore = await cookies();

    // Clear the session cookie
    // Use optional chaining in case the cookie store implementation differs
    cookieStore?.set?.({
      name: "session",
      value: "",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log("✅ Session cleared successfully");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Logout API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout",
        error: error.message || String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
