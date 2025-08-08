
'use server';
/**
 * @fileOverview An AI flow to understand user navigation intents from text.
 *
 * - understandNavigation - A function that interprets text to find a navigation goal.
 * - NavigationInputSchema - The input schema for the understandNavigation function.
 * - NavigationOutputSchema - The output schema for the understandNavigation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { translations } from '@/context/language-context';


export const NavigationInputSchema = z.object({
  text: z.string().describe("The user's transcribed voice command."),
  language: z.string().describe("The language the user is speaking in (e.g., 'English', 'Tamil')."),
});
export type NavigationInput = z.infer<typeof NavigationInputSchema>;

export const NavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'faq', 'none']).describe("The user's intent."),
  page: z.string().optional().describe("The page to navigate to (e.g., '/login/restaurant')."),
  confirmationMessage: z.string().optional().describe("The message to confirm with the user before navigating."),
});
export type NavigationOutput = z.infer<typeof NavigationOutputSchema>;


const navigationPrompt = ai.definePrompt({
  name: 'navigationPrompt',
  input: { schema: NavigationInputSchema },
  output: { schema: NavigationOutputSchema },
  prompt: `You are a navigation assistant for the Manvaasam application. Your task is to understand the user's request and determine if they want to navigate to a specific page. The application supports multiple languages.

The user is speaking in: {{{language}}}
The user said: "{{{text}}}"

Supported Pages and their keywords:
- Restaurant Registration: '/login/restaurant' (Keywords: "restaurant register", "உணவகம் பதிவு", "register restaurant", "பதிவு பக்கம்")
- Farmer/Customer Login: '/login/farmer-customer' (Keywords: "farmer login", "customer login", "விவசாயி உள்நுழைவு", "வாடிக்கையாளர் உள்நுழைவு")
- Hub Login: '/login/hub' (Keywords: "hub login", "hub portal", "மையம் உள்நுழைவு")
- FAQ: '/dashboard/faq' (Keywords: "faq", "help", "கேள்விகள்", "உதவி")

Based on the user's text and language, determine the navigation intent.

- If the user wants to navigate to the restaurant registration page, set intent to 'navigate', page to '/login/restaurant', and confirmationMessage to "It sounds like you want to go to the restaurant registration page. Should I take you there?".
- If the user is asking a question that can be answered by the FAQ page, set intent to 'faq', page to '/dashboard/faq', and confirmationMessage to "It sounds like you have a question. Would you like me to take you to the FAQ page?".
- If the user's intent is unclear or doesn't match any navigation commands, set intent to 'none'.

IMPORTANT: Respond with the confirmationMessage in the same language the user is speaking. Here are some translations for the confirmation messages:
- English: "It sounds like you want to go to the {pageName} page. Should I take you there?"
- Tamil: "நீங்கள் {pageName} பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. நான் உங்களை அங்கு அழைத்துச் செல்லட்டுமா?"
- Malayalam: "നിങ്ങൾ {pageName} പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ അവിടെ കൊണ്ടുപോകണോ?"
- Telugu: "మీరు {pageName} పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను మిమ్మల్ని అక్కడికి తీసుకెళ్లాలా?"
- Hindi: "ऐसा लगता है कि आप {pageName} पृष्ठ पर जाना चाहते हैं। क्या मैं आपको वहां ले जाऊं?"
- Kannada: "ನೀವು {pageName} ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು ಅಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯಬೇಕೇ?"
- Bengali: "মনে হচ্ছে আপনি {pageName} পৃষ্ঠাতে যেতে চান। আমি কি আপনাকে সেখানে নিয়ে যাব?"
- Arabic: "يبدو أنك تريد الذهاب إلى صفحة {pageName}. هل يجب أن آخذك إلى هناك؟"
- Urdu: "ایسا لگتا ہے کہ آپ {pageName} صفحہ پر جانا چاہتے ہیں۔ کیا میں آپ کو وہاں لے جاؤں؟"
- Srilanka: "ඔබට {pageName} පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඔබව එතැනට ගෙන යා යුතුද?"

Replace {pageName} with the appropriate page name in the chosen language.
Restaurant Registration Page: உணவகம் பதிவு பக்கம் (Tamil), റെസ്റ്റോറന്റ് രജിസ്ട്രേഷൻ പേജ് (Malayalam), etc.
FAQ Page: அடிக்கடி கேட்கப்படும் கேள்விகள் (Tamil), പതിവുചോദ്യങ്ങൾ (Malayalam), etc.
`,
});


const understandNavigationFlow = ai.defineFlow(
  {
    name: 'understandNavigationFlow',
    inputSchema: NavigationInputSchema,
    outputSchema: NavigationOutputSchema,
  },
  async (input) => {
    const { output } = await navigationPrompt(input);
    return output!;
  }
);

export async function understandNavigation(input: NavigationInput): Promise<NavigationOutput> {
  return understandNavigationFlow(input);
}
