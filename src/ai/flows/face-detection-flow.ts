
'use server';
/**
 * @fileOverview A flow to detect a face in an image.
 *
 * - detectFace - A function that checks if an image contains a face.
 * - FaceDetectionInputSchema - The input schema for the detectFace function.
 * - FaceDetectionOutputSchema - The output schema for the detectFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FaceDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FaceDetectionInput = z.infer<typeof FaceDetectionInputSchema>;

export const FaceDetectionOutputSchema = z.object({
  faceDetected: z.boolean().describe("Whether or not a human face was detected in the image."),
});
export type FaceDetectionOutput = z.infer<typeof FaceDetectionOutputSchema>;

const detectFacePrompt = ai.definePrompt({
    name: 'faceDetectionPrompt',
    input: { schema: FaceDetectionInputSchema },
    output: { schema: FaceDetectionOutputSchema },
    prompt: `Analyze the provided image and determine if it contains a human face. 
    
    Set the faceDetected field to true if a face is clearly visible, and false otherwise.
    
    Image: {{media url=photoDataUri}}`
});


const detectFaceFlow = ai.defineFlow(
  {
    name: 'detectFaceFlow',
    inputSchema: FaceDetectionInputSchema,
    outputSchema: FaceDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await detectFacePrompt(input);
    return output!;
  }
);

export async function detectFace(input: FaceDetectionInput): Promise<FaceDetectionOutput> {
  return detectFaceFlow(input);
}
