'use server';
/**
 * @fileOverview Enhanced face detection flow with advanced features.
 * Provides comprehensive face analysis including quality, positioning, and authentication readiness.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EnhancedFaceDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe("A photo as a data URI with MIME type and Base64 encoding."),
  purpose: z.enum(['registration', 'authentication', 'verification']).optional()
    .describe("The purpose of face detection to optimize analysis."),
});
export type EnhancedFaceDetectionInput = z.infer<typeof EnhancedFaceDetectionInputSchema>;

export const EnhancedFaceDetectionOutputSchema = z.object({
  faceDetected: z.boolean().describe("Whether a human face was detected."),
  faceCount: z.number().describe("Number of faces detected in the image."),
  quality: z.enum(['excellent', 'good', 'fair', 'poor']).describe("Overall quality of the face image."),
  positioning: z.object({
    centered: z.boolean().describe("Whether the face is well-centered."),
    frontFacing: z.boolean().describe("Whether the face is facing forward."),
    eyesVisible: z.boolean().describe("Whether both eyes are clearly visible."),
    mouthVisible: z.boolean().describe("Whether the mouth is clearly visible."),
  }).describe("Face positioning and visibility details."),
  lighting: z.enum(['excellent', 'good', 'fair', 'poor']).describe("Lighting quality assessment."),
  clarity: z.enum(['excellent', 'good', 'fair', 'poor']).describe("Image clarity and sharpness."),
  suitableForAuth: z.boolean().describe("Whether the image is suitable for authentication."),
  feedback: z.string().describe("Helpful feedback for improving the photo."),
  confidence: z.number().min(0).max(1).describe("Confidence level of the analysis."),
});
export type EnhancedFaceDetectionOutput = z.infer<typeof EnhancedFaceDetectionOutputSchema>;

const enhancedFaceDetectionPrompt = ai.definePrompt({
    name: 'enhancedFaceDetectionPrompt',
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

Image: {{media url=photoDataUri}}`
});

const enhancedFaceDetectionFlow = ai.defineFlow(
  {
    name: 'enhancedFaceDetectionFlow',
    inputSchema: EnhancedFaceDetectionInputSchema,
    outputSchema: EnhancedFaceDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await enhancedFaceDetectionPrompt(input);
    return output!;
  }
);

export async function enhancedDetectFace(input: EnhancedFaceDetectionInput): Promise<EnhancedFaceDetectionOutput> {
  return enhancedFaceDetectionFlow(input);
}

// Face comparison for authentication
export const FaceComparisonInputSchema = z.object({
  registeredFaceDataUri: z.string().describe("The registered face image data URI."),
  currentFaceDataUri: z.string().describe("The current face image data URI for comparison."),
});
export type FaceComparisonInput = z.infer<typeof FaceComparisonInputSchema>;

export const FaceComparisonOutputSchema = z.object({
  isMatch: z.boolean().describe("Whether the faces match."),
  confidence: z.number().min(0).max(1).describe("Confidence level of the match."),
  similarity: z.number().min(0).max(1).describe("Similarity score between faces."),
  feedback: z.string().describe("Feedback about the comparison."),
});
export type FaceComparisonOutput = z.infer<typeof FaceComparisonOutputSchema>;

const faceComparisonPrompt = ai.definePrompt({
    name: 'faceComparisonPrompt',
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
Set isMatch to true only if you're confident it's the same person.`
});

const faceComparisonFlow = ai.defineFlow(
  {
    name: 'faceComparisonFlow',
    inputSchema: FaceComparisonInputSchema,
    outputSchema: FaceComparisonOutputSchema,
  },
  async (input) => {
    const { output } = await faceComparisonPrompt(input);
    return output!;
  }
);

export async function compareFaces(input: FaceComparisonInput): Promise<FaceComparisonOutput> {
  return faceComparisonFlow(input);
}