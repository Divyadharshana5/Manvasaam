
'use server';
/**
 * @fileOverview A speech-to-text AI flow.
 *
 * - speechToText - A function that transcribes audio to text.
 */

require('dotenv').config();
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const apiKey = process.env.GEMINI_API_KEY;
const hasGeminiKey = !!apiKey;

const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe("The language of the audio recording (e.g., 'English', 'Tamil')."),
});
type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SttOutputSchema = z.object({
  transcript: z.string().describe("The transcribed text from the audio."),
});

type SpeechToTextOutput = z.infer<typeof SttOutputSchema>;

const speechToTextFlow = hasGeminiKey ? ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SttOutputSchema,
  },
  async ({ audioDataUri, language }) => {
    const languageInstruction = language ? `The user is speaking in ${language}. Transcribe it accurately.` : 'Transcribe the following audio accurately.';

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        { media: { url: audioDataUri } },
        { text: languageInstruction },
      ],
      config: {
        temperature: 0.1,
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
) : null;

export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  if (!hasGeminiKey || !speechToTextFlow) {
    return {
      transcript: "Demo mode: Voice recognition not available. Please configure GEMINI_API_KEY to use this feature."
    };
  }
  return speechToTextFlow(input);
}