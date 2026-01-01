"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase should be initialized
let isFirebaseAvailable = false;
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: any = null;
let storage: any = null;

try {
  // Initialize Firebase
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseAvailable = true;

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn(
    "⚠️ Firebase initialization failed, running in demo mode:",
    error
  );
  isFirebaseAvailable = false;
}

export { app, auth, db, storage, isFirebaseAvailable };
