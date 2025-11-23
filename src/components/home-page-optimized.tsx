"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import {
  ArrowRight,
  Languages,
  Building,
  Tractor,
  Loader2,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useLanguage,
  translations,
  languages,
} from "@/context/language-context";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";
import { VoiceAssistantGlobal } from "@/components/VoiceAssistantGlobal";

// Lazy load AI components for better initial load performance
const ProductShowcase = lazy(() => import("@/components/product-showcase"));

interface RoleCardProps {
  role: {
    name: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  };
  index: number;
  onContinueClick: (href: string) => void;
  loadingRoleHref: string | null;
  t: any; // This comes from the language context
}

const RoleCard = ({
  role,
  index,
  onContinueClick,
  loadingRoleHref,
  t,
}: RoleCardProps) => {
  const router = useRouter();

  const handleHover = useCallback(() => {
    router.prefetch(role.href);
  }, [router, role.href]);

  const handleClick = useCallback(() => {
    onContinueClick(role.href);
  }, [onContinueClick, role.href]);

  return (
    <div
      className="group w-full"
      onMouseEnter={handleHover}
      onTouchStart={handleHover}
    >
      <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-150 p-3 sm:p-5 flex flex-col h-full min-h-[240px] sm:min-h-[280px] cursor-pointer hover:-translate-y-1 active:scale-[0.99] transition-transform">
        <CardHeader className="items-center flex-shrink-0 pb-2 sm:pb-3">
          <div className="text-3xl sm:text-4xl">
            {role.icon}
          </div>
        </CardHeader>
        <CardContent className="text-center flex-grow flex flex-col justify-between p-0">
          <div className="flex-grow">
            <CardTitle className="mt-2 sm:mt-3 text-base sm:text-lg lg:text-xl transition-colors duration-150 group-hover:text-primary">
              {role.name}
            </CardTitle>
            <p className="text-muted-foreground my-2 sm:my-3 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {role.description}
            </p>
          </div>
          <Button
            className="w-full mt-auto transition-all duration-100 active:scale-95 touch-target"
            onClick={handleClick}
            disabled={loadingRoleHref === role.href}
            size="lg"
          >
            {loadingRoleHref === role.href ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-xs sm:text-sm">Loading...</span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm">{t.continue}</span>
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const router = useRouter();

  const [loadingRoleHref, setLoadingRoleHref] = useState<string | null>(null);

  // Memoize expensive calculations for better performance
  const taglineWords = useMemo(() => t.tagline.split(" "), [t.tagline]);

  // Check for reduced motion preference for better performance
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const userRoles = useMemo(
    () => [
      {
        name: t.roles.farmer.name,
        description: t.roles.farmer.description,
        href: "/login/farmer",
        icon: <Tractor className="h-12 w-12 text-primary" />,
      },
      {
        name: selectedLanguage === "Tamil" ? "போக்குவரத்து சேவைகள்" :
          selectedLanguage === "Hindi" ? "परिवहन सेवाएं" :
            selectedLanguage === "Malayalam" ? "ഗതാഗത സേവനങ്ങൾ" :
              selectedLanguage === "Telugu" ? "రవాణా సేవలు" :
                selectedLanguage === "Kannada" ? "ಸಾರಿಗೆ ಸೇವೆಗಳು" :
                  selectedLanguage === "Bengali" ? "পরিবহন সেবা" :
                    selectedLanguage === "Arabic" ? "خدمات النقل" :
                      selectedLanguage === "Urdu" ? "نقل و حمل کی خدمات" :
                        selectedLanguage === "Srilanka" ? "ප්‍රවාහන සේවා" :
                          "Transport Services",
        description: selectedLanguage === "Tamil" ? "விவசாயிகளிடமிருந்து சில்லறை கடைகளுக்கு பொருட்களை வழங்குவதற்கான உள்ளூர் போக்குவரத்து அமைப்பு" :
          selectedLanguage === "Hindi" ? "किसानों से खुदरा दुकानों तक सामान पहुंचाने के लिए स्थानीय परिवहन प्रणाली" :
            selectedLanguage === "Malayalam" ? "കർഷകരിൽ നിന്ന് റീട്ടെയിൽ ഷോപ്പുകളിലേക്ക് സാധനങ്ങൾ എത്തിക്കുന്നതിനുള്ള പ്രാദേശിക ഗതാഗത സംവിധാനം" :
              selectedLanguage === "Telugu" ? "రైతుల నుండి రిటైల్ దుకాణాలకు వస్తువులను పంపిణీ చేయడానికి స్థానిక రవాణా వ్యవస్థ" :
                selectedLanguage === "Kannada" ? "ರೈತರಿಂದ ಚಿಲ್ಲರೆ ಅಂಗಡಿಗಳಿಗೆ ಸರಕುಗಳನ್ನು ವಿತರಿಸಲು ಸ್ಥಳೀಯ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆ" :
                  selectedLanguage === "Bengali" ? "কৃষকদের থেকে খুচরা দোকানে পণ্য সরবরাহের জন্য স্থানীয় পরিবহন ব্যবস্থা" :
                    selectedLanguage === "Arabic" ? "نظام النقل المحلي لتوصيل البضائع من المزارعين إلى متاجر التجزئة" :
                      selectedLanguage === "Urdu" ? "کسانوں سے ریٹیل شاپس تک سامان پہنچانے کے لیے مقامی نقل و حمل کا نظام" :
                        selectedLanguage === "Srilanka" ? "ගොවීන්ගෙන් සිල්ලර වෙළඳසැල් වෙත භාණ්ඩ බෙදා හැරීම සඳහා ප්‍රාදේශීය ප්‍රවාහන පද්ධතිය" :
                          "Local transport system for delivering goods from farmers to retail shops",
        href: "/login/transport",
        icon: <Truck className="h-12 w-12 text-primary" />,
      },
      {
        name: selectedLanguage === "Tamil" ? "சில்லறை கடைகள்" :
          selectedLanguage === "Hindi" ? "खुदरा दुकानें" :
            selectedLanguage === "Malayalam" ? "റീട്ടെയിൽ ഷോപ്പുകൾ" :
              selectedLanguage === "Telugu" ? "రిటైల్ దుకాణాలు" :
                selectedLanguage === "Kannada" ? "ಚಿಲ್ಲರೆ ಅಂಗಡಿಗಳು" :
                  selectedLanguage === "Bengali" ? "খুচরা দোকান" :
                    selectedLanguage === "Arabic" ? "متاجر التجزئة" :
                      selectedLanguage === "Urdu" ? "ریٹیل شاپس" :
                        selectedLanguage === "Srilanka" ? "සිල්ලර වෙළඳසැල්" :
                          "Retail Shops",
        description: selectedLanguage === "Tamil" ? "உங்கள் பகுதியில் உள்ள விவசாயிகளிடமிருந்து நேரடியாக புதிய பொருட்களை வாங்குங்கள்" :
          selectedLanguage === "Hindi" ? "अपने क्षेत्र के किसानों से सीधे ताजे उत्पाद खरीदें" :
            selectedLanguage === "Malayalam" ? "നിങ്ങളുടെ പ്രദേശത്തെ കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ ഉൽപ്പന്നങ്ങൾ വാങ്ങുക" :
              selectedLanguage === "Telugu" ? "మీ ప్రాంతంలోని రైతుల నుండి నేరుగా తాజా ఉత్పత్తులను కొనుగోలు చేయండి" :
                selectedLanguage === "Kannada" ? "ನಿಮ್ಮ ಪ್ರದೇಶದ ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ" :
                  selectedLanguage === "Bengali" ? "আপনার এলাকার কৃষকদের কাছ থেকে সরাসরি তাজা পণ্য কিনুন" :
                    selectedLanguage === "Arabic" ? "اشتري المنتجات الطازجة مباشرة من المزارعين في منطقتك" :
                      selectedLanguage === "Urdu" ? "اپنے علاقے کے کسانوں سے براہ راست تازہ پیداوار خریدیں" :
                        selectedLanguage === "Srilanka" ? "ඔබේ ප්‍රදේශයේ ගොවීන්ගෙන් සෘජුවම නැවුම් නිෂ්පාදන මිලදී ගන්න" :
                          "Buy fresh products directly from farmers in your area",
        href: "/login/retail",
        icon: <Building className="h-12 w-12 text-primary" />,
      },
    ],
    [t.roles]
  );



  // Prefetch all login pages for instant navigation
  useEffect(() => {
    const loginPages = [
      "/login/farmer",
      "/login/transport",
      "/login/retail",
    ];

    // Prefetch after a short delay to not block initial render
    const prefetchTimer = setTimeout(() => {
      loginPages.forEach((page) => {
        router.prefetch(page);
      });
    }, 500);

    return () => clearTimeout(prefetchTimer);
  }, [router]);

  const handleContinueClick = useCallback(
    (href: string) => {
      // Set loading state immediately for instant feedback
      setLoadingRoleHref(href);

      // Use requestAnimationFrame for smoother transition
      requestAnimationFrame(() => {
        // Instant navigation - page is already prefetched
        router.push(href);
      });
    },
    [router]
  );





  // Optimized animation variants with reduced motion support
  const sentence = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: prefersReducedMotion
          ? { duration: 0.1 }
          : { delay: 0.2, staggerChildren: 0.08 },
      },
    }),
    [prefersReducedMotion]
  );

  const letter = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion ? { duration: 0.1 } : undefined,
      },
    }),
    [prefersReducedMotion]
  );

  return (
      <div className="relative mobile-container bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
        <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between p-2 sm:p-3 bg-white/90 backdrop-blur-sm border-b border-primary/20 shadow-sm">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
            <ManvaasamLogo width={24} height={24} className="sm:w-7 sm:h-7" />
            <span className="text-base sm:text-lg font-bold text-primary">
              Manvaasam
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <VoiceAssistantGlobal />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-input bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm text-xs sm:text-sm"
                >
                  <Languages className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium">{selectedLanguage}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onSelect={() =>
                      setSelectedLanguage(lang as keyof typeof translations)
                    }
                  >
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-col items-center pt-14 sm:pt-16 px-3 sm:px-4 pb-6">
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: "url('/bg-agri.png')",
            }}
          ></div>

          <section className="text-center w-full max-w-6xl mx-auto z-10 px-2 sm:px-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight text-center mb-4 sm:mb-6 [text-shadow:0_1px_2px_rgb(0_0_0/_20%)] px-2">
              {t.tagline}
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 sm:mb-7 text-black [text-shadow:0_0_6px_rgb(255_255_255/_70%)] tracking-wide px-3">
              {t.joinCommunity}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 px-1 sm:px-2 max-w-6xl mx-auto">
              {userRoles.map((role, index) => (
                <RoleCard
                  key={role.name}
                  role={role}
                  index={index}
                  onContinueClick={handleContinueClick}
                  loadingRoleHref={loadingRoleHref}
                  t={t}
                />
              ))}
            </div>
          </section>

          <section className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 text-center z-10 px-3 sm:px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-black [text-shadow:0_0_8px_rgb(255_255_255/_85%)] tracking-wide">
              {t.ourMission}
            </h2>

            <p className="text-sm sm:text-base md:text-lg font-semibold leading-relaxed max-w-4xl mx-auto mb-4 sm:mb-6 text-white [text-shadow:0_1px_6px_rgb(0_0_0/_75%)] py-2 sm:py-3 px-2 sm:px-3">
              {t.missionStatement}
            </p>

            <Card className="bg-card/75 backdrop-blur-sm border border-primary/20 rounded-xl shadow-md p-3 sm:p-4 mx-2 sm:mx-0">
              <CardContent className="p-0 sm:p-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-foreground">
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Farmers
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-primary sm:rotate-0 rotate-90 flex-shrink-0"
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Transport
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-primary sm:rotate-0 rotate-90 flex-shrink-0"
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Retail Shops
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Product Showcase Section */}
          <section className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 z-10 px-3 sm:px-4">
            <Suspense
              fallback={
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm">Loading products...</span>
                </div>
              }
            >
              <ProductShowcase maxItemsPerCategory={2} />
            </Suspense>
          </section>
        </main>



        {/* Footer */}
        <footer className="relative w-full bg-white/40 backdrop-blur-sm border-t border-white/40 shadow-lg mt-8 sm:mt-12 z-30">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-green-500 to-primary"></div>
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-full shadow-sm">
                  <ManvaasamLogo width={20} height={20} />
                </div>
                <div>
                  <span className="text-sm font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                    Manvaasam
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    Agricultural Excellence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center">
                {userRoles.map((role) => (
                  <Link
                    key={role.name}
                    href={role.href}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-50 to-primary/5 hover:from-primary/10 hover:to-green-100 border border-primary/20 hover:border-primary/40 transition-all duration-150 text-[10px] sm:text-xs font-medium text-foreground hover:text-primary shadow-sm"
                    onMouseEnter={() => router.prefetch(role.href)}
                  >
                    <span className="text-xs">
                      {role.name === t.roles.farmer.name && "🌾"}
                      {role.name.includes("Transport") && "🚚"}
                      {role.name.includes("Retail") && "🏪"}
                    </span>
                    <span className="hidden sm:inline">{role.name}</span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>📧</span>
                  <span className="hidden sm:inline">slytherinpsl7@gmail.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📞</span>
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-primary/10 mt-2">
              <p className="text-[10px] font-medium text-foreground">
                © {new Date().getFullYear()} Manvaasam. All rights reserved.
              </p>

              <div className="flex items-center gap-3 text-[10px]">
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 hover:underline"
                >
                  Privacy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 hover:underline"
                >
                  Terms
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 hover:underline"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}
