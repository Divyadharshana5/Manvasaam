import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("API Logout Error:", error);
    return NextResponse.json(
      { message: "Failed to logout.", error: error.message },
      { status: 500 }
    );
  }
}
