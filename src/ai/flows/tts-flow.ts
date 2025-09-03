'use server';
/**
 * @fileOverview A text-to-speech AI flow.
 *
 * - textToSpeech - A function that converts text to speech.
 */

require('dotenv').config();
import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const apiKey = process.env.GEMINI_API_KEY;
const hasGeminiKey = !!apiKey;

const TextToSpeechInputSchema = z.object({
  text: z.string().describe("The text to convert to speech"),
  language: z.string().optional().describe("The language for speech synthesis")
});
type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The base64 encoded WAV audio data URI."),
});
type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = hasGeminiKey ? ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, language }) => {
    // Map languages to appropriate voice names
    const voiceMap: Record<string, string> = {
      'English': 'Algenib',
      'Tamil': 'Algenib',
      'Malayalam': 'Algenib', 
      'Telugu': 'Algenib',
      'Hindi': 'Algenib',
      'Kannada': 'Algenib',
      'Bengali': 'Algenib',
      'Arabic': 'Algenib',
      'Urdu': 'Algenib',
      'Srilanka': 'Algenib'
    };
    
    const voiceName = voiceMap[language || 'English'] || 'Algenib';
    
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('No audio media returned from the model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
) : null;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  if (!hasGeminiKey || !textToSpeechFlow) {
    // Return empty audio data URI for demo mode
    return {
      audioDataUri: ""
    };
  }
  return textToSpeechFlow(input);
}
