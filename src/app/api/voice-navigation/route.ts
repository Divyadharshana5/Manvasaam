import { NextRequest, NextResponse } from "next/server";

// Import AI flows
async function speechToText(params: any) {
  try {
    const { speechToText } = await import("@/ai/flows/stt-flow");
    return speechToText(params);
  } catch (error) {
    console.error("STT import error:", error);
    return { transcript: "" };
  }
}

async function understandNavigation(params: any) {
  try {
    const { understandNavigation } = await import("@/ai/flows/navigation-flow");
    return understandNavigation(params);
  } catch (error) {
    console.error("Navigation import error:", error);
    return { shouldNavigate: false, message: "Not Found" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { audioDataUri, language } = await request.json();

    if (!audioDataUri) {
      return NextResponse.json(
        { error: "Audio data is required" },
        { status: 400 }
      );
    }

    // Convert speech to text
    const sttResult = await speechToText({
      audioDataUri,
      language: language || "English",
    });

    const { transcript } = sttResult;

    if (!transcript || transcript.trim() === "") {
      return NextResponse.json({
        success: false,
        message: "No speech detected",
      });
    }

    // Understand navigation intent
    const navResult = await understandNavigation({
      text: transcript,
      language: language || "English",
    });

    return NextResponse.json({
      success: true,
      transcript,
      shouldNavigate: navResult.shouldNavigate,
      pageKey: navResult.pageKey,
      message: navResult.message,
    });

  } catch (error) {
    console.error("Voice navigation error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Processing failed",
    });
  }
}