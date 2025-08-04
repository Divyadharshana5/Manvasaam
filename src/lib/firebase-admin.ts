import admin from 'firebase-admin';

const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBEASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error('Firebase admin initialization error', error.stack);
    }
}


export default admin;
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
