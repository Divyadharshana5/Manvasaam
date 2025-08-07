
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export const translations = {
  English: {
    tagline: "Empowering Farmers, Delivering Freshness",
    joinCommunity: "Join Our Community",
    roles: {
      farmer: {
        name: "Farmer",
        description: "Join our network to sell your produce directly.",
      },
      customer: {
        name: "Customer",
        description: "Get fresh, organic products delivered to your doorstep.",
      },
      hub: {
        name: "Hub",
        description: "Manage logistics and connect farmers to customers.",
      },
      restaurant: {
        name: "Restaurant",
        description: "Source fresh ingredients directly from local farms.",
      },
    },
    continue: "Continue",
    ourMission: "Our Mission",
    missionStatement: "Manvaasam connects you directly with local farmers through our trusted hub network, ensuring you receive the freshest organic products while supporting sustainable agriculture.",
    footer: "All rights reserved.",
    sidebar: {
      dashboard: "Dashboard",
      profile: "Profile",
      orders: "Orders",
      products: "Products",
      track: "Track Order",
      matchmaking: "Matchmaking",
      voiceAssistant: "Voice Assistant",
      marketing: "Marketing",
      faq: "FAQ",
    },
    signOut: {
      button: "Sign Out",
      title: "Signed Out",
      description: "You have been successfully signed out.",
      errorTitle: "Sign Out Failed"
    }
  },
  Tamil: {
    tagline: "விவசாயிகளை மேம்படுத்துதல், புத்துணர்ச்சியை வழங்குதல்",
    joinCommunity: "எங்கள் சமூகத்தில் சேரவும்",
    roles: {
      farmer: {
        name: "விவசாயி",
        description: "உங்கள் விளைபொருட்களை நேரடியாக விற்க எங்கள் நெட்வொர்க்கில் சேரவும்.",
      },
      customer: {
        name: "வாடிக்கையாளர்",
        description: "புதிய, ஆர்கானிக் பொருட்களை உங்கள் வீட்டு வாசலில் பெறுங்கள்.",
      },
      hub: {
        name: "மையம்",
        description: "விநியோகத்தை நிர்வகித்து விவசாயிகளை வாடிக்கையாளர்களுடன் இணைக்கவும்.",
      },
      restaurant: {
        name: "உணவகம்",
        description: "உள்ளூர் பண்ணைகளிலிருந்து நேரடியாக புதிய பொருட்களைப் பெறுங்கள்.",
      },
    },
    continue: "தொடரவும்",
    ourMission: "எங்கள் நோக்கம்",
    missionStatement: "மன்வாசம் உங்களை உள்ளூர் விவசாயிகளுடன் எங்கள் நம்பகமான மைய நெட்வொர்க் மூலம் நேரடியாக இணைக்கிறது, நிலையான விவசாயத்தை ஆதரிக்கும் அதே வேளையில் புத்துணர்ச்சியான ஆர்கானிக் தயாரிப்புகளைப் பெறுவதை உறுதி செய்கிறது.",
    footer: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    sidebar: {
      dashboard: "முகப்பு",
      profile: "சுயவிவரம்",
      orders: "ஆர்டர்கள்",
      products: "தயாரிப்புகள்",
      track: "ஆர்டரைக் கண்காணிக்கவும்",
      matchmaking: "பொருத்தம்",
      voiceAssistant: "குரல் உதவியாளர்",
      marketing: "சந்தைப்படுத்தல்",
      faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    },
    signOut: {
      button: "வெளியேறு",
      title: "வெளியேறப்பட்டது",
      description: "நீங்கள் வெற்றிகரமாக வெளியேறிவிட்டீர்கள்.",
      errorTitle: "வெளியேற முடியவில்லை"
    }
  },
  Malayalam: {
    tagline: "കർഷകരെ ശാക്തീകരിക്കുന്നു, പുതുമ നൽകുന്നു",
    joinCommunity: "ഞങ്ങളുടെ കമ്മ്യൂണിറ്റിയിൽ ചേരുക",
    roles: {
      farmer: {
        name: "കർഷകൻ",
        description: "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ നേരിട്ട് വിൽക്കാൻ ഞങ്ങളുടെ നെറ്റ്‌വർക്കിൽ ചേരുക.",
      },
      customer: {
        name: "ഉപഭോക്താവ്",
        description: "പുതിയ, ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ നിങ്ങളുടെ വീട്ടുവാതിൽക്കൽ എത്തിക്കുക.",
      },
      hub: {
        name: "ഹബ്",
        description: "ലോജിസ്റ്റിക്സ് നിയന്ത്രിക്കുക, കർഷകരെ ഉപഭോക്താക്കളുമായി ബന്ധിപ്പിക്കുക.",
      },
       restaurant: {
        name: "റെസ്റ്റോറന്റ്",
        description: "പ്രാദേശിക ഫാമുകളിൽ നിന്ന് നേരിട്ട് പുതിയ ചേരുവകൾ നേടുക.",
      },
    },
    continue: "തുടരുക",
    ourMission: "ഞങ്ങളുടെ ദൗത്യം",
    missionStatement: "സുസ്ഥിരമായ കൃഷിയെ പിന്തുണച്ചുകൊണ്ട് നിങ്ങൾക്ക് ഏറ്റവും പുതിയ ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ ലഭിക്കുന്നുണ്ടെന്ന് ഉറപ്പാക്കിക്കൊണ്ട് ഞങ്ങളുടെ വിശ്വസ്ത ഹബ് നെറ്റ്‌വർക്ക് വഴി മൻവാസം നിങ്ങളെ പ്രാദേശിക കർഷകരുമായി നേരിട്ട് ബന്ധിപ്പിക്കുന്നു.",
    footer: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    sidebar: {
      dashboard: "ഡാഷ്ബോർഡ്",
      profile: "പ്രൊഫൈൽ",
      orders: "ഓർഡറുകൾ",
      products: "ഉൽപ്പന്നങ്ങൾ",
      track: "ഓർഡർ ട്രാക്ക് ചെയ്യുക",
      matchmaking: "മാച്ച് മേക്കിംഗ്",
      voiceAssistant: "വോയിസ് അസിസ്റ്റന്റ്",
      marketing: "മാർക്കറ്റിംഗ്",
      faq: "പതിവുചോദ്യങ്ങൾ",
    },
    signOut: {
      button: "സൈൻ ഔട്ട് ചെയ്യുക",
      title: "സൈൻ ഔട്ട് ചെയ്തു",
      description: "നിങ്ങൾ വിജയകരമായി സൈൻ ഔട്ട് ചെയ്തു.",
      errorTitle: "സൈൻ ഔട്ട് പരാജയപ്പെട്ടു"
    }
  },
  Telugu: {
    tagline: "రైతులకు సాధికారత, తాజాదనాన్ని అందించడం",
    joinCommunity: "మా సంఘంలో చేరండి",
    roles: {
      farmer: {
        name: "రైతు",
        description: "మీ ఉత్పత్తులను నేరుగా విక్రయించడానికి మా నెట్వర్క్‌లో చేరండి.",
      },
      customer: {
        name: "వినియోగదారుడు",
        description: "తాజా, సేంద్రీయ ఉత్పత్తులను మీ ఇంటి వద్ద పొందండి.",
      },
      hub: {
        name: "హబ్",
        description: "లాజిస్టిక్స్ నిర్వహించండి మరియు రైతులను వినియోగదారులతో కనెక్ట్ చేయండి.",
      },
       restaurant: {
        name: "రెస్టారెంట్",
        description: "స్థానిక పొలాల నుండి నేరుగా తాజా పదార్థాలను పొందండి.",
      },
    },
    continue: "కొనసాగించు",
    ourMission: "మా లక్ష్యం",
    missionStatement: "సుస్థిర వ్యవసాయానికి మద్దతు ఇస్తూ, తాజా సేంద్రీయ ఉత్పత్తులను మీరు పొందేలా మా విశ్వసనీయ హబ్ నెట్‌వర్క్ ద్వారా మన్వాసం మిమ్మల్ని స్థానిక రైతులతో నేరుగా కలుపుతుంది.",
    footer: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
    sidebar: {
      dashboard: "డాష్బోర్డ్",
      profile: "ప్రొఫైల్",
      orders: "ఆదేశాలు",
      products: "ఉత్పత్తులు",
      track: "ఆర్డర్ ట్రాక్ చేయండి",
      matchmaking: "మ్యాచ్ మేకింగ్",
      voiceAssistant: "వాయిస్ అసిస్టెంట్",
      marketing: "మార్కెటింగ్",
      faq: "ఎఫ్ ఎ క్యూ",
    },
     signOut: {
      button: "సైన్ అవుట్ చేయండి",
      title: "సైన్ అవుట్ చేయబడింది",
      description: "మీరు విజయవంతంగా సైన్ అవుట్ చేసారు.",
      errorTitle: "సైన్ అవుట్ విఫలమైంది"
    }
  },
  Hindi: {
    tagline: "किसानों को सशक्त बनाना, ताजगी पहुंचाना",
    joinCommunity: "हमारे समुदाय में शामिल हों",
    roles: {
      farmer: {
        name: "किसान",
        description: "अपनी उपज सीधे बेचने के लिए हमारे नेटवर्क से जुड़ें।",
      },
      customer: {
        name: "ग्राहक",
        description: "ताजा, जैविक उत्पाद अपने दरवाजे पर प्राप्त करें।",
      },
      hub: {
        name: "हब",
        description: "लॉजिस्टिक्स प्रबंधित करें और किसानों को ग्राहकों से जोड़ें।",
      },
       restaurant: {
        name: "रेस्टोरेंट",
        description: "स्थानीय खेतों से सीधे ताजा सामग्री प्राप्त करें।",
      },
    },
    continue: "जारी रखें",
    ourMission: "हमारा विशेष कार्य",
    missionStatement: "मनवासम आपको हमारे विश्वसनीय हब नेटवर्क के माध्यम से सीधे स्थानीय किसानों से जोड़ता है, यह सुनिश्चित करता है कि आपको स्थायी कृषि का समर्थन करते हुए सबसे ताज़ा जैविक उत्पाद प्राप्त हों।",
    footer: "सर्वाधिकार सुरक्षित।",
     sidebar: {
      dashboard: "डैशबोर्ड",
      profile: "प्रोफ़ाइल",
      orders: "आदेश",
      products: "उत्पादों",
      track: "ऑर्डर ट्रैक करें",
      matchmaking: "मैचमेकिंग",
      voiceAssistant: "आवाज सहायक",
      marketing: "विपणन",
      faq: "सामान्य प्रश्न",
    },
     signOut: {
      button: "साइन आउट",
      title: "साइन आउट किया गया",
      description: "आप सफलतापूर्वक साइन आउट हो गए हैं।",
      errorTitle: "साइन आउट विफल"
    }
  },
  Kannada: {
    tagline: "ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು, ತಾಜಾತನವನ್ನು ತಲುಪಿಸುವುದು",
    joinCommunity: "ನಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ",
    roles: {
      farmer: {
        name: "ರೈತ",
        description: "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಲು ನಮ್ಮ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿ.",
      },
      customer: {
        name: "ಗ್ರಾಹಕ",
        description: "ತಾಜಾ, ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.",
      },
      hub: {
        name: "ಕೇಂದ್ರ",
        description: "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ರೈತರನ್ನು ಗ್ರಾಹಕರಿಗೆ ಸಂಪರ್ಕಿಸಿ.",
      },
       restaurant: {
        name: "ರೆಸ್ಟೋರೆಂಟ್",
        description: "ಸ್ಥಳೀಯ ಜಮೀನುಗಳಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಪದಾರ್ಥಗಳನ್ನು ಪಡೆಯಿರಿ.",
      },
    },
    continue: "ಮುಂದುವರಿಸಿ",
    ourMission: "ನಮ್ಮ ಧ್ಯೇಯ",
    missionStatement: "ಮನ್ವಾಸಂ ನಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಕೇಂದ್ರ ನೆಟ್‌ವರ್ಕ್ ಮೂಲಕ ನಿಮ್ಮನ್ನು ಸ್ಥಳೀಯ ರೈತರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ, ಸುಸ್ಥಿರ ಕೃಷಿಯನ್ನು ಬೆಂಬಲಿಸುವಾಗ ನೀವು ತಾಜಾ ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
    footer: "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    sidebar: {
      dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      profile: "ಪ್ರೊಫೈಲ್",
      orders: "ಆದೇಶಗಳು",
      products: "ಉತ್ಪನ್ನಗಳು",
      track: "ಆದೇಶವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      matchmaking: "ಮ್ಯಾಚ್ ಮೇಕಿಂಗ್",
      voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
      marketing: "ಮಾರ್ಕೆಟಿಂಗ್",
      faq: "ఎఫ్ఎక్యూ",
    },
    signOut: {
      button: "ಸೈನ್ ಔಟ್ ಮಾಡಿ",
      title: "ಸೈನ್ ಔಟ್ ಮಾಡಲಾಗಿದೆ",
      description: "ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಸೈನ್ ಔಟ್ ಮಾಡಿದ್ದೀರಿ.",
      errorTitle: "ಸೈನ್ ಔಟ್ ವಿಫಲವಾಗಿದೆ"
    }
  },
  Bengali: {
    tagline: "কৃষকদের ক্ষমতায়ন, সতেজতা সরবরাহ",
    joinCommunity: "আমাদের সম্প্রদায়ে যোগ দিন",
    roles: {
      farmer: {
        name: "কৃষক",
        description: "আপনার পণ্য সরাসরি বিক্রি করতে আমাদের নেটওয়ার্কে যোগ দিন।",
      },
      customer: {
        name: "গ্রাহক",
        description: "তাজা, জৈব পণ্য আপনার দোরগোড়ায় পৌঁছে দেওয়া হয়।",
      },
      hub: {
        name: "হাব",
        description: "লজিস্টিক পরিচালনা করুন এবং কৃষকদের গ্রাহকদের সাথে সংযুক্ত করুন।",
      },
       restaurant: {
        name: "রেস্তোরাঁ",
        description: "স্থানীয় খামার থেকে সরাসরি তাজা উপাদান সংগ্রহ করুন।",
      },
    },
    continue: "চালিয়ে যান",
    ourMission: "আমাদের লক্ষ্য",
    missionStatement: "মনওয়াসম আমাদের বিশ্বস্ত হাব নেটওয়ার্কের মাধ্যমে আপনাকে স্থানীয় কৃষকদের সাথে সরাসরি সংযুক্ত করে, টেকসই কৃষিকে সমর্থন করার সময় আপনি তাজা জৈব পণ্য পান তা নিশ্চিত করে।",
    footer: "সমস্ত অধিকার সংরক্ষিত।",
    sidebar: {
      dashboard: "ড্যাশবোর্ড",
      profile: "প্রোফাইল",
      orders: "অর্ডার",
      products: "পণ্য",
      track: "অর্ডার ট্র্যাক করুন",
      matchmaking: "ম্যাচমেকিং",
      voiceAssistant: "ভয়েস সহকারী",
      marketing: "বিপণন",
      faq: "FAQ",
    },
    signOut: {
      button: "সাইন আউট",
      title: "সাইন আউট করা হয়েছে",
      description: "আপনি সফলভাবে সাইন আউট হয়েছেন।",
      errorTitle: "সাইন আউট ব্যর্থ হয়েছে"
    }
  },
  Arabic: {
    tagline: "تمكين المزارعين، وتوصيل المنتجات الطازجة",
    joinCommunity: "انضم إلى مجتمعنا",
    roles: {
      farmer: {
        name: "مزارع",
        description: "انضم إلى شبكتنا لبيع منتجاتك مباشرة.",
      },
      customer: {
        name: "عميل",
        description: "احصل على منتجات عضوية طازجة تصل إلى عتبة داركم.",
      },
      hub: {
        name: "مركز",
        description: "إدارة الخدمات اللوجستية وربط المزارعين بالعملاء.",
      },
      restaurant: {
        name: "مطعم",
        description: "احصل على المكونات الطازجة مباشرة من المزارع المحلية.",
      },
    },
    continue: "متابعة",
    ourMission: "مهمتنا",
    missionStatement: "تقوم مانواسام بتوصيلك مباشرة بالمزارعين المحليين من خلال شبكة مراكزنا الموثوقة، مما يضمن حصولك على المنتجات العضوية الطازجة مع دعم الزراعة المستدامة.",
    footer: "كل الحقوق محفوظة.",
    sidebar: {
        dashboard: "لوحة القيادة",
        profile: "الملف الشخصي",
        orders: "الطلبات",
        products: "المنتجات",
        track: "تتبع الطلب",
        matchmaking: "التوفيق",
        voiceAssistant: "مساعد صوتي",
        marketing: "التسويق",
        faq: "التعليمات",
    },
    signOut: {
        button: "تسجيل الخروج",
        title: "تم تسجيل الخروج",
        description: "لقد تم تسجيل خروجك بنجاح.",
        errorTitle: "فشل تسجيل الخروج"
    }
  },
  Urdu: {
    tagline: "کسانوں کو بااختیار بنانا، تازگی فراہم کرنا",
    joinCommunity: "ہماری کمیونٹی میں شامل ہوں",
    roles: {
      farmer: {
        name: "کسان",
        description: "اپنی پیداوار براہ راست فروخت کرنے کے لیے ہمارے نیٹ ورک میں شامل ہوں۔",
      },
      customer: {
        name: "گاہک",
        description: "تازہ، نامیاتی مصنوعات اپنی دہلیز پر حاصل کریں۔",
      },
      hub: {
        name: "مرکز",
        description: "لاجسٹکس کا نظم کریں اور کسانوں کو صارفین سے جوڑیں۔",
      },
      restaurant: {
        name: "ریستوراں",
        description: "مقامی فارموں سے براہ راست تازہ اجزاء حاصل کریں۔",
      },
    },
    continue: "جاری رکھیں",
    ourMission: "ہمارا مقصد",
    missionStatement: "منواسام آپ کو ہمارے قابل اعتماد مرکز نیٹ ورک کے ذریعے براہ راست مقامی کسانوں سے جوڑتا ہے، اس بات کو یقینی بناتا ہے کہ آپ پائیدار زراعت کی حمایت کرتے ہوئے تازہ ترین نامیاتی مصنوعات حاصل کریں۔",
    footer: "جملہ حقوق محفوظ ہیں۔",
    sidebar: {
        dashboard: "ڈیش بورڈ",
        profile: "پروفائل",
        orders: "آرڈرز",
        products: "مصنوعات",
        track: "آرڈر ٹریک کریں",
        matchmaking: " میچ میکنگ",
        voiceAssistant: "وائس اسسٹنٹ",
        marketing: "مارکیٹنگ",
        faq: "اکثر पूछे گئے سوالات",
    },
    signOut: {
        button: "সাইন আউট",
        title: "সাইন আউট করা হয়েছে",
        description: "আপনি সফলভাবে সাইন আউট হয়েছেন।",
        errorTitle: "সাইন আউট ব্যর্থ হয়েছে"
    }
  },
  Srilanka: {
    tagline: "ගොවීන් සවිබල ගැන්වීම, නැවුම් බව ලබා දීම",
    joinCommunity: "අපගේ ප්‍රජාවට සම්බන්ධ වන්න",
    roles: {
      farmer: {
        name: "ගොවියා",
        description: "ඔබේ නිෂ්පාදන සෘජුවම විකිණීම සඳහා අපගේ ජාලයට සම්බන්ධ වන්න.",
      },
      customer: {
        name: "පාරිභෝගික",
        description: "නැවුම්, කාබනික නිෂ්පාදන ඔබේ දොරකඩටම ගෙන්වා ගන්න.",
      },
      hub: {
        name: "කේන්ද්‍රය",
        description: "ලොජිස්ටික්ස් කළමනාකරණය කර ගොවීන් පාරිಭෝගිකයන් හා සම්බන්ධ කරන්න.",
      },
      restaurant: {
        name: "ආපන ශාලාව",
        description: "දේශීය ගොවිපලවලින් නැවුම් අමුද්‍රව්‍ය සෘජුවම ලබා ගන්න.",
      },
    },
    continue: "ඉදිරියට යන්න",
    ourMission: "අපේ මෙහෙවර",
    missionStatement: "මන්වාசம் අපගේ විශ්වාසවන්ත මධ්‍යස්ථාන ජාලය හරහා ඔබව දේශීය ගොවීන් සමඟ සෘජුවම සම්බන්ධ කරයි, තිරසාර කෘෂිකර්මාන්තයට සහාය දෙන අතරම ඔබට නැවුම්ම කාබනික නිෂ්පාදන ලැබෙන බව සහතික කරයි.",
    footer: "සියලුම හිමිකම් ඇවිරිණි.",
    sidebar: {
        dashboard: "แดชบอร์ด",
        profile: "පැතිකඩ",
        orders: "ใบสั่งซื้อ",
        products: "නිෂ්පාදන",
        track: " ট্র্যাক অর্ডার",
        matchmaking: "ගැලපීම",
        voiceAssistant: "හඬ සහායක",
        marketing: "අලෙවිකරණය",
        faq: "නිතර අසන පැන",
    },
     signOut: {
        button: "ออกจากระบบ",
        title: "ออกจากระบบแล้ว",
        description: "คุณออกจากระบบเรียบร้อยแล้ว",
        errorTitle: "การออกจากระบบล้มเหลว"
    }
  },
};

export const languages = Object.keys(translations);

type Language = keyof typeof translations;

interface LanguageContextType {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  t: typeof translations[Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('manvaasam-language') as Language;
    if (storedLanguage && translations[storedLanguage]) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleSetLanguage = (language: Language) => {
    setSelectedLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('manvaasam-language', language);
    }
  };
  
  const t = translations[selectedLanguage] || translations['English'];

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
