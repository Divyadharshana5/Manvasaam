import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { compareFaces } from '@/ai/flows/enhanced-face-detection-flow';

export async function POST(request: NextRequest) {
  try {
    const { photoDataUri, userType, analysis } = await request.json();

    if (!photoDataUri || !userType) {
      return NextResponse.json(
        { message: 'Photo and user type are required.' },
        { status: 400 }
      );
    }

    // Additional validation based on analysis
    if (analysis && !analysis.suitableForAuth) {
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
    const SIMILARITY_THRESHOLD = 0.75; // Minimum similarity for authentication

    // Compare with all registered faces
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      try {
        const comparisonResult = await compareFaces({
          registeredFaceDataUri: userData.photoDataUri,
          currentFaceDataUri: photoDataUri,
        });

        console.log(`Comparison with user ${userData.username}: similarity=${comparisonResult.similarity}, confidence=${comparisonResult.confidence}`);

        if (comparisonResult.isMatch && 
            comparisonResult.similarity > highestSimilarity && 
            comparisonResult.similarity >= SIMILARITY_THRESHOLD &&
            comparisonResult.confidence >= 0.7) {
          
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
      return NextResponse.json(
        { message: 'Face not recognized. Please try again or use email login.' },
        { status: 401 }
      );
    }

    // Create custom token for authentication
    const customToken = await adminAuth.createCustomToken(bestMatch.userId, {
      loginMethod: 'face_recognition',
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
      confidence: bestMatch.confidence
    });

  } catch (error) {
    console.error('Enhanced face login error:', error);
    return NextResponse.json(
      { message: 'Face login failed. Please try again.' },
      { status: 500 }
    );
  }
}