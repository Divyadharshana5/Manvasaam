"use client";

import Link from "next/link";
import { motion, LazyMotion, domAnimation, m } from "framer-motion";
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

// Memoized components for better performance
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
      animate={{
        x: [0, -40, 25, 0],
        y: [0, 25, -30, 0],
        scale: [1, 0.9, 1.3, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <motion.div
      className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl"
      animate={{
        x: [0, 20, -35, 0],
        y: [0, -25, 20, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4,
      }}
    />
  </div>
);

interface RoleCardProps {
  role: {
    name: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  };
  index: number;
  t: any; // This comes from the language context
}

const RoleCard = ({
  role,
  index,
  onContinueClick,
  loadingRoleHref,
  t,
}: RoleCardProps) => {
  return (
    <Link href={role.href} prefetch={true} className="group w-full block">
      <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 rounded-xl shadow-md hover:shadow-xl transition-all duration-150 p-4 sm:p-6 flex flex-col h-full min-h-[260px] sm:min-h-[300px] cursor-pointer hover:-translate-y-1 active:scale-[0.99]">
        <CardHeader className="items-center flex-shrink-0 pb-2 sm:pb-4">
          <div className="text-4xl sm:text-5xl">
            {role.icon}
          </div>
        </CardHeader>
        <CardContent className="text-center flex-grow flex flex-col justify-between p-0">
          <div className="flex-grow">
            <CardTitle className="mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl transition-colors duration-150 group-hover:text-primary">
              {role.name}
            </CardTitle>
            <p className="text-muted-foreground my-3 sm:my-4 text-sm sm:text-base leading-relaxed line-clamp-3">
              {role.description}
            </p>
          </div>
          <div className="w-full mt-auto">
            <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm sm:text-base font-medium inline-flex items-center justify-center whitespace-nowrap transition-all duration-100 active:scale-95 touch-target">
              <span className="text-sm sm:text-base">{t.continue}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();

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
    <LazyMotion features={domAnimation}>
      <div className="relative mobile-container bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Optimized Animated Background Elements */}
        <AnimatedBackground />

        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-md border-b border-primary/20 shadow-sm">
          <m.div
            whileHover={{
              rotate: [0, -3, 3, -3, 3, 0],
              transition: { duration: 0.5 },
            }}
          >
            <Link href="/" className="flex items-center gap-1 sm:gap-2">
              <ManvaasamLogo width={28} height={28} className="sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold text-primary">
                Manvaasam
              </span>
            </Link>
          </m.div>
          <div className="flex items-center gap-2 sm:gap-4">
            <m.div whileHover={{ scale: 1.1 }}>
              <VoiceAssistantGlobal />
            </m.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="outline"
                    className="border border-input bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    <span className="font-medium">{selectedLanguage}</span>
                  </Button>
                </motion.div>
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

        <main className="flex flex-col items-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 pb-8">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed bg-ken-burns"
            style={{
              backgroundImage: "url('/bg-agri.png')",
              willChange: "transform",
            }}
          ></div>
          <div className="absolute inset-0 bg-background/30 z-0"></div>

          <section className="text-center w-full max-w-7xl mx-auto z-10 px-2 sm:px-4">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground tracking-tight text-center mb-8 sm:mb-10 md:mb-12 [text-shadow:0_2px_4px_rgb(0_0_0/_30%)] px-2"
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {taglineWords.map((word, index) => (
                <motion.span
                  key={word + "-" + index}
                  variants={letter}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-black [text-shadow:0_0_8px_rgb(255_255_255/_80%)] tracking-wide px-4">
              {t.joinCommunity}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
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

          <section className="w-full max-w-6xl mx-auto mt-16 sm:mt-20 md:mt-24 text-center z-10 px-4 sm:px-6">
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 text-black [text-shadow:0_0_10px_rgb(255_255_255/_90%),0_0_20px_rgb(255_255_255/_60%)] tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {t.ourMission}
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed max-w-5xl mx-auto mb-6 sm:mb-8 text-white [text-shadow:0_2px_8px_rgb(0_0_0/_80%)] py-3 sm:py-4 px-2 sm:px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {t.missionStatement}
            </motion.p>

            <Card className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg p-4 sm:p-6 mx-2 sm:mx-0">
              <CardContent className="p-0 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg font-semibold text-foreground">
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Farmers
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-primary animate-arrow-flow sm:rotate-0 rotate-90 flex-shrink-0"
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Transport
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-primary animate-arrow-flow sm:rotate-0 rotate-90 flex-shrink-0"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    Retail Shops
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Product Showcase Section */}
          <section className="w-full max-w-7xl mx-auto mt-16 sm:mt-20 md:mt-24 z-10 px-4 sm:px-6">
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading products...</span>
                </div>
              }
            >
              <ProductShowcase maxItemsPerCategory={2} />
            </Suspense>
          </section>
        </main>



        {/* Optimized Footer */}
        <motion.footer
          className="relative w-full bg-white/30 bg-gradient-to-r from-white/30 via-white/60 to-white/30 backdrop-blur-xl border-t border-white/40 shadow-2xl mt-12 sm:mt-16 z-30 ring-1 ring-white/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-500 to-primary"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
                  <div className="relative bg-white p-1.5 rounded-full shadow-md">
                    <ManvaasamLogo width={28} height={28} />
                  </div>
                </div>
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                    Manvaasam
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Agricultural Excellence
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3 lg:gap-4">
                {userRoles.map((role, index) => (
                  <motion.div
                    key={role.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={role.href}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-primary/5 hover:from-primary/10 hover:to-green-100 border border-primary/20 hover:border-primary/40 transition-all duration-200 text-xs font-medium text-foreground hover:text-primary shadow-sm hover:shadow-md"
                      onMouseEnter={() => router.prefetch(role.href)}
                    >
                      <span className="text-sm">
                        {role.name === t.roles.farmer.name && "🌾"}
                        {role.name === "Transport Services" && "🚚"}
                        {role.name === "Retail Shops" && "🏪"}
                      </span>
                      <span>{role.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>slytherinpsl7@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-primary/10">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                <p className="text-xs font-medium text-foreground">
                  © {new Date().getFullYear()} Manvaasam. All rights reserved.
                </p>
              </div>

              {/* Legal and Support Links */}
              <div className="flex items-center gap-4 text-xs">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </motion.div>
                <span className="text-muted-foreground">•</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    Terms of Service
                  </Link>
                </motion.div>
                <span className="text-muted-foreground">•</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/support"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    Support
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </LazyMotion>
  );
}
