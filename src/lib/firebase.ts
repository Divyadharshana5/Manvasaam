"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCX7QqJ2E-AsLqKiT2YmWYYqQ4PYFR7REo",
  authDomain: "agrilink-h50ej.firebaseapp.com",
  projectId: "agrilink-h50ej",
  storageBucket: "agrilink-h50ej.appspot.com",
  messagingSenderId: "901229086413",
  appId: "1:901229086413:web:b75f25596f1d7b84",
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

// It's better to export the initialized auth object directly.
// A function wrapper is not necessary if the initialization logic is handled correctly at the module level.
export { auth };
