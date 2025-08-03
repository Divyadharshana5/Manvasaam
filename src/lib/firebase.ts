import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'manvaasam-6e8a4',
  appId: '1:1012316104829:web:3522f18f8e7787f7396c21',
  storageBucket: 'manvaasam-6e8a4.appspot.com',
  apiKey: 'AIzaSyBNXJ8lT_55fG_Sg1g2c3h4I5J6k7L8m9o',
  authDomain: 'manvaasam-6e8a4.firebaseapp.com',
  messagingSenderId: '1012316104829',
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
