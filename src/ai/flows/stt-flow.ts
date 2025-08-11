
'use server';
/**
 * @fileOverview A speech-to-text AI flow.
 *
 * - speechToText - A function that transcribes audio to text.
 * - SpeechToTextInputSchema - The input schema for the speechToText function.
 * - SpeechToTextOutputSchema - The output schema for the speechToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe("The language of the audio recording (e.g., 'English', 'Tamil')."),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SttOutputSchema = z.object({
  transcript: z.string().describe("The transcribed text from the audio."),
  intent: z.enum(['navigate', 'faq', 'none']).describe("The user's intent."),
  pageKey: z.enum(['restaurantRegistration', 'farmerCustomerLogin', 'hubLogin', 'faq', 'none']).optional().describe("The key for the page to navigate to (e.g., 'restaurantRegistration', 'faq')."),
});

export const SpeechToTextOutputSchema = SttOutputSchema;
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;


const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async ({ audioDataUri, language }) => {

    const languageInstruction = language ? `The user is speaking in ${language}.` : '';

    const { output } = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: [
        { media: { url: audioDataUri } },
        { text: `You are a navigation assistant for the Manvaasam application. Your task is to transcribe the user's audio and determine if they want to navigate to a specific page.
        
        ${languageInstruction}

        Analyze the user's speech and determine the navigation intent, responding in the specified JSON format.
        - If the user wants to go to the Restaurant Registration page, set intent to 'navigate' and pageKey to 'restaurantRegistration'.
        - If the user wants to go to the Farmer or Customer Login page, set intent to 'navigate' and pageKey to 'farmerCustomerLogin'.
        - If the user wants to go to the Hub Login page, set intent to 'navigate' and pageKey to 'hubLogin'.
        - If the user is asking a general question or wants help, set intent to 'faq' and pageKey to 'faq'.
        - If the user's intent is unclear or doesn't match any navigation commands, set intent to 'none' and pageKey to 'none'.
        ` },
      ],
      config: {
        temperature: 0.1, // Lower temperature for more deterministic transcription
      },
      output: {
        schema: SttOutputSchema
      }
    });

    if (!output) {
      throw new Error("AI failed to process the audio.");
    }

    return output;
  }
);

export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}
