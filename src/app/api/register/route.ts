import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendRegistrationNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db(); 

    const usersCollection = db.collection("users");
    const result = await usersCollection.insertOne(data);

    // Send email notification, but don't block the response if it fails
    try {
        await sendRegistrationNotification(data);
    } catch (emailError: any) {
        console.error("Failed to send registration email:", emailError.message);
        // Do not return an error to the client, just log it.
        // The user registration was successful.
    }

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
  }
}
