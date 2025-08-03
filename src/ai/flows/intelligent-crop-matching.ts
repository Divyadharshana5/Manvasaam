'use server';

/**
 * @fileOverview An AI agent for intelligent crop matching between buyers and farmers.
 *
 * - intelligentCropMatching - A function that handles the crop matching process.
 * - IntelligentCropMatchingInput - The input type for the intelligentCropMatching function.
 * - IntelligentCropMatchingOutput - The return type for the intelligentCropMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentCropMatchingInputSchema = z.object({
  cropType: z.string().describe('The type of crop the buyer is looking for.'),
  location: z.string().describe('The location of the buyer.'),
  quantity: z.number().describe('The quantity of the crop the buyer needs.'),
  maxPrice: z.number().describe('The maximum price the buyer is willing to pay per unit.'),
});
export type IntelligentCropMatchingInput = z.infer<typeof IntelligentCropMatchingInputSchema>;

const IntelligentCropMatchingOutputSchema = z.object({
  matchedFarmers: z
    .array(
      z.object({
        farmerId: z.string().describe('The ID of the farmer.'),
        distance: z.number().describe('The distance between the farmer and the buyer in KM.'),
        price: z.number().describe('The price per unit offered by the farmer.'),
        availableQuantity: z.number().describe('The available quantity from the farmer.'),
      })
    )
    .describe('A list of farmers that match the buyer request, with relevant details.'),
});
export type IntelligentCropMatchingOutput = z.infer<typeof IntelligentCropMatchingOutputSchema>;

export async function intelligentCropMatching(input: IntelligentCropMatchingInput): Promise<IntelligentCropMatchingOutput> {
  return intelligentCropMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentCropMatchingPrompt',
  input: {schema: IntelligentCropMatchingInputSchema},
  output: {schema: IntelligentCropMatchingOutputSchema},
  prompt: `You are an AI assistant helping a buyer find farmers who have the crops they need.

The buyer is looking for the following:

Crop Type: {{{cropType}}}
Location: {{{location}}}
Quantity: {{{quantity}}}
Maximum Price: {{{maxPrice}}}

Based on this information, suggest potential farmers who have the crops the buyer needs, considering factors like location, quantity, and price.

Return the matched farmers in the following JSON format:

{{json schema=IntelligentCropMatchingOutputSchema}}`,
});

const intelligentCropMatchingFlow = ai.defineFlow(
  {
    name: 'intelligentCropMatchingFlow',
    inputSchema: IntelligentCropMatchingInputSchema,
    outputSchema: IntelligentCropMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
