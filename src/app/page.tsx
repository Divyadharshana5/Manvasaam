
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import { ArrowRight, Languages, Users, Building, Tractor } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const translations = {
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
    },
    continue: "Continue",
    ourMission: "Our Mission",
    missionStatement: "Manvaasam connects you directly with local farmers through our trusted hub network, ensuring you receive the freshest organic products while supporting sustainable agriculture.",
    footer: "All rights reserved.",
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
    },
    continue: "தொடரவும்",
    ourMission: "எங்கள் நோக்கம்",
    missionStatement: "மன்வாசம் உங்களை உள்ளூர் விவசாயிகளுடன் எங்கள் நம்பகமான மைய நெட்வொர்க் மூலம் நேரடியாக இணைக்கிறது, நிலையான விவசாயத்தை ஆதரிக்கும் அதே வேளையில் புத்துணர்ச்சியான ஆர்கானிக் தயாரிப்புகளைப் பெறுவதை உறுதி செய்கிறது.",
    footer: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
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
    },
    continue: "തുടരുക",
    ourMission: "ഞങ്ങളുടെ ദൗത്യം",
    missionStatement: "സുസ്ഥിരമായ കൃഷിയെ പിന്തുണച്ചുകൊണ്ട് നിങ്ങൾക്ക് ഏറ്റവും പുതിയ ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ ലഭിക്കുന്നുണ്ടെന്ന് ഉറപ്പാക്കിക്കൊണ്ട് ഞങ്ങളുടെ വിശ്വസ്ത ഹബ് നെറ്റ്‌വർക്ക് വഴി മൻവാസം നിങ്ങളെ പ്രാദേശിക കർഷകരുമായി നേരിട്ട് ബന്ധിപ്പിക്കുന്നു.",
    footer: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
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
    },
    continue: "కొనసాగించు",
    ourMission: "మా లక్ష్యం",
    missionStatement: "సుస్థిర వ్యవసాయానికి మద్దతు ఇస్తూ, తాజా సేంద్రీయ ఉత్పత్తులను మీరు పొందేలా మా విశ్వసనీయ హబ్ నెట్‌వర్క్ ద్వారా మన్వాసం మిమ్మల్ని స్థానిక రైతులతో నేరుగా కలుపుతుంది.",
    footer: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
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
    },
    continue: "जारी रखें",
    ourMission: "हमारा विशेष कार्य",
    missionStatement: "मनवासम आपको हमारे विश्वसनीय हब नेटवर्क के माध्यम से सीधे स्थानीय किसानों से जोड़ता है, यह सुनिश्चित करता है कि आपको स्थायी कृषि का समर्थन करते हुए सबसे ताज़ा जैविक उत्पाद प्राप्त हों।",
    footer: "सर्वाधिकार सुरक्षित।",
  },
  Kannada: {
    tagline: "ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು, ತಾಜಾತನವನ್ನು ತಲುಪಿಸುವುದು",
    joinCommunity: "ನಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ",
    roles: {
      farmer: {
        name: "ರೈತ",
        description: "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಲು ನಮ್ಮ ನೆట్‌ವರ್ಕ್‌ಗೆ ಸೇರಿ.",
      },
      customer: {
        name: "ಗ್ರಾಹಕ",
        description: "ತಾಜಾ, ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.",
      },
      hub: {
        name: "ಕೇಂದ್ರ",
        description: "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ರೈತರನ್ನು ಗ್ರಾಹಕರಿಗೆ ಸಂಪರ್ಕಿಸಿ.",
      },
    },
    continue: "ಮುಂದುವರಿಸಿ",
    ourMission: "ನಮ್ಮ ಧ್ಯೇಯ",
    missionStatement: "ಮನ್ವಾಸಂ ನಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಕೇಂದ್ರ ನೆಟ್‌ವರ್ಕ್ ಮೂಲಕ ನಿಮ್ಮನ್ನು ಸ್ಥಳೀಯ ರೈತರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ, ಸುಸ್ಥಿರ ಕೃಷಿಯನ್ನು ಬೆಂಬಲಿಸುವಾಗ ನೀವು ತಾಜಾ ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
    footer: "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
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
    },
    continue: "চালিয়ে যান",
    ourMission: "আমাদের লক্ষ্য",
    missionStatement: "মনওয়াসম আমাদের বিশ্বস্ত হাব নেটওয়ার্কের মাধ্যমে আপনাকে স্থানীয় কৃষকদের সাথে সরাসরি সংযুক্ত করে, টেকসই কৃষিকে সমর্থন করার সময় আপনি তাজা জৈব পণ্য পান তা নিশ্চিত করে।",
    footer: "সমস্ত অধিকার সংরক্ষিত।",
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
    },
    continue: "متابعة",
    ourMission: "مهمتنا",
    missionStatement: "تقوم مانواسام بتوصيلك مباشرة بالمزارعين المحليين من خلال شبكة مراكزنا الموثوقة، مما يضمن حصولك على المنتجات العضوية الطازجة مع دعم الزراعة المستدامة.",
    footer: "كل الحقوق محفوظة.",
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
    },
    continue: "جاری رکھیں",
    ourMission: "ہمارا مقصد",
    missionStatement: "منواسام آپ کو ہمارے قابل اعتماد مرکز نیٹ ورک کے ذریعے براہ راست مقامی کسانوں سے جوڑتا ہے، اس بات کو یقینی بناتا ہے کہ آپ پائیدار زراعت کی حمایت کرتے ہوئے تازہ ترین نامیاتی مصنوعات حاصل کریں۔",
    footer: "جملہ حقوق محفوظ ہیں۔",
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
        description: "ලොජිස්ටික්ස් කළමනාකරණය කර ගොවීන් පාරිභෝගිකයන් හා සම්බන්ධ කරන්න.",
      },
    },
    continue: "ඉදිරියට යන්න",
    ourMission: "අපේ මෙහෙවර",
    missionStatement: "මන්වාசம் අපගේ විශ්වාසවන්ත මධ්‍යස්ථාන ජාලය හරහා ඔබව දේශීය ගොවීන් සමඟ සෘජුවම සම්බන්ධ කරයි, තිරසාර කෘෂිකර්මාන්තයට සහාය දෙන අතරම ඔබට නැවුම්ම කාබනික නිෂ්පාදන ලැබෙන බව සහතික කරයි.",
    footer: "සියලුම හිමිකම් ඇවිරිණි.",
  },
};

const languages = ["English", "Tamil", "Malayalam", "Telugu", "Hindi", "Kannada", "Bengali", "Arabic", "Urdu", "Srilanka"];

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof translations>("English");
  const t = translations[selectedLanguage];

  const userRoles = [
    {
      name: t.roles.farmer.name,
      description: t.roles.farmer.description,
      href: "/login/farmer-customer",
      icon: <Tractor className="h-12 w-12 text-primary" />,
    },
    {
      name: t.roles.customer.name,
      description: t.roles.customer.description,
      href: "/login/farmer-customer",
      icon: <Users className="h-12 w-12 text-primary" />,
    },
    {
      name: t.roles.hub.name,
      description: t.roles.hub.description,
      href: "/login/hub",
      icon: <Building className="h-12 w-12 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen auth-layout-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ManvaasamLogo width={32} height={32} />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </div>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Languages className="mr-2 h-4 w-4" />
              {selectedLanguage}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem key={lang} onSelect={() => setSelectedLanguage(lang as keyof typeof translations)}>
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 relative z-10">
        <section className="text-center w-full max-w-4xl mx-auto">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-center" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>{t.tagline}</h1>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.joinCommunity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((role) => (
              <Card
                key={role.name}
 className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
              >
                <CardHeader className="items-center">
                  {role.icon}
                  <CardTitle className="mt-4 text-2xl">{role.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  <Button asChild className="w-full">
                    <Link href={role.href}>
                      {t.continue} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-20 text-center">
           <h2 className="text-3xl font-bold mb-4 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.ourMission}</h2>
           <p className="text-lg text-foreground/90 mb-8 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.missionStatement}</p>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-4 text-lg font-semibold text-foreground">
                        <span>{t.roles.farmer.name}</span>
                        <ArrowRight size={24} className="text-primary"/>
                        <span>{t.roles.hub.name}</span>
                        <ArrowRight size={24} className="text-primary"/>
                        <span>{t.roles.customer.name}</span>
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>
      <footer className="w-full p-4 text-center text-foreground/80 mt-12 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] relative z-10">
        © {new Date().getFullYear()} Manvaasam. {t.footer}
      </footer>
    </div>
  );
}
