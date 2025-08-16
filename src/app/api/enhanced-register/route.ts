import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { enhancedDetectFace } from '@/ai/flows/enhanced-face-detection-flow';

export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, password, userType, photoDataUri } = await request.json();

    // Validate required fields
    if (!username || !email || !phone || !password || !userType) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Enhanced face validation for farmers
    if (userType === 'farmer' && photoDataUri) {
      try {
        const faceAnalysis = await enhancedDetectFace({
          photoDataUri,
          purpose: 'registration'
        });

        if (!faceAnalysis.faceDetected) {
          return NextResponse.json(
            { message: 'No face detected in the photo. Please capture a clear photo.' },
            { status: 400 }
          );
        }

        if (faceAnalysis.faceCount > 1) {
          return NextResponse.json(
            { message: 'Multiple faces detected. Please ensure only one person is in the photo.' },
            { status: 400 }
          );
        }

        if (!faceAnalysis.suitableForAuth) {
          return NextResponse.json(
            { message: `Photo quality insufficient: ${faceAnalysis.feedback}` },
            { status: 400 }
          );
        }

        // Store enhanced analysis data
        const enhancedUserData = {
          username,
          email,
          phone,
          userType,
          photoDataUri,
          faceAnalysis: {
            quality: faceAnalysis.quality,
            positioning: faceAnalysis.positioning,
            lighting: faceAnalysis.lighting,
            clarity: faceAnalysis.clarity,
            confidence: faceAnalysis.confidence,
            registrationDate: new Date(),
          },
          createdAt: new Date(),
          lastLogin: null,
          loginCount: 0,
          securityLevel: 'enhanced'
        };

        // Check for existing users
        const existingUserQuery = await adminDb
          .collection('users')
          .where('email', '==', email)
          .get();

        if (!existingUserQuery.empty) {
          return NextResponse.json(
            { message: 'User with this email already exists.' },
            { status: 409 }
          );
        }

        // Create Firebase user
        const userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: username,
          phoneNumber: `+91${phone}`,
        });

        // Store enhanced user data in Firestore
        await adminDb.collection('users').doc(userRecord.uid).set(enhancedUserData);

        // Log registration
        await adminDb.collection('registration_logs').add({
          userId: userRecord.uid,
          username,
          email,
          userType,
          registrationMethod: photoDataUri ? 'enhanced_face_registration' : 'standard',
          faceQuality: faceAnalysis?.quality,
          timestamp: new Date(),
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        });

        return NextResponse.json({
          message: 'Enhanced registration successful!',
          userId: userRecord.uid,
          securityLevel: 'enhanced',
          faceQuality: faceAnalysis.quality
        });

      } catch (faceError) {
        console.error('Face analysis error:', faceError);
        return NextResponse.json(
          { message: 'Face analysis failed. Please try again with a clearer photo.' },
          { status: 400 }
        );
      }
    } else {
      // Standard registration for customers
      const userData = {
        username,
        email,
        phone,
        userType,
        createdAt: new Date(),
        lastLogin: null,
        loginCount: 0,
        securityLevel: 'standard'
      };

      // Check for existing users
      const existingUserQuery = await adminDb
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!existingUserQuery.empty) {
        return NextResponse.json(
          { message: 'User with this email already exists.' },
          { status: 409 }
        );
      }

      // Create Firebase user
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: username,
        phoneNumber: `+91${phone}`,
      });

      // Store user data in Firestore
      await adminDb.collection('users').doc(userRecord.uid).set(userData);

      return NextResponse.json({
        message: 'Registration successful!',
        userId: userRecord.uid,
        securityLevel: 'standard'
      });
    }

  } catch (error: any) {
    console.error('Enhanced registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      );
    }
    
    if (error.code === 'auth/phone-number-already-exists') {
      return NextResponse.json(
        { message: 'User with this phone number already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}