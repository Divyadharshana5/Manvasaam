
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Check if Firebase is configured
    if (!adminDb) {
      // Return mock user data for demo mode
      const mockData: any = {
        uid: uid,
        userType: uid.includes('hub') ? 'hub' : uid.includes('retail') ? 'retail' : 'customer',
        username: uid.includes('hub') ? 'Hub Manager' : uid.includes('retail') ? 'Shop Owner' : 'Customer',
        email: uid.includes('hub') ? 'hub@demo.com' : uid.includes('retail') ? 'shop@demo.com' : 'customer@demo.com',
        mockMode: true
      };

      // Add retail-specific mock data if it's a retail user
      if (uid.includes('retail') || mockData.userType === 'retail') {
        mockData.shopName = 'Fresh Mart Grocery Store';
        mockData.shopType = 'Grocery & Fresh Produce';
        mockData.ownerName = 'Rajesh Kumar';
        mockData.phone = '+91 98765 43210';
        mockData.alternatePhone = '+91 98765 43211';
        mockData.address = '123, Market Street, Commercial Complex';
        mockData.city = 'Mumbai';
        mockData.state = 'Maharashtra';
        mockData.pincode = '400001';
        mockData.landmark = 'Near City Mall';
        mockData.gstNumber = '27ABCDE1234F1Z5';
        mockData.licenseNumber = 'FL-2024-001234';
        mockData.establishedYear = '2018';
        mockData.businessHours = '8:00 AM - 10:00 PM';
        mockData.website = 'www.freshmart.com';
        mockData.description = 'Your trusted neighborhood grocery store providing fresh produce, daily essentials, and quality products at competitive prices.';
        mockData.specialties = 'Fresh Vegetables, Organic Products, Daily Essentials, Local Produce';
        mockData.paymentMethods = ['Cash', 'UPI', 'Card', 'Digital Wallet'];
        mockData.deliveryRadius = '5 km';
        mockData.verified = true;
      }

      return NextResponse.json(mockData, { status: 200 });
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Ensure we don't send back sensitive data if any were stored
    const { password, ...safeUserData } = userData || {};

    return NextResponse.json(safeUserData, { status: 200 });

  } catch (error: any) {
    console.error("API Get User Error:", error);
    return NextResponse.json({ message: "Failed to fetch user data", error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    
    // Check if Firebase is configured
    if (!adminDb) {
      // In mock mode, just return success
      console.log("Mock mode: Profile update request received for user:", uid);
      console.log("Mock mode: Update data:", body);
      return NextResponse.json({ 
        message: "Profile updated successfully (mock mode)",
        mockMode: true 
      }, { status: 200 });
    }
    
    const allowedUpdates: { [key: string]: any } = {};
    const authUpdates: { [key: string]: any } = {};

    // Handle all possible fields, including empty strings
    if (body.username !== undefined) allowedUpdates.username = body.username;
    if (body.phone !== undefined) allowedUpdates.phone = body.phone;
    if (body.branchName !== undefined) allowedUpdates.branchName = body.branchName;
    if (body.location !== undefined) allowedUpdates.location = body.location;
    if (body.bio !== undefined) allowedUpdates.bio = body.bio;
    if (body.website !== undefined) allowedUpdates.website = body.website;
    if (body.company !== undefined) allowedUpdates.company = body.company;
    if (body.role !== undefined) allowedUpdates.role = body.role;
    
    // Retail shop profile fields
    if (body.shopName !== undefined) allowedUpdates.shopName = body.shopName;
    if (body.ownerName !== undefined) allowedUpdates.ownerName = body.ownerName;
    if (body.shopType !== undefined) allowedUpdates.shopType = body.shopType;
    if (body.alternatePhone !== undefined) allowedUpdates.alternatePhone = body.alternatePhone;
    if (body.address !== undefined) allowedUpdates.address = body.address;
    if (body.city !== undefined) allowedUpdates.city = body.city;
    if (body.state !== undefined) allowedUpdates.state = body.state;
    if (body.pincode !== undefined) allowedUpdates.pincode = body.pincode;
    if (body.landmark !== undefined) allowedUpdates.landmark = body.landmark;
    if (body.gstNumber !== undefined) allowedUpdates.gstNumber = body.gstNumber;
    if (body.licenseNumber !== undefined) allowedUpdates.licenseNumber = body.licenseNumber;
    if (body.establishedYear !== undefined) allowedUpdates.establishedYear = body.establishedYear;
    if (body.businessHours !== undefined) allowedUpdates.businessHours = body.businessHours;
    if (body.description !== undefined) allowedUpdates.description = body.description;
    if (body.specialties !== undefined) allowedUpdates.specialties = body.specialties;
    if (body.deliveryRadius !== undefined) allowedUpdates.deliveryRadius = body.deliveryRadius;
    if (body.paymentMethods !== undefined) allowedUpdates.paymentMethods = body.paymentMethods;
    
    // Farmer profile fields
    if (body.farmName !== undefined) allowedUpdates.farmName = body.farmName;
    if (body.farmSize !== undefined) allowedUpdates.farmSize = body.farmSize;
    if (body.farmingType !== undefined) allowedUpdates.farmingType = body.farmingType;
    if (body.farmingMethods !== undefined) allowedUpdates.farmingMethods = body.farmingMethods;
    if (body.certifications !== undefined) allowedUpdates.certifications = body.certifications;
    
    // Transport profile fields
    if (body.companyName !== undefined) allowedUpdates.companyName = body.companyName;
    if (body.fleetSize !== undefined) allowedUpdates.fleetSize = body.fleetSize;
    if (body.vehicleTypes !== undefined) allowedUpdates.vehicleTypes = body.vehicleTypes;
    if (body.serviceAreas !== undefined) allowedUpdates.serviceAreas = body.serviceAreas;
    if (body.operatingHours !== undefined) allowedUpdates.operatingHours = body.operatingHours;
    if (body.photoURL !== undefined) {
        allowedUpdates.photoURL = body.photoURL;
        if (adminAuth) {
          authUpdates.photoURL = body.photoURL;
        }
    }
    if (body.email !== undefined) {
        allowedUpdates.email = body.email;
        if (adminAuth) {
          authUpdates.email = body.email;
        }
    }

    if (Object.keys(allowedUpdates).length === 0) {
        return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    // Add timestamp for last update
    allowedUpdates.updatedAt = new Date().toISOString();

    // Update Firestore
    await adminDb.collection("users").doc(uid).update(allowedUpdates);

    // Update Firebase Auth user if needed
    if (Object.keys(authUpdates).length > 0 && adminAuth) {
        await adminAuth.updateUser(uid, authUpdates);
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("API Update User Error:", error);
    let message = "Failed to update profile";
    if (error.code === 'auth/email-already-exists') {
        message = "An account with this email already exists.";
    } else if (error.code === 'auth/invalid-email') {
        message = "The new email address is not valid.";
    }
    return NextResponse.json({ message: message, error: error.message }, { status: 500 });
  }
}

    