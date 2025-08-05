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
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

export const SpeechToTextOutputSchema = z.object({
  transcript: z.string().describe("The transcribed text from the audio."),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;


const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async ({ audioDataUri }) => {
    const { text } = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: [
        { media: { url: audioDataUri } },
        { text: "Transcribe the audio. Respond only with the transcribed text." },
      ],
      config: {
        temperature: 0.1, // Lower temperature for more deterministic transcription
      }
    });

    return {
      transcript: text,
    };
  }
);

export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}
