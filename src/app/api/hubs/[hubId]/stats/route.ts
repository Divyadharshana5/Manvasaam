import { NextResponse } from "next/server";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHub, getHubStats } from "@/lib/hub-db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { hubId: string } }
) {
  try {
    if (!isFirebaseInitialized || !adminAuth) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const { hubId } = params;

    const hub = await getHub(hubId);
    if (!hub) {
      return NextResponse.json(
        { message: "Hub not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this hub
    if (hub.managerId !== decodedToken.uid) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const stats = await getHubStats(hubId);

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    console.error("Get Hub Stats Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch hub stats", error: error.message },
      { status: 500 }
    );
  }
}
