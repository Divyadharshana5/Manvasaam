import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db(); // Use your database name if you have one, e.g., client.db("manvaasam")

    const usersCollection = db.collection("users");
    const result = await usersCollection.insertOne(data);

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
  }
}
