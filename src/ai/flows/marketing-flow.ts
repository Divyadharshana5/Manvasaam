
'use server';
/**
 * @fileOverview A marketing content generation AI flow.
 *
 * - generateMarketingPost - A function that generates a social media post and an image.
 * - MarketingPostInputSchema - The input schema for the generateMarketingPost function.
 * - MarketingPostOutputSchema - The output schema for the generateMarketingPost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MarketingPostInputSchema = z.string();
export type MarketingPostInput = z.infer<typeof MarketingPostInputSchema>;

export const MarketingPostOutputSchema = z.object({
  post: z.string().describe("The generated social media post copy. It should be engaging and exciting."),
  image: z.string().describe("A data URI for the generated image."),
});
export type MarketingPostOutput = z.infer<typeof MarketingPostOutputSchema>;

const marketingPostFlow = ai.defineFlow(
  {
    name: 'marketingPostFlow',
    inputSchema: MarketingPostInputSchema,
    outputSchema: MarketingPostOutputSchema,
  },
  async (prompt) => {
    
    // Generate the image and the post text in parallel
    const [imageGenerationPromise, textGenerationPromise] = [
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `A vibrant, high-quality marketing photograph for a social media post about: ${prompt}`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        }),
        ai.generate({
            model: 'gemini-1.5-flash-latest',
            prompt: `You are a marketing expert. Write a short, exciting, and engaging social media post based on the following prompt. Use emojis where appropriate. Do not use hashtags.

            Prompt: "${prompt}"
            
            Post:`,
            config: {
                temperature: 0.8,
            }
        })
    ];

    const [imageResult, textResult] = await Promise.all([imageGenerationPromise, textGenerationPromise]);

    const imageUrl = imageResult.media?.url;
    const postText = textResult.text;

    if (!imageUrl || !postText) {
        throw new Error("Failed to generate either image or text for the marketing post.");
    }
    
    return {
      post: postText,
      image: imageUrl,
    };
  }
);

export async function generateMarketingPost(input: MarketingPostInput): Promise<MarketingPostOutput> {
  return marketingPostFlow(input);
}
