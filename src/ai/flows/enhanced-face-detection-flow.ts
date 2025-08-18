"use server";
/**
 * @fileOverview Enhanced face detection flow with advanced features.
 * Provides comprehensive face analysis including quality, positioning, and authentication readiness.
 */

import { ai } from "@/ai/genkit";
import {
  EnhancedFaceDetectionInputSchema,
  EnhancedFaceDetectionOutputSchema,
  EnhancedFaceDetectionInput,
  EnhancedFaceDetectionOutput,
  FaceComparisonInputSchema,
  FaceComparisonOutputSchema,
  FaceComparisonInput,
  FaceComparisonOutput,
} from "./enhanced-face-detection-types";

const enhancedFaceDetectionPrompt = ai.definePrompt({
  name: "enhancedFaceDetectionPrompt",
  input: { schema: EnhancedFaceDetectionInputSchema },
  output: { schema: EnhancedFaceDetectionOutputSchema },
  prompt: `You are an advanced face detection and analysis system. Analyze the provided image comprehensively.

Purpose: {{purpose}}

Analyze the image for:
1. Face Detection: Count and identify human faces
2. Quality Assessment: Evaluate image quality, lighting, and clarity
3. Positioning: Check if face is centered, front-facing, with visible features
4. Authentication Readiness: Determine if suitable for biometric authentication

Provide detailed feedback to help users capture better photos.

Quality Criteria:
- Excellent: Perfect lighting, sharp focus, ideal positioning
- Good: Minor issues but still very usable
- Fair: Some issues that might affect recognition
- Poor: Significant problems requiring retake

Image: {{media url=photoDataUri}}`,
});

const enhancedFaceDetectionFlow = ai.defineFlow(
  {
    name: "enhancedFaceDetectionFlow",
    inputSchema: EnhancedFaceDetectionInputSchema,
    outputSchema: EnhancedFaceDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await enhancedFaceDetectionPrompt(input);
    return output!;
  }
);

export async function enhancedDetectFace(
  input: EnhancedFaceDetectionInput
): Promise<EnhancedFaceDetectionOutput> {
  return enhancedFaceDetectionFlow(input);
}

// Face comparison for authentication

const faceComparisonPrompt = ai.definePrompt({
  name: "faceComparisonPrompt",
  input: { schema: FaceComparisonInputSchema },
  output: { schema: FaceComparisonOutputSchema },
  prompt: `Compare these two face images to determine if they show the same person.

Registered Face: {{media url=registeredFaceDataUri}}
Current Face: {{media url=currentFaceDataUri}}

Analyze:
1. Facial structure and bone structure
2. Eye shape, size, and positioning
3. Nose shape and size
4. Mouth and lip characteristics
5. Overall facial proportions
6. Unique identifying features

Consider variations due to:
- Lighting differences
- Angle variations
- Expression changes
- Time passage
- Image quality

Provide a confidence score and similarity rating.
Set isMatch to true only if you're confident it's the same person.`,
});

const faceComparisonFlow = ai.defineFlow(
  {
    name: "faceComparisonFlow",
    inputSchema: FaceComparisonInputSchema,
    outputSchema: FaceComparisonOutputSchema,
  },
  async (input) => {
    const { output } = await faceComparisonPrompt(input);
    return output!;
  }
);

export async function compareFaces(
  input: FaceComparisonInput
): Promise<FaceComparisonOutput> {
  return faceComparisonFlow(input);
}
