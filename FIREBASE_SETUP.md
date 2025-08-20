# Firebase Setup Guide

## Issue: Registration Failed Error

The "Registration Failed" error with "Unexpected token '<' at position 0 is not valid JSON" occurs because Firebase Admin SDK is not properly configured.

## Root Cause

The `.env.local` file contains placeholder values instead of actual Firebase service account credentials, causing the Firebase Admin SDK to fail initialization and return HTML error pages instead of JSON responses.

## Solution

### Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `manvaasam-h50ej`
3. Go to Project Settings (gear icon) → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file

### Step 2: Update Environment Variables

Update the `.env.local` file with the actual values from your service account JSON:

```env
# Firebase Admin Configuration (Server-side only)
FIREBASE_PROJECT_ID=manvaasam-h50ej
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_ACTUAL_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=[YOUR_SERVICE_ACCOUNT_EMAIL]@manvaasam-h50ej.iam.gserviceaccount.com

# Firebase Client Configuration (Client-side) - Already configured
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCX7QqJ2E-AsLqKiT2YmWYYqQ4PYFR7REo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=manvaasam-h50ej.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=manvaasam-h50ej
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=manvaasam-h50ej.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=901229086413
NEXT_PUBLIC_FIREBASE_APP_ID=1:901229086413:web:b75f25596f1d7b84
```

### Step 3: Restart Development Server

After updating the environment variables:

```bash
npm run dev
```

## What Was Fixed

1. **Improved Error Handling**: Added proper validation for Firebase configuration
2. **Better Error Messages**: APIs now return proper JSON error responses instead of HTML
3. **Configuration Validation**: Added checks to ensure Firebase is properly initialized before processing requests

## Testing

After setting up the correct Firebase credentials:

1. Try registering a new user
2. Check that you get proper JSON responses (success or error)
3. Verify that Firebase Admin operations work correctly

## Security Notes

- Never commit actual Firebase private keys to version control
- Keep `.env.local` in your `.gitignore` file
- Use environment variables for production deployment
