import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { credentialId, userType, authenticatorData, signature, clientDataJSON } = await request.json();

    if (!credentialId) {
      return NextResponse.json({ 
        message: "Credential ID is required for passkey login." 
      }, { status: 400 });
    }

    if (userType !== 'farmer') {
      return NextResponse.json({ 
        message: "Passkey login is only available for farmers." 
      }, { status: 403 });
    }

    // Find user by passkey credential ID
    const userQuery = await adminDb
      .collection('users')
      .where('passkeyCredentialId', '==', credentialId)
      .where('userType', '==', 'farmer')
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ 
        message: "No user found with this passkey. Please register first." 
      }, { status: 404 });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // In a production environment, you would verify the authenticator data,
    // signature, and client data JSON against the stored public key
    // For this demo, we'll assume the passkey is valid if the credential ID matches

    // Update last login
    await adminDb.collection('users').doc(userDoc.id).update({
      lastLogin: new Date().toISOString(),
      loginCount: (userData.loginCount || 0) + 1
    });

    // Create custom token for Firebase Auth
    const customToken = await adminAuth.createCustomToken(userData.uid, {
      userType: userData.userType,
      authMethod: 'passkey'
    });

    return NextResponse.json({
      token: customToken,
      user: {
        uid: userData.uid,
        username: userData.username,
        email: userData.email,
        userType: userData.userType,
        authMethod: 'passkey'
      }
    });

  } catch (error) {
    console.error("Passkey login error:", error);
    return NextResponse.json(
      { message: "An error occurred during passkey authentication." },
      { status: 500 }
    );
  }
}
