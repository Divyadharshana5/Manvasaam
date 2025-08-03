'use server';
/**
 * @fileOverview Provides crop recommendations based on a user-provided description.
 *
 * - recommendCropsFromDescription - A function that takes a crop description and returns recommended crop types.
 * - RecommendCropsFromDescriptionInput - The input type for the recommendCropsFromDescription function.
 * - RecommendCropsFromDescriptionOutput - The return type for the recommendCropsFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCropsFromDescriptionInputSchema = z.object({
  description: z.string().describe('A description of the crop being grown.'),
});
export type RecommendCropsFromDescriptionInput = z.infer<typeof RecommendCropsFromDescriptionInputSchema>;

const RecommendCropsFromDescriptionOutputSchema = z.object({
  crops: z.array(z.string()).describe('An array of recommended crop types.'),
});
export type RecommendCropsFromDescriptionOutput = z.infer<typeof RecommendCropsFromDescriptionOutputSchema>;

export async function recommendCropsFromDescription(input: RecommendCropsFromDescriptionInput): Promise<RecommendCropsFromDescriptionOutput> {
  return recommendCropsFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropsFromDescriptionPrompt',
  input: {schema: RecommendCropsFromDescriptionInputSchema},
  output: {schema: RecommendCropsFromDescriptionOutputSchema},
  prompt: `You are a helpful farming assistant. Given the following description of a crop, suggest the most likely crop types. Return as a JSON array of strings.

Description: {{{description}}}`,
});

const recommendCropsFromDescriptionFlow = ai.defineFlow(
  {
    name: 'recommendCropsFromDescriptionFlow',
    inputSchema: RecommendCropsFromDescriptionInputSchema,
    outputSchema: RecommendCropsFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
