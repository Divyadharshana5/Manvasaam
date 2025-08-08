
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

// Define translations for confirmation messages.
const translations: Record<string, Record<string, string>> = {
  restaurantRegistration: {
    English: "It sounds like you want to go to the Restaurant Registration page. Should I take you there?",
    Tamil: "நீங்கள் உணவகம் பதிவு பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. நான் உங்களை அங்கு அழைத்துச் செல்லட்டுமா?",
    Malayalam: "നിങ്ങൾ റെസ്റ്റോറന്റ് രജിസ്ട്രേഷൻ പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ അവിടെ കൊണ്ടുപോകണോ?",
    Telugu: "మీరు రెస్టారెంట్ రిజిస్ట్రేషన్ పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను మిమ్మల్ని అక్కడికి తీసుకెళ్లాలా?",
    Hindi: "ऐसा लगता है कि आप रेस्टोरेंट पंजीकरण पृष्ठ पर जाना चाहते हैं। क्या मैं आपको वहां ले जाऊं?",
    Kannada: "ನೀವು ರೆಸ್ಟೋರೆಂಟ್ ನೋಂದಣಿ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು ಅಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনি রেস্টুরেন্ট রেজিস্ট্রেশন পৃষ্ঠাতে যেতে চান। আমি কি আপনাকে সেখানে নিয়ে যাব?",
    Arabic: "يبدو أنك تريد الذهاب إلى صفحة تسجيل المطعم. هل يجب أن آخذك إلى هناك؟",
    Urdu: "ایسا لگتا ہے کہ آپ ریسٹورنٹ رجسٹریشن صفحہ پر جانا چاہتے ہیں۔ کیا میں آپ کو وہاں لے جاؤں؟",
    Srilanka: "ඔබට ආපනශාලා ලියාපදිංචි කිරීමේ පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඔබව එතැනට ගෙන යා යුතුද?",
  },
  farmerCustomerLogin: {
    English: "It looks like you want to go to the Farmer and Customer login page. Shall I take you there?",
    Tamil: "நீங்கள் விவசாயி மற்றும் வாடிக்கையாளர் உள்நுழைவு பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. நான் உங்களை அங்கு அழைத்துச் செல்லட்டுமா?",
    Malayalam: "നിങ്ങൾ കർഷകന്റെയും ഉപഭോക്താവിന്റെയും ലോഗിൻ പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ അവിടെ കൊണ്ടുപോകണോ?",
    Telugu: "మీరు రైతు మరియు కస్టమర్ లాగిన్ పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను మిమ్మల్ని అక్కడికి తీసుకెళ్లాలా?",
    Hindi: "ऐसा लगता है कि आप किसान और ग्राहक लॉगिन पृष्ठ पर जाना चाहते हैं। क्या मैं आपको वहां ले जाऊं?",
    Kannada: "ನೀವು ರೈತ ಮತ್ತು ಗ್ರಾಹಕರ ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು ಅಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনি কৃষক এবং গ্রাহক লগইন পৃষ্ঠাতে যেতে চান। আমি কি আপনাকে সেখানে নিয়ে যাব?",
    Arabic: "يبدو أنك تريد الذهاب إلى صفحة تسجيل دخول المزارع والعميل. هل آخذك إلى هناك؟",
    Urdu: "ایسا لگتا ہے کہ آپ کسان اور گاہک لاگ ان صفحہ پر جانا چاہتے ہیں۔ کیا میں آپ کو وہاں لے جاؤں؟",
    Srilanka: "ඔබට ගොවි සහ පාරිභෝගික පිවිසුම් පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඔබව එතැනට ගෙන යා යුතුද?",
  },
  hubLogin: {
    English: "It seems you want to go to the Hub Login page. Should I proceed?",
    Tamil: "நீங்கள் ஹப் உள்நுழைவு பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. நான் தொடரலாமா?",
    Malayalam: "നിങ്ങൾ ഹബ് ലോഗിൻ പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ തുടരണോ?",
    Telugu: "మీరు హబ్ లాగిన్ పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను కొనసాగించాలా?",
    Hindi: "ऐसा लगता है कि आप हब लॉगिन पृष्ठ पर जाना चाहते हैं। क्या मुझे आगे बढ़ना चाहिए?",
    Kannada: "ನೀವು ಹಬ್ ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ಮುಂದುವರಿಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনি হাব লগইন পৃষ্ঠাতে যেতে চান। আমি কি এগিয়ে যাব?",
    Arabic: "يبدو أنك تريد الذهاب إلى صفحة تسجيل دخول المركز. هل أتابع؟",
    Urdu: "ایسا لگتا ہے کہ آپ حب لاگ ان صفحہ پر جانا چاہتے ہیں۔ کیا میں آگے بڑھوں؟",
    Srilanka: "ඔබට හබ් පිවිසුම් පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඉදිරියට යා යුතුද?",
  },
  faq: {
    English: "It sounds like you have a question. Would you like me to take you to the FAQ page?",
    Tamil: "உங்களுக்கு ஒரு கேள்வி இருப்பது போல் தெரிகிறது. நான் உங்களை அடிக்கடி கேட்கப்படும் கேள்விகள் பக்கத்திற்கு அழைத்துச் செல்லட்டுமா?",
    Malayalam: "നിങ്ങൾക്കൊരു ചോദ്യമുണ്ടെന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ പതിവുചോദ്യങ്ങൾ പേജിലേക്ക് കൊണ്ടുപോകണോ?",
    Telugu: "మీకు ఒక ప్రశ్న ఉన్నట్లు అనిపిస్తుంది. నేను మిమ్మల్ని తరచుగా అడిగే ప్రశ్నల పేజీకి తీసుకెళ్లాలా?",
    Hindi: "ऐसा लगता है कि आपका कोई प्रश्न है। क्या आप चाहते हैं कि मैं आपको अक्सर पूछे जाने वाले प्रश्न पृष्ठ पर ले जाऊं?",
    Kannada: "ನಿಮಗೆ ಒಂದು ಪ್ರಶ್ನೆ ಇದೆ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು FAQ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনার একটি প্রশ্ন আছে। আমি কি আপনাকে প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী পৃষ্ঠাতে নিয়ে যাব?",
    Arabic: "يبدو أن لديك سؤال. هل تود أن آخذك إلى صفحة الأسئلة الشائعة؟",
    Urdu: "ایسا لگتا ہے کہ آپ کا کوئی سوال ہے۔ کیا آپ چاہتے ہیں کہ میں آپ کو عمومی سوالات کے صفحے پر لے جاؤں؟",
    Srilanka: "ඔබට ප්‍රශ්නයක් ඇති බව පෙනේ. මම ඔබව නිතර අසන පැන පිටුවට ගෙන යාමට කැමතිද?",
  }
};


export const NavigationInputSchema = z.object({
  text: z.string().describe("The user's transcribed voice command."),
  language: z.string().describe("The language the user is speaking in (e.g., 'English', 'Tamil')."),
});
export type NavigationInput = z.infer<typeof NavigationInputSchema>;

// The AI will now return a page key instead of a full message.
const AiNavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'faq', 'none']).describe("The user's intent."),
  pageKey: z.string().optional().describe("The key for the page to navigate to (e.g., 'restaurantRegistration', 'faq')."),
  page: z.string().optional().describe("The full path for the page to navigate to (e.g., '/login/restaurant', '/dashboard/faq')."),
});

export const NavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'faq', 'none']).describe("The user's intent."),
  page: z.string().optional().describe("The page to navigate to (e.g., '/login/restaurant')."),
  confirmationMessage: z.string().optional().describe("The message to confirm with the user before navigating."),
});
export type NavigationOutput = z.infer<typeof NavigationOutputSchema>;


const navigationPrompt = ai.definePrompt({
  name: 'navigationPrompt',
  input: { schema: NavigationInputSchema },
  output: { schema: AiNavigationOutputSchema },
  prompt: `You are a navigation assistant for the Manvaasam application. Your task is to understand the user's request and determine if they want to navigate to a specific page.

The user said: "{{{text}}}"

Supported Pages and their keywords:
- Restaurant Registration: pageKey 'restaurantRegistration', path '/login/restaurant' (Keywords: "restaurant register", "உணவகம் பதிவு", "register restaurant", "பதிவு பக்கம்")
- Farmer/Customer Login: pageKey 'farmerCustomerLogin', path '/login/farmer-customer' (Keywords: "farmer login", "customer login", "விவசாயி உள்நுழைவு", "வாடிக்கையாளர் உள்நுழைவு")
- Hub Login: pageKey 'hubLogin', path '/login/hub' (Keywords: "hub login", "hub portal", "மையம் உள்நுழைவு")
- FAQ: pageKey 'faq', path '/dashboard/faq' (Keywords: "faq", "help", "கேள்விகள்", "உதவி")

Based on the user's text, determine the navigation intent.

- If the user wants to navigate to a page, set intent to 'navigate', set the pageKey, and set the page path.
- If the user is asking a general question, set intent to 'faq', pageKey to 'faq' and page path to '/dashboard/faq'.
- If the user's intent is unclear or doesn't match any navigation commands, set intent to 'none'.
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

    if (!output || output.intent === 'none' || !output.pageKey) {
        return { intent: 'none' };
    }
    
    // Look up the translation based on the pageKey and language.
    const confirmationMessage = translations[output.pageKey]?.[input.language] || translations[output.pageKey]?.['English'];

    if (!confirmationMessage) {
       return { intent: 'none' };
    }
    
    return {
        intent: output.intent,
        page: output.page,
        confirmationMessage: confirmationMessage,
    };
  }
);

export async function understandNavigation(input: NavigationInput): Promise<NavigationOutput> {
  return understandNavigationFlow(input);
}
