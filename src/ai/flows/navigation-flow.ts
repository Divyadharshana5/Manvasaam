'use server';
/**
 * @fileOverview An AI flow to understand user navigation intents from text.
 *
 * - understandNavigation - A function that interprets text to find a navigation goal.
 * - NavigationInputSchema - The input schema for the understandNavigation function.
 * - NavigationOutputSchema - The output schema for the understandNavigation function.
 */

import {ai, hasGeminiKey} from '@/ai/genkit';
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
    Tamil: "நீங்கள் ஹப் உள்நுழைவு பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. நான் முன்னேற வேண்டுமா?",
    Malayalam: "നിങ്ങൾ ഹബ് ലോഗിൻ പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ തുടരണോ?",
    Telugu: "మీరు హబ్ లాగిన్ పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను కొనసాగించాలా?",
    Hindi: "ऐसा लगता है कि आप हब लॉगिन पृष्ठ पर जाना चाहते हैं। क्या मुझे आगे बढ़ना चाहिए?",
    Kannada: "ನೀವು ಹಬ್ ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ಮುಂದುವರಿಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনি হাব লগইন পৃষ্ঠাতে যেতে চান। আমি কি এগিয়ে যাব?",
    Arabic: "يبدو أنك تريد الذهاب إلى صفحة تسجيل دخول المركز. هل أتابع؟",
    Urdu: "ایسا لگتا ہے کہ آپ حب لاگ ان صفحہ پر جانا چاہتے ہیں۔ کیا میں آگے بڑھوں؟",
    Srilanka: "ඔබට හබ් පිවිසුම් පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඉදිරියට යා යුතුද?",
  },
};

// Define page paths mapping
const pagePaths: Record<string, string> = {
  restaurantRegistration: "/login/restaurant",
  farmerCustomerLogin: "/login/farmer-customer",
  hubLogin: "/login/hub",
  home: "/",
  dashboard: "/dashboard",
};

const NavigationInputSchema = z.object({
  text: z.string().describe('The user input text to analyze for navigation intent'),
  language: z.string().describe('The language for the response'),
});

const NavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'information', 'help', 'none']).describe('The type of user intent'),
  pageKey: z.string().optional().describe('The page key to navigate to if intent is navigate'),
  message: z.string().describe('Response message to the user'),
  shouldNavigate: z.boolean().describe('Whether navigation should occur'),
});

type NavigationInput = z.infer<typeof NavigationInputSchema>;
type NavigationOutput = z.infer<typeof NavigationOutputSchema>;

const navigationPrompt = hasGeminiKey ? ai.definePrompt(
  {
    name: 'navigationPrompt',
    inputSchema: NavigationInputSchema,
    outputSchema: NavigationOutputSchema,
  },
  async (input) => {
    const { text, language } = input;
    
    return {
      messages: [
        {
          role: 'system' as const,
          content: `You are a navigation assistant for Manvaasam, an agricultural platform. Analyze user input to determine if they want to navigate to a specific page.

Available pages and their keys:
- restaurantRegistration: Restaurant registration/login page
- farmerCustomerLogin: Farmer and customer login page  
- hubLogin: Hub login page
- home: Home page
- dashboard: Dashboard page

Respond in ${language}. If the user wants to navigate, set intent to 'navigate', provide the pageKey, and ask for confirmation. If unclear, ask for clarification with intent 'information'. If they need help, use intent 'help'. If no navigation intent, use 'none'.`,
        },
        {
          role: 'user' as const,
          content: text,
        },
      ],
    };
  }
) : null;

const understandNavigationFlow = hasGeminiKey ? ai.defineFlow(
  {
    name: 'understandNavigationFlow',
    inputSchema: NavigationInputSchema,
    outputSchema: NavigationOutputSchema,
  },
  async (input) => {
    const { output } = await navigationPrompt!(input);

    if (!output || output.intent === 'none' || !output.pageKey || output.pageKey === 'none') {
        return { intent: 'none', message: 'How can I help you navigate?', shouldNavigate: false };
    }
    
    // Determine the page path and key, whether the AI returned a key or a full path
    let pageKey = output.pageKey;
    let pagePath = pagePaths[pageKey];

    if (pageKey.startsWith('/')) {
        pagePath = pageKey;
        // Find the key corresponding to the path to look up translations
        pageKey = Object.keys(pagePaths).find(key => pagePaths[key] === pageKey) || pageKey;
    }

    if (!pagePath) {
        return { intent: 'information', message: 'I\'m not sure which page you want to visit. Could you be more specific?', shouldNavigate: false };
    }

    // Get the appropriate translation
    const translationKey = pageKey as keyof typeof translations;
    const translation = translations[translationKey]?.[input.language] || output.message;

    return {
        intent: output.intent,
        pageKey: pagePath,
        message: translation,
        shouldNavigate: output.intent === 'navigate',
    };
  }
) : null;

export async function understandNavigation(input: NavigationInput): Promise<NavigationOutput> {
  if (!hasGeminiKey || !understandNavigationFlow) {
    return {
      intent: 'information',
      message: 'Demo mode: AI navigation not available. Please configure GEMINI_API_KEY to use this feature.',
      shouldNavigate: false
    };
  }
  return understandNavigationFlow(input);
}
