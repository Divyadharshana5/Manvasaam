import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "agrilink-h50ej",
  "appId": "1:901229086413:web:b75f25596f1d7f751d4b84",
  "storageBucket": "agrilink-h50ej.appspot.com",
  "apiKey": "AIzaSyCX7QqJ2E-AsLqKiT2YmWYYqQ4PYFR7REo",
  "authDomain": "agrilink-h50ej.firebaseapp.com",
  "messagingSenderId": "901229086413"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
