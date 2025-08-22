import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseInitialized } from "@/lib/firebase-admin";
import { getHubByManagerId } from "@/lib/hub-db";
import AppLayout from "@/components/app-layout";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  const mockMode = !isFirebaseInitialized || !adminAuth;

  if (!mockMode) {
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const hub = await getHubByManagerId(decodedToken.uid);
      
      if (!hub) {
        redirect("/dashboard");
      }
    } catch (error) {
      redirect("/");
    }
  }

  return <AppLayout>{children}</AppLayout>;
}