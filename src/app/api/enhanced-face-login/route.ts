import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { compareFaces } from '@/ai/flows/enhanced-face-detection-flow';

export async function POST(request: NextRequest) {
  try {
    const { photoDataUri, userType, analysis, autoLogin = false } = await request.json();

    if (!photoDataUri || !userType) {
      return NextResponse.json(
        { message: 'Photo and user type are required.' },
        { status: 400 }
      );
    }

    // For auto-login, use more lenient validation
    if (analysis && !autoLogin && !analysis.suitableForAuth) {
      return NextResponse.json(
        { message: 'Photo quality is insufficient for authentication.' },
        { status: 400 }
      );
    }

    // Query users with face data for the specified user type
    const usersSnapshot = await adminDb
      .collection('users')
      .where('userType', '==', userType)
      .where('photoDataUri', '!=', null)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json(
        { message: 'No registered users found with face data.' },
        { status: 404 }
      );
    }

    let bestMatch = null;
    let highestSimilarity = 0;
    // Use higher threshold for auto-login for better security
    const SIMILARITY_THRESHOLD = autoLogin ? 0.85 : 0.75;
    const CONFIDENCE_THRESHOLD = autoLogin ? 0.8 : 0.7;

    // Compare with all registered faces
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      try {
        const comparisonResult = await compareFaces({
          registeredFaceDataUri: userData.photoDataUri,
          currentFaceDataUri: photoDataUri,
        });

        console.log(`Comparison with user ${userData.username}: similarity=${comparisonResult.similarity}, confidence=${comparisonResult.confidence}, autoLogin=${autoLogin}`);

        if (comparisonResult.isMatch && 
            comparisonResult.similarity > highestSimilarity && 
            comparisonResult.similarity >= SIMILARITY_THRESHOLD &&
            comparisonResult.confidence >= CONFIDENCE_THRESHOLD) {
          
          bestMatch = {
            userId: userDoc.id,
            userData,
            similarity: comparisonResult.similarity,
            confidence: comparisonResult.confidence
          };
          highestSimilarity = comparisonResult.similarity;
        }
      } catch (error) {
        console.error(`Error comparing faces for user ${userData.username}:`, error);
        continue;
      }
    }

    if (!bestMatch) {
      const message = autoLogin 
        ? 'Auto-login: Face not recognized with sufficient confidence.'
        : 'Face not recognized. Please try again or use email login.';
      
      return NextResponse.json(
        { message },
        { status: 401 }
      );
    }

    // Update last login time
    await adminDb.collection('users').doc(bestMatch.userId).update({
      lastLogin: new Date(),
      loginCount: (bestMatch.userData.loginCount || 0) + 1
    });

    // Create custom token for authentication
    const customToken = await adminAuth.createCustomToken(bestMatch.userId, {
      loginMethod: autoLogin ? 'auto_face_recognition' : 'manual_face_recognition',
      similarity: bestMatch.similarity,
      confidence: bestMatch.confidence,
      timestamp: Date.now()
    });

    // Log successful face login
    await adminDb.collection('face_login_logs').add({
      userId: bestMatch.userId,
      username: bestMatch.userData.username,
      similarity: bestMatch.similarity,
      confidence: bestMatch.confidence,
      loginType: autoLogin ? 'auto' : 'manual',
      timestamp: new Date(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    return NextResponse.json({
      token: customToken,
      user: {
        id: bestMatch.userId,
        username: bestMatch.userData.username,
        email: bestMatch.userData.email,
        userType: bestMatch.userData.userType
      },
      similarity: bestMatch.similarity,
      confidence: bestMatch.confidence,
      loginType: autoLogin ? 'auto' : 'manual'
    });

  } catch (error) {
    console.error('Enhanced face login error:', error);
    return NextResponse.json(
      { message: 'Face login failed. Please try again.' },
      { status: 500 }
    );
  }
}