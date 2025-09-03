// Passkey/WebAuthn utility functions for farmer authentication
export interface PasskeyCredential {
  id: string;
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    attestationObject?: ArrayBuffer;
    authenticatorData?: ArrayBuffer;
    signature?: ArrayBuffer;
  };
  type: string;
}

export interface PasskeyStatus {
  supported: boolean;
  registered: boolean;
  credentialId?: string;
  feedback: string;
  status: "ready" | "registering" | "authenticating" | "error" | "success";
}

// Check if WebAuthn is supported
export function isPasskeySupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create &&
    navigator.credentials.get
  );
}

// Generate a random challenge
function generateChallenge(): Uint8Array {
  return new Uint8Array(32).map(() => Math.floor(Math.random() * 256));
}

// Convert ArrayBuffer to base64url
function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Convert base64url to ArrayBuffer
function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Register a new passkey
export async function registerPasskey(userEmail: string): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  try {
    if (!isPasskeySupported()) {
      return { success: false, error: "Passkeys not supported on this device" };
    }

    const challenge = generateChallenge();
    const userId = new TextEncoder().encode(userEmail);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Manvasaam",
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: userEmail,
        displayName: userEmail,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Prefer built-in authenticators
        userVerification: "preferred",
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "none",
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: "Failed to create passkey" };
    }

    const credentialId = arrayBufferToBase64url(credential.rawId);
    
    return { 
      success: true, 
      credentialId 
    };
  } catch (error: any) {
    console.error("Passkey registration error:", error);
    return { 
      success: false, 
      error: error.name === "NotAllowedError" 
        ? "Passkey registration was cancelled" 
        : "Failed to register passkey" 
    };
  }
}

// Authenticate with existing passkey
export async function authenticatePasskey(credentialId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isPasskeySupported()) {
      return { success: false, error: "Passkeys not supported on this device" };
    }

    const challenge = generateChallenge();
    const credentialIdBuffer = base64urlToArrayBuffer(credentialId);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: credentialIdBuffer,
          type: "public-key",
        },
      ],
      timeout: 60000,
      userVerification: "preferred",
    };

    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!credential) {
      return { success: false, error: "Authentication failed" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Passkey authentication error:", error);
    return { 
      success: false, 
      error: error.name === "NotAllowedError" 
        ? "Authentication was cancelled" 
        : "Authentication failed" 
    };
  }
}

// Get initial passkey status
export function getInitialPasskeyStatus(): PasskeyStatus {
  const supported = isPasskeySupported();
  
  return {
    supported,
    registered: false,
    feedback: supported 
      ? "Fingerprint authentication available (optional)" 
      : "Fingerprint authentication not supported on this device",
    status: "ready",
  };
}