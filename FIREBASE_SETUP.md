# Firebase Setup Guide for Hub Authentication

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

### For Production (Server-side only - more secure)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

### For Development (Client-side accessible - less secure but easier for testing)
```env
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

## How to Get These Values

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** or create a new one
3. **Go to Project Settings** (gear icon)
4. **Navigate to Service Accounts tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**

From the downloaded JSON file, extract:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and newlines)
- `client_email` → `FIREBASE_CLIENT_EMAIL`

## Mock Mode

If Firebase is not configured, the application will run in **mock mode**:
- ✅ Registration will work with mock data
- ✅ Login will work with mock authentication
- ✅ Sessions will be created locally
- ⚠️ Data won't persist between server restarts
- ⚠️ No real authentication security

## Testing Retail Authentication

### Registration Test:
1. Go to `/login/retail`
2. Click "Register" tab
3. Fill in:
   - Shop Name: "Test Retail Shop"
   - Email: "test@gmail.com"
   - Location: "Test City"
   - Phone: "1234567890"
   - Password: "TestPass123!"
   - Confirm Password: "TestPass123!"
4. Click "Register Hub"

### Login Test:
1. Use the same credentials from registration
2. Should redirect to `/dashboard/hub`

## Troubleshooting

### Common Issues:
1. **"Firebase not configured"** - Check environment variables
2. **"Invalid credentials"** - Verify email/password combination
3. **"Session creation failed"** - Check API logs for detailed errors

### Debug Steps:
1. Check browser console for errors
2. Check server logs for Firebase initialization status
3. Verify environment variables are loaded correctly
4. Test in mock mode first, then with real Firebase

## Security Notes

- Never commit `.env.local` to version control
- Use server-side environment variables in production
- Rotate Firebase keys regularly
- Enable Firebase security rules for production use