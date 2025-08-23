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
                     serviceAccount.clientEmail &&
                     serviceAccount.privateKey !== "" &&
                     serviceAccount.clientEmail !== "";

let isFirebaseInitialized = false;

console.log("🔧 Firebase Admin Config Check:");
console.log("- Project ID:", serviceAccount.projectId ? "✅ Set" : "❌ Missing");
console.log("- Private Key:", serviceAccount.privateKey ? "✅ Set" : "❌ Missing");
console.log("- Client Email:", serviceAccount.clientEmail ? "✅ Set" : "❌ Missing");

if (!admin.apps.length && isConfigValid) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
    isFirebaseInitialized = true;
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
    console.log("🔄 Falling back to mock mode");
    isFirebaseInitialized = false;
  }
} else if (!isConfigValid) {
  console.log("⚠️ Firebase Admin configuration incomplete - running in mock mode");
  console.log("📝 To enable Firebase, set these environment variables:");
  console.log("   - FIREBASE_PROJECT_ID or NEXT_PUBLIC_PROJECT_ID");
  console.log("   - FIREBASE_PRIVATE_KEY or NEXT_PUBLIC_FIREBASE_PRIVATE_KEY");
  console.log("   - FIREBASE_CLIENT_EMAIL or NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL");
  isFirebaseInitialized = false;
} else {
  console.log("✅ Firebase Admin already initialized");
  isFirebaseInitialized = true;
}

export default admin;
export const adminAuth = isFirebaseInitialized ? admin.auth() : null;
export const adminDb = isFirebaseInitialized ? admin.firestore() : null;
export { isFirebaseInitialized };
