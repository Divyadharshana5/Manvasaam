import { AppLayout } from "@/components/app-layout";
import { DashboardContent } from "@/components/dashboard-content";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { readCookie } from "@/lib/read-cookie";
import { redirect } from "next/navigation";

interface UserProfile {
  username?: string;
  userType?: string;
  branchName?: string;
  email?: string;
}

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!adminDb) {
      console.warn("Firebase Admin DB not initialized");
      return null;
    }
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const sessionCookie = await readCookie("session");

  if (!sessionCookie) {
    redirect("/");
  }

  let decodedToken;
  try {
    if (!adminAuth) {
      console.warn("Firebase Admin Auth not initialized");
      // In mock mode, continue without token verification
      decodedToken = { uid: "mock-user" };
    } else {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    }
  } catch (error) {
    redirect("/");
  }

  // Check if we're in mock mode (when Firebase is not configured)
  const mockMode = !adminAuth;
  let userProfile: any;

  if (mockMode) {
    // In mock mode, check if this is a hub user based on the session cookie
    if (sessionCookie && sessionCookie.includes("mock-session")) {
      // For demo purposes, redirect to hub dashboard in mock mode
      redirect("/dashboard/hub");
    }
    userProfile = null; // Default to customer view in mock mode
  } else {
    userProfile = await getUserProfile(decodedToken.uid);

    // Redirect hub users to their specific dashboard
    if (userProfile?.userType === "hub") {
      redirect("/dashboard/hub");
    }

    // Redirect customer users to their specific dashboard
    if (userProfile?.userType === "customer") {
      redirect("/dashboard/customer");
    }
  }

  const displayName =
    userProfile?.username || userProfile?.branchName || userProfile?.email;

  return (
    <AppLayout>
      <DashboardContent userProfile={userProfile} displayName={displayName} />
    </AppLayout>
  );
}
