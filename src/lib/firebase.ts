
"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCX7QqJ2E-AsLqKiT2YmWYYqQ4PYFR7REo",
  authDomain: "agrilink-h50ej.firebaseapp.com",
  projectId: "agrilink-h50ej",
  storageBucket: "agrilink-h50ej.appspot.com",
  messagingSenderId: "901229086413",
  appId: "1:901229086413:web:b75f25596f1d7b84",
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
  console.warn("⚠️ Firebase initialization failed, running in demo mode:", error);
  isFirebaseAvailable = false;
}

export { app, auth, db, storage, isFirebaseAvailable };
