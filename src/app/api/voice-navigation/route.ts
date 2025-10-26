import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple speech-to-text using Web Speech API (fallback for demo)
// In production, you'd use a proper STT service

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioDataUri, language = 'English' } = body;

    // Check authentication status
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const isAuthenticated = !!sessionCookie;

    // For demo purposes, we'll use a simple keyword matching approach
    // In production, you'd process the audio with a proper STT service
    
    // Mock transcript extraction (in real implementation, process audioDataUri)
    const mockTranscript = "dashboard"; // This would come from actual STT processing
    
    // Define route mappings
    const routeMapping: Record<string, string> = {
      "home": "/",
      "dashboard": "/dashboard",
      "orders": "/dashboard/orders",
      "products": "/dashboard/products", 
      "track": "/dashboard/track",
      "profile": "/dashboard/profile",
      "inventory": "/dashboard/inventory",
      "matchmaking": "/dashboard/matchmaking",
      "faq": "/dashboard/faq",
      "help": "/dashboard/faq",
      "support": "/dashboard/faq",
      "analytics": "/dashboard/analytics",
      "reports": "/dashboard/reports",
      "settings": "/dashboard/settings",
      "marketing": "/dashboard/marketing",
      "farmer": "/login/farmer",
      "retail": "/login/retail",
      "transport": "/login/transport",
      "privacy": "/privacy",
      "terms": "/terms",
      "support": "/support"
    };

    // Protected routes that require authentication
    const protectedRoutes = [
      "dashboard", "orders", "products", "track", "profile",
      "inventory", "matchmaking", "analytics", "reports", "settings", "marketing"
    ];

    // Process the transcript to find navigation intent
    const processTranscript = (transcript: string) => {
      const command = transcript.toLowerCase().trim();
      
      // Remove navigation words
      const navigationWords = ['go to', 'navigate to', 'open', 'show', 'take me to', 'visit', 'goto'];
      let targetPage = command;
      
      navigationWords.forEach(word => {
        if (command.includes(word)) {
          targetPage = command.replace(word, '').trim();
        }
      });

      // Check for exact matches in route mapping
      const words = targetPage.split(' ');
      for (const word of words) {
        if (routeMapping[word]) {
          return word;
        }
      }

      return targetPage;
    };

    const targetPage = processTranscript(mockTranscript);
    const route = routeMapping[targetPage];

    if (!route) {
      return NextResponse.json({
        success: false,
        message: getNotFoundMessage(language),
        transcript: mockTranscript
      });
    }

    // Check if route requires authentication
    const requiresAuth = protectedRoutes.includes(targetPage);
    
    if (requiresAuth && !isAuthenticated) {
      return NextResponse.json({
        success: true,
        shouldNavigate: true,
        pageKey: "/", // Redirect to home/login
        message: getLoginMessage(language),
        requiresLogin: true,
        intendedRoute: route
      });
    }

    return NextResponse.json({
      success: true,
      shouldNavigate: true,
      pageKey: route,
      message: getNavigationMessage(targetPage, language),
      transcript: mockTranscript
    });

  } catch (error) {
    console.error('Voice navigation error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred processing your request'
    }, { status: 500 });
  }
}

// Helper functions for multilingual messages
function getNotFoundMessage(language: string): string {
  const messages: Record<string, string> = {
    English: "Not Found",
    Tamil: "கிடைக்கவில்லை",
    Hindi: "नहीं मिला", 
    Malayalam: "കണ്ടെത്തിയില്ല",
    Telugu: "కనుగొనబడలేదు",
    Kannada: "ಸಿಗಲಿಲ್ಲ",
    Bengali: "পাওয়া যায়নি",
    Arabic: "غير موجود",
    Urdu: "نہیں ملا",
    Srilanka: "හමු නොවීය"
  };
  return messages[language] || "Not Found";
}

function getLoginMessage(language: string): string {
  const messages: Record<string, string> = {
    English: "Please login first",
    Tamil: "முதலில் உள்நுழையவும்",
    Hindi: "कृपया पहले लॉगिन करें",
    Malayalam: "ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക",
    Telugu: "దయచేసి మొదట లాగిన్ చేయండి",
    Kannada: "ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ",
    Bengali: "অনুগ্রহ করে প্রথমে লগইন করুন",
    Arabic: "يرجى تسجيل الدخول أولاً",
    Urdu: "پہلے لاگ ان کریں",
    Srilanka: "කරුණාකර මුලින්ම ලොගින් වන්න"
  };
  return messages[language] || "Please login first";
}

function getNavigationMessage(page: string, language: string): string {
  const messages: Record<string, Record<string, string>> = {
    dashboard: {
      English: "Going to dashboard",
      Tamil: "டாஷ்போர்டுக்கு செல்கிறேன்",
      Hindi: "डैशबोर्ड पर जा रहे हैं"
    },
    orders: {
      English: "Opening orders",
      Tamil: "ஆர்டர்களை திறக்கிறேன்", 
      Hindi: "ऑर्डर खोल रहे हैं"
    },
    products: {
      English: "Going to products",
      Tamil: "தயாரிப்புகளுक்கு செல்கிறேன்",
      Hindi: "उत्पादों पर जा रहे हैं"
    }
  };
  
  return messages[page]?.[language] || messages[page]?.["English"] || `Going to ${page}`;
}