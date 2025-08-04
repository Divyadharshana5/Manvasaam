"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCX7QqJ2E-AsLqKiT2YmWYYqQ4PYFR7REo",
  authDomain: "agrilink-h50ej.firebaseapp.com",
  projectId: "agrilink-h50ej",
  storageBucket: "agrilink-h50ej.firebasestorage.app",
  messagingSenderId: "901229086413",
  appId: "1:901229086413:web:b75f25596f1d7b84",
};

// Initialize Firebase for SSR
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

export { app, auth };
