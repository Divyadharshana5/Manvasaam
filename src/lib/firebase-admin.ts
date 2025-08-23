import admin from "firebase-admin";
import "dotenv/config";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID || "",
  privateKey: 
    (process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || "",
};

// Validate required environment variables
const isConfigValid = serviceAccount.projectId &&
                     serviceAccount.privateKey &&
                     serviceAccount.clientEmail;

let isFirebaseInitialized = false;

if (!admin.apps.length && isConfigValid) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log("✅ Firebase Admin initialized");
    isFirebaseInitialized = true;
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
    isFirebaseInitialized = false;
  }
} else if (!isConfigValid) {
  console.error("❌ Firebase Admin configuration is invalid. Please check your environment variables.");
  isFirebaseInitialized = false;
} else {
  isFirebaseInitialized = true;
}

export default admin;
export const adminAuth = isFirebaseInitialized ? admin.auth() : null;
export const adminDb = isFirebaseInitialized ? admin.firestore() : null;
export { isFirebaseInitialized };
