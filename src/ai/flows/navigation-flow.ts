'use server';
/**
 * @fileOverview Enhanced AI flow for comprehensive voice assistant functionality.
 * Handles navigation, questions, general assistance, and information requests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Enhanced translations for various responses
const translations: Record<string, Record<string, string>> = {
  // Navigation confirmations
  restaurantRegistration: {
    English: "I'll take you to the Restaurant Registration page. Let's get your restaurant set up!",
    Tamil: "நான் உங்களை உணவகம் பதிவு பக்கத்திற்கு அழைத்துச் செல்கிறேன். உங்கள் உணவகத்தை அமைக்கலாம்!",
    Malayalam: "ഞാൻ നിങ്ങളെ റെസ്റ്റോറന്റ് രജിസ്ട്രേഷൻ പേജിലേക്ക് കൊണ്ടു��ോകുന്നു. നിങ്ങളുടെ റെസ്റ്റോറന്റ് സജ്ജീകരിക്കാം!",
    Telugu: "నేను మిమ్మల్ని రెస్టారెంట్ రిజిస్ట్రేషన్ పేజీకి తీసుకెళ్తాను. మీ రెస్టారెంట్‌ను సెటప్ చేద్దాం!",
    Hindi: "मैं आपको रेस्टोरेंट पंजीकरण पृष्ठ पर ले जाऊंगा। आइए अपना रेस्टोरेंट सेट करें!",
  },
  farmerCustomerLogin: {
    English: "Taking you to the Farmer and Customer login page. Welcome to Manvaasam!",
    Tamil: "நான் உங்களை விவசாயி மற்றும் வாடிக்கையாளர் உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறேன். மன்வாசத்திற்கு வரவேற்கிறோம்!",
    Malayalam: "നിങ്ങളെ കർഷകന്റെയും ഉപഭോക്താവിന്റെയും ലോഗിൻ പേജിലേക്ക് കൊണ്ടുപോകുന്നു. മൻവാസത്തിലേക്ക് സ്വാഗതം!",
    Telugu: "మిమ్మల్ని రైతు మరియు కస్టమర్ లాగిన్ పేజీకి తీసుకెళ్తున్నాను. మన్వాసంకు స్వాగతం!",
    Hindi: "आपको किसान और ग्राहक लॉगिन पृष्ठ पर ले जा रहा हूं। मन्वासम में आपका स्वागत है!",
  },
  hubLogin: {
    English: "Navigating to the Hub Login page. Let's connect your hub!",
    Tamil: "ஹப் உள்நுழைவு பக்கத்திற்கு செல்கிறேன். உங்கள் ஹப்பை இணைக்கலாம்!",
    Malayalam: "ഹബ് ലോഗിൻ പേജിലേക്ക് നാവിഗേറ്റ് ചെയ്യുന്നു. നിങ്ങളുടെ ഹബ് കണക്റ്റ് ചെയ്യാം!",
    Telugu: "హబ్ లాగిన్ పేజీకి నావిగేట్ చేస్తున్నాను. మీ హబ్‌ను కనెక్ట్ చేద్దాం!",
    Hindi: "हब लॉगिन पृष्ठ पर जा रहा हूं। आइए अपना हब कनेक्ट करें!",
  },
  dashboard: {
    English: "Taking you to the dashboard where you can manage everything!",
    Tamil: "நீங்கள் எல்லாவற்றையும் நிர்வகிக்கக்கூடிய டாஷ்போர்டுக்கு அழைத்துச் செல்கிறேன்!",
    Malayalam: "നിങ്ങൾക്ക് എല്லാം നിയന്ത്രിക്കാൻ കഴിയുന്ന ഡാഷ്ബോർഡിലേക്ക് കൊണ്ടുപോകുന്നു!",
    Telugu: "మీరు అన్నింటినీ నిర్వహించగల డాష్‌బోర్డ్‌కు తీసుకెళ్తున్నాను!",
    Hindi: "आपको डैशबोर्ड पर ले जा रहा हूं जहां आप सब कुछ प्रबंधित कर सकते हैं!",
  },
  products: {
    English: "Let me show you our fresh products from local farmers!",
    Tamil: "உள்ளூர் விவசாயிகளிடமிருந்து எங்கள் புதிய பொருட்களைக் காட்டுகிறேன்!",
    Malayalam: "പ്രാദേശിക കർഷകരിൽ നിന്നുള്ള ഞങ്ങളുടെ പുതിയ ഉൽപ്പന്നങ്ങൾ കാണിച്ചുത���ാം!",
    Telugu: "స్థానిక రైతుల నుండి మా తాజా ఉత్పత్తులను చూపిస్తాను!",
    Hindi: "मैं आपको स्थानीय किसानों के ताजे उत्पाद दिखाता हूं!",
  },
  orders: {
    English: "Checking your orders and delivery status!",
    Tamil: "உங்கள் ஆர்டர்கள் மற்றும் டெலிவரி நிலையைச் சரிபார்க்கிறேன்!",
    Malayalam: "നിങ്ങളുടെ ഓർഡറുകളും ഡെലിവറി സ്റ്റാറ്റസും പരിശോധിക്കുന്നു!",
    Telugu: "మీ ఆర్డర్‌లు మరియు డెలివరీ స్థితిని తనిఖీ చేస్తున్నాను!",
    Hindi: "आपके ऑर्डर और डिलीवरी स्थिति की जांच कर रहा हूं!",
  },
  profile: {
    English: "Opening your profile settings for you!",
    Tamil: "உங்களுக்காக உங்கள் சுயவிவர அமைப்புகளைத் திறக்கிறேன்!",
    Malayalam: "നിങ്ങൾക്കായി നിങ്��ളുടെ പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ തുറക്കുന്നു!",
    Telugu: "మీ కోసం మీ ప్రొఫైల్ సెట్టింగ్‌లను తెరుస్తున్నాను!",
    Hindi: "आपके लिए आपकी प्रोफ़ाइल सेटिंग्स खोल रहा हूं!",
  },
  // Information responses
  aboutManvaasam: {
    English: "Manvaasam connects farmers directly with customers, restaurants, and hubs. We're building a sustainable agricultural ecosystem that benefits everyone!",
    Tamil: "மன்வாசம் விவசாயிகளை நேரடியாக வாடிக்கையாளர்கள், உணவகங்கள் மற்றும் ஹப்களுடன் இணைக்கிறது. நாங்கள் அனைவருக்கும் பயனளிக்கும் நிலையான விவசாய சுற்றுச்சூழல் அமைப்பை உருவாக்குகிறோம்!",
    Malayalam: "മൻവാസം കർഷകരെ നേരിട്ട് ഉപഭോക്താക്കൾ, റെസ്റ്റോറന്റുകൾ, ഹബുകൾ എന്നിവയുമായി ബന്ധിപ്പിക്കുന���നു. എല്ലാവർക്കും പ്രയോജനം ചെയ്യുന്ന സുസ്ഥിര കാർഷിക ആവാസവ്യവസ്ഥ ഞങ്ങൾ നിർമ്മിക്കുന്നു!",
    Telugu: "మన్వాసం రైతులను నేరుగా కస్టమర్లు, రెస్టారెంట్లు మరియు హబ్‌లతో కలుపుతుంది. మేము అందరికీ ప్రయోజనం చేకూర్చే స్థిరమైన వ్యవసాయ పర్యావరణ వ్యవస్థను నిర్మిస్తున్నాము!",
    Hindi: "मन्वासम किसानों को सीधे ग्राहकों, रेस्टोरेंट और हब से जोड़ता है। हम एक टिकाऊ कृषि पारिस्थितिकी तंत्र बना रहे हैं जो सभी को लाभ पहुंचाता है!",
  },
  howItWorks: {
    English: "Farmers list their fresh produce, customers browse and order, and our hubs ensure quick delivery. It's that simple!",
    Tamil: "விவசாயிகள் தங்கள் புதிய பொருட்களைப் பட்டியலிடுகிற��ர்கள், வாடிக்கையாளர்கள் உலாவி ஆர்டர் செய்கிறார்கள், எங்கள் ஹப்கள் விரைவான டெலிவரியை உறுதி செய்கின்றன. இது மிகவும் எளிமையானது!",
    Malayalam: "കർഷകർ അവരുടെ പുതിയ ഉൽപ്പന്നങ്ങൾ ലിസ്റ്റ് ചെയ്യുന്നു, ഉപഭോക്താക്കൾ ബ്രൗസ് ചെയ്ത് ഓർഡർ ചെയ്യുന്നു, ഞങ്ങളുടെ ഹബുകൾ വേഗത്തിലുള്ള ഡെലിവറി ഉറപ്പാക്കുന്നു. ഇത് വളരെ ലളിതമാണ്!",
    Telugu: "రైతులు తమ తాజా ఉత్పత్తులను జాబితా చేస్తారు, కస్టమర్లు బ్రౌజ్ చేసి ఆర్డర్ చేస్తారు, మా హబ్‌లు త్వరిత డెలివరీని నిర్ధారిస్తాయి. ఇది చాలా సులభం!",
    Hindi: "किसान अपनी ताजी उपज सूचीबद्ध करते हैं, ग्राहक ब्राउज़ करत�� हैं और ऑर्डर करते हैं, और हमारे हब त्वरित डिलीवरी सुनिश्चित करते हैं। यह इतना आसान है!",
  },
  generalHelp: {
    English: "I'm here to help you navigate Manvaasam! You can ask me to go to any page, get information about our platform, or ask questions. What would you like to do?",
    Tamil: "மன்வாசத்தில் உங்களுக்கு வழிகாட்ட நான் இங்கே இருக்கிறேன்! நீங்கள் எந்தப் பக்கத்திற்கும் செல்லச் சொல்லலாம், எங்கள் தளத்தைப் பற்றிய தகவல்களைப் பெறலாம் அல்லது கேள்விகள் கேட்கலாம். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
    Malayalam: "മൻവാസത്തിൽ നിങ്ങളെ നാവിഗേറ്റ് ചെയ്യാൻ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്! നിങ്ങൾക്ക് ഏതെങ്കിലും പേജിലേക്ക് പോകാൻ എന്നോട് ആവശ്യപ്പെടാം, ഞങ്ങളുടെ പ്ലാറ്റ്ഫോമിനെക്കുറിച്ചുള്ള വിവരങ്ങൾ നേടാം, അല്ലെങ്കിൽ ചോദ്യങ്ങൾ ചോദിക്കാം. നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?",
    Telugu: "మన్వాసంలో మీకు నావిగేట్ చేయడంలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను! మీరు ఏదైనా పేజీకి వెళ్లమని నన్ను అడగవచ్చు, మా ప్లాట్‌ఫారమ్ గురించి సమాచారం పొందవచ్చు లేదా ప్రశ్నలు అడగవచ్చు. మీరు ఏమి చేయాలనుకుంటున్నారు?",
    Hindi: "मैं मन्वासम में आपकी मदद करने के लिए यहां हूं! आप मुझसे किसी भी पृष्ठ पर जाने को कह सकते हैं, हमारे प्लेटफॉर्म के बारे में जानकारी प्राप्त कर सकते हैं, या प्रश्न पूछ सकते ��ैं। आप क्या करना चाहते हैं?",
  }
};

// Enhanced page mappings
const pagePaths: Record<string, string> = {
  restaurantRegistration: '/login/restaurant',
  farmerCustomerLogin: '/login/farmer-customer',
  hubLogin: '/login/hub',
  dashboard: '/dashboard',
  products: '/dashboard/products',
  orders: '/dashboard/orders',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
  inventory: '/dashboard/inventory',
  analytics: '/dashboard/analytics',
  support: '/dashboard/support',
  faq: '/dashboard/faq',
  home: '/',
};

export const EnhancedNavigationInputSchema = z.object({
  text: z.string().describe("The user's transcribed voice command."),
  language: z.string().describe("The language the user is speaking in."),
});
export type EnhancedNavigationInput = z.infer<typeof EnhancedNavigationInputSchema>;

const AiEnhancedNavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'information', 'help', 'none']).describe("The user's intent."),
  pageKey: z.string().optional().describe("The key for the page to navigate to."),
  informationType: z.enum(['aboutManvaasam', 'howItWorks', 'generalHelp', 'none']).optional().describe("Type of information requested."),
  confidence: z.number().min(0).max(1).describe("Confidence level of the interpretation."),
});

export const EnhancedNavigationOutputSchema = z.object({
  intent: z.enum(['navigate', 'information', 'help', 'none']).describe("The user's intent."),
  page: z.string().optional().describe("The page to navigate to."),
  message: z.string().describe("The response message to the user."),
  shouldNavigate: z.boolean().describe("Whether to navigate to a page."),
});
export type EnhancedNavigationOutput = z.infer<typeof EnhancedNavigationOutputSchema>;

const enhancedNavigationPrompt = ai.definePrompt({
  name: 'enhancedNavigationPrompt',
  input: { schema: EnhancedNavigationInputSchema },
  output: { schema: AiEnhancedNavigationOutputSchema },
  prompt: `You are an intelligent voice assistant for Manvaasam, an agricultural platform connecting farmers with customers, restaurants, and hubs.

The user said: "{{{text}}}"

Analyze the user's request and determine their intent:

NAVIGATION INTENTS (set intent to 'navigate'):
- Restaurant registration/signup: pageKey = 'restaurantRegistration'
- Farmer/Customer login/signin: pageKey = 'farmerCustomerLogin'  
- Hub login/signin: pageKey = 'hubLogin'
- Dashboard/main page: pageKey = 'dashboard'
- Products/items/catalog: pageKey = 'products'
- Orders/purchases/history: pageKey = 'orders'
- Profile/account/settings: pageKey = 'profile'
- Inventory/stock: pageKey = 'inventory'
- Analytics/reports/stats: pageKey = 'analytics'
- Support/help/contact: pageKey = 'support'
- FAQ/questions: pageKey = 'faq'
- Home/homepage: pageKey = 'home'

INFORMATION INTENTS (set intent to 'information'):
- About Manvaasam/what is this/platform info: informationType = 'aboutManvaasam'
- How it works/how to use/process: informationType = 'howItWorks'
- General help/assistance: informationType = 'generalHelp'

HELP INTENTS (set intent to 'help'):
- General assistance requests, unclear commands

Set confidence based on how clear the user's intent is (0.0 to 1.0).
If the intent is unclear or doesn't match anything, set intent to 'none' and confidence to 0.0.`,
});

const enhancedNavigationFlow = ai.defineFlow(
  {
    name: 'enhancedNavigationFlow',
    inputSchema: EnhancedNavigationInputSchema,
    outputSchema: EnhancedNavigationOutputSchema,
  },
  async (input) => {
    const { output } = await enhancedNavigationPrompt(input);

    if (!output || output.intent === 'none' || output.confidence < 0.3) {
      return {
        intent: 'help',
        message: translations.generalHelp[input.language] || translations.generalHelp['English'],
        shouldNavigate: false,
      };
    }

    if (output.intent === 'navigate' && output.pageKey) {
      const pagePath = pagePaths[output.pageKey];
      if (pagePath) {
        const message = translations[output.pageKey]?.[input.language] || 
                       translations[output.pageKey]?.['English'] ||
                       `Navigating to ${output.pageKey}...`;
        
        return {
          intent: 'navigate',
          page: pagePath,
          message: message,
          shouldNavigate: true,
        };
      }
    }

    if (output.intent === 'information' && output.informationType && output.informationType !== 'none') {
      const message = translations[output.informationType]?.[input.language] || 
                     translations[output.informationType]?.['English'] ||
                     "I'd be happy to help you with information about Manvaasam!";
      
      return {
        intent: 'information',
        message: message,
        shouldNavigate: false,
      };
    }

    // Default help response
    return {
      intent: 'help',
      message: translations.generalHelp[input.language] || translations.generalHelp['English'],
      shouldNavigate: false,
    };
  }
);

export async function enhancedUnderstandNavigation(input: EnhancedNavigationInput): Promise<EnhancedNavigationOutput> {
  return enhancedNavigationFlow(input);
}