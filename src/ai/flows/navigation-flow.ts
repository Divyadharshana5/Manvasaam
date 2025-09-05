'use server';
/**
 * @fileOverview An AI flow to understand user navigation intents from text.
 *
 * - understandNavigation - A function that interprets text to find a navigation goal.
 * - NavigationInputSchema - The input schema for the understandNavigation function.
 * - NavigationOutputSchema - The output schema for the understandNavigation function.
 */

require('dotenv').config();
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const apiKey = process.env.GEMINI_API_KEY;
const hasGeminiKey = !!apiKey;

// Define translations for navigation messages.
const translations: Record<string, Record<string, string>> = {
  home: {
    English: "Taking you to the home page.",
    Tamil: "உங்களை முகப்பு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "आपको होम पेज पर ले जा रहा हूं।",
  },
  dashboard: {
    English: "Navigating to your dashboard.",
    Tamil: "உங்கள் டாஷ்போர்டுக்கு செல்கிறேன்.",
    Hindi: "आपके डैशबोर्ड पर जा रहा हूं।",
  },
  restaurantLogin: {
    English: "Taking you to the Restaurant login page.",
    Tamil: "உங்களை உணவகம் உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "आपको रेस्टोरेंट लॉगिन पेज पर ले जा रहा हूं।",
  },
  farmerLogin: {
    English: "Navigating to the Farmer login page.",
    Tamil: "விவசாயி உள்நுழைவு பக்கத்திற்கு செல்கிறேன்.",
    Hindi: "किसान लॉगिन पेज पर जा रहा हूं।",
  },
  customerLogin: {
    English: "Taking you to the Customer login page.",
    Tamil: "வாடிக்கையாளர் உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "ग्राहक लॉगिन पेज पर ले जा रहा हूं।",
  },
  hubLogin: {
    English: "Navigating to the Hub login page.",
    Tamil: "ஹப் உள்நுழைவு பக்கத்திற்கு செல்கிறேன்.",
    Hindi: "हब लॉगिन पेज पर जा रहा हूं।",
  },
  products: {
    English: "Taking you to the products page.",
    Tamil: "தயாரிப்புகள் பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "उत्पाद पेज पर ले जा रहा हूं।",
  },
  orders: {
    English: "Navigating to your orders.",
    Tamil: "உங்கள் ஆர்டர்களுக்கு செல்கிறேன்.",
    Hindi: "आपके ऑर्डर पर जा रहा हूं।",
  },
  profile: {
    English: "Taking you to your profile page.",
    Tamil: "உங்கள் சுயவிவர பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "आपके प्रोफाइल पेज पर ले जा रहा हूं।",
  },
  inventory: {
    English: "Navigating to inventory management.",
    Tamil: "சரக்கு மேலாண்மைக்கு செல்கிறேன்.",
    Hindi: "इन्वेंटरी प्रबंधन पर जा रहा हूं।",
  },
  matchmaking: {
    English: "Taking you to the matchmaking page.",
    Tamil: "பொருத்தம் பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "मैचमेकिंग पेज पर ले जा रहा हूं।",
  },
  voiceAssistant: {
    English: "Opening voice assistant dashboard.",
    Tamil: "குரல் உதவியாளர் டாஷ்போர்டை திறக்கிறேன்.",
    Hindi: "वॉयस असिस्टेंट डैशबोर्ड खोल रहा हूं।",
  },
  voiceAssistantHelp: {
    English: "Opening voice assistant help.",
    Tamil: "குரல் உதவியாளர் உதவியை திறக்கிறேன்.",
    Hindi: "वॉयस असिस्टेंट हेल्प खोल रहा हूं।",
  },
  support: {
    English: "Taking you to the support page.",
    Tamil: "ஆதரவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "सहायता पेज पर ले जा रहा हूं।",
  },
  privacy: {
    English: "Navigating to privacy policy.",
    Tamil: "தனியுரிமை கொள்கைக்கு செல்கிறேன்.",
    Hindi: "प्राइवेसी पॉलिसी पर जा रहा हूं।",
  },
  terms: {
    English: "Taking you to terms of service.",
    Tamil: "சேவை விதிமுறைகளுக்கு அழைத்துச் செல்கிறேன்.",
    Hindi: "सेवा की शर्तों पर ले जा रहा हूं।",
  },
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
  home: "/",
  dashboard: "/dashboard",
  
  // Authentication pages
  restaurantLogin: "/login/restaurant",
  farmerLogin: "/login/farmer",
  customerLogin: "/login/customer",
  hubLogin: "/login/hub",
  
  // Dashboard sections
  products: "/dashboard/products",
  orders: "/dashboard/orders",
  profile: "/dashboard/profile",
  inventory: "/dashboard/hub/inventory",
  matchmaking: "/dashboard/matchmaking",
  track: "/dashboard/track",
  
  // Restaurant dashboard
  restaurantDashboard: "/dashboard/restaurant",
  restaurantOrders: "/dashboard/restaurant/orders",
  restaurantInventory: "/dashboard/restaurant/inventory",
  restaurantProducts: "/dashboard/restaurant/products",
  restaurantFarmers: "/dashboard/restaurant/farmers",
  restaurantReports: "/dashboard/restaurant/reports",
  restaurantSettings: "/dashboard/restaurant/settings",
  
  // Farmer dashboard
  farmerDashboard: "/dashboard/farmer",
  farmerProducts: "/dashboard/farmer/products",
  farmerMatchmaking: "/dashboard/farmer/matchmaking",
  
  // Hub dashboard
  hubDashboard: "/dashboard/hub",
  hubInventory: "/dashboard/hub/inventory",
  hubOrders: "/dashboard/hub/orders",
  hubAttendance: "/dashboard/hub/attendance",
  hubMatchmaking: "/dashboard/hub/matchmaking",
  
  // Customer dashboard
  customerDashboard: "/dashboard/customer",
  
  // Other pages
  voiceAssistant: "/dashboard/voice-assistant",
  voiceAssistantHelp: "/voice-assistant-help",
  support: "/support",
  privacy: "/privacy",
  terms: "/terms",
  faq: "/dashboard/faq",
  marketing: "/dashboard/marketing",
  resetPassword: "/reset-password",
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

const understandNavigationFlow = hasGeminiKey ? ai.defineFlow(
  {
    name: 'understandNavigationFlow',
    inputSchema: NavigationInputSchema,
    outputSchema: NavigationOutputSchema,
  },
  async (input) => {
    const { text, language } = input;
    
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        {
          text: `You are a navigation assistant for Manvaasam, an agricultural marketplace platform. Analyze user input to determine if they want to navigate to a specific page.

Available pages and their keys:

**Main Pages:**
- home: Home/landing page
- dashboard: Main dashboard
- support: Help and support
- privacy: Privacy policy
- terms: Terms of service

**Authentication:**
- restaurantLogin: Restaurant login/registration
- farmerLogin: Farmer login/registration
- customerLogin: Customer login/registration
- hubLogin: Hub/distribution center login
- resetPassword: Password reset page

**Dashboard Sections:**
- products: Product management/catalog
- orders: Order management and tracking
- profile: User profile settings
- inventory: Inventory management
- matchmaking: Farmer-customer matching
- track: Order tracking
- faq: Frequently asked questions
- marketing: Marketing tools
- voiceAssistant: Voice assistant dashboard
- voiceAssistantHelp: Voice assistant help page

**Restaurant Dashboard:**
- restaurantDashboard: Restaurant main dashboard
- restaurantOrders: Restaurant order management
- restaurantInventory: Restaurant inventory
- restaurantProducts: Restaurant product catalog
- restaurantFarmers: Restaurant farmer connections
- restaurantReports: Restaurant analytics
- restaurantSettings: Restaurant settings

**Farmer Dashboard:**
- farmerDashboard: Farmer main dashboard
- farmerProducts: Farmer product management
- farmerMatchmaking: Farmer matchmaking

**Hub Dashboard:**
- hubDashboard: Hub main dashboard
- hubInventory: Hub inventory management
- hubOrders: Hub order processing
- hubAttendance: Hub staff attendance
- hubMatchmaking: Hub farmer matching

**Customer Dashboard:**
- customerDashboard: Customer main dashboard

Analyze the user's intent and match it to the most appropriate page. Common phrases to look for:
- "login", "sign in", "register" → appropriate login page
- "dashboard", "main page" → dashboard
- "products", "catalog", "items" → products
- "orders", "my orders", "purchase" → orders
- "profile", "account", "settings" → profile
- "inventory", "stock" → inventory
- "help", "support", "assistance" → support
- "voice", "assistant", "speak" → voiceAssistant or voiceAssistantHelp
- "home", "main", "start" → home
- "track", "tracking" → track
- "match", "matching", "connect" → matchmaking

Respond in ${language}. If the user wants to navigate, set intent to 'navigate' and provide the exact pageKey. If unclear, ask for clarification with intent 'information'. If they need help, use intent 'help'. If no navigation intent, use 'none'.

User input: ${text}`
        }
      ],
      output: {
        schema: NavigationOutputSchema
      }
    });

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
    const translation = translations[translationKey]?.[input.language] || translations[translationKey]?.['English'] || output.message;

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
