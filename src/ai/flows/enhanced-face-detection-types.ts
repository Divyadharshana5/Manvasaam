import { z } from "genkit";

export const EnhancedFaceDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe("A photo as a data URI with MIME type and Base64 encoding."),
  purpose: z
    .enum(["registration", "authentication", "verification"])
    .optional()
    .describe("The purpose of face detection to optimize analysis."),
});
export type EnhancedFaceDetectionInput = z.infer<
  typeof EnhancedFaceDetectionInputSchema
>;

export const EnhancedFaceDetectionOutputSchema = z.object({
  faceDetected: z.boolean().describe("Whether a human face was detected."),
  faceCount: z.number().describe("Number of faces detected in the image."),
  quality: z
    .enum(["excellent", "good", "fair", "poor"])
    .describe("Overall quality of the face image."),
  positioning: z
    .object({
      centered: z.boolean().describe("Whether the face is well-centered."),
      frontFacing: z.boolean().describe("Whether the face is facing forward."),
      eyesVisible: z
        .boolean()
        .describe("Whether both eyes are clearly visible."),
      mouthVisible: z
        .boolean()
        .describe("Whether the mouth is clearly visible."),
    })
    .describe("Face positioning and visibility details."),
  lighting: z
    .enum(["excellent", "good", "fair", "poor"])
    .describe("Lighting quality assessment."),
  clarity: z
    .enum(["excellent", "good", "fair", "poor"])
    .describe("Image clarity and sharpness."),
  suitableForAuth: z
    .boolean()
    .describe("Whether the image is suitable for authentication."),
  feedback: z.string().describe("Helpful feedback for improving the photo."),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence level of the analysis."),
});
export type EnhancedFaceDetectionOutput = z.infer<
  typeof EnhancedFaceDetectionOutputSchema
>;

export const FaceComparisonInputSchema = z.object({
  registeredFaceDataUri: z
    .string()
    .describe("The registered face image data URI."),
  currentFaceDataUri: z
    .string()
    .describe("The current face image data URI for comparison."),
});
export type FaceComparisonInput = z.infer<typeof FaceComparisonInputSchema>;

export const FaceComparisonOutputSchema = z.object({
  isMatch: z.boolean().describe("Whether the faces match."),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence level of the match."),
  similarity: z
    .number()
    .min(0)
    .max(1)
    .describe("Similarity score between faces."),
  feedback: z.string().describe("Feedback about the comparison."),
});
export type FaceComparisonOutput = z.infer<typeof FaceComparisonOutputSchema>;
