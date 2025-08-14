import admin from "firebase-admin";
import "dotenv/config";

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
    ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : "",
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
}

export default admin;
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
