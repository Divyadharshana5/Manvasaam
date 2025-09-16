"use client";

import Link from "next/link";
import { motion, LazyMotion, domAnimation, m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import {
  ArrowRight,
  Languages,
  Users,
  Building,
  Tractor,
  Utensils,
  Mic,
  Volume2,
  Square,
  Loader2,
  MicOff,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Lazy load AI components for better initial load performance
const VoiceAssistant = lazy(() => import("@/components/voice-assistant"));
const ProductShowcase = lazy(() => import("@/components/product-showcase"));

type AssistantState = "idle" | "listening" | "thinking" | "speaking";

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
    // Prefetch on hover for instant navigation
    router.prefetch(role.href);
  }, [router, role.href]);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={handleHover}
    >
      <Card className="bg-card/80 backdrop-blur-xl border-2 border-primary/20 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 sm:p-6 flex flex-col h-full min-h-[280px] sm:min-h-[320px]">
        <CardHeader className="items-center flex-shrink-0 pb-2 sm:pb-4">
          <div className="group-hover:animate-shake text-4xl sm:text-5xl">
            {role.icon}
          </div>
        </CardHeader>
        <CardContent className="text-center flex-grow flex flex-col justify-between p-0">
          <div>
            <CardTitle className="mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl transition-all duration-300 group-hover:text-primary group-hover:scale-105">
              {role.name}
            </CardTitle>
            <p className="text-muted-foreground my-3 sm:my-4 text-sm sm:text-base leading-relaxed">
              {role.description}
            </p>
          </div>
          <Button
            className="w-full mt-auto transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => onContinueClick(role.href)}
            disabled={loadingRoleHref === role.href}
          >
            {loadingRoleHref === role.href ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {t.continue}{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [loadingRoleHref, setLoadingRoleHref] = useState<string | null>(null);

  // Progressive loading state for better performance
  const [isContentLoaded, setIsContentLoaded] = useState(false);

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
        name: t.roles.customer.name,
        description: t.roles.customer.description,
        href: "/login/customer",
        icon: <Users className="h-12 w-12 text-primary" />,
      },
      {
        name: t.roles.hub.name,
        description: t.roles.hub.description,
        href: "/login/hub",
        icon: <Building className="h-12 w-12 text-primary" />,
      },
      {
        name: t.roles.restaurant.name,
        description: t.roles.restaurant.description,
        href: "/login/restaurant",
        icon: <Utensils className="h-12 w-12 text-primary" />,
      },
    ],
    [t.roles]
  );

  // Progressive loading effect for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Prefetch all login pages for instant navigation
  useEffect(() => {
    const loginPages = [
      "/login/farmer",
      "/login/customer",
      "/login/hub",
      "/login/restaurant",
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
      setLoadingRoleHref(href);

      // Fast navigation with prefetch
      router.prefetch(href);
      router.push(href);
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
    <LazyMotion features={domAnimation}>
      <div className="relative mobile-container min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
            <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
              <DialogTrigger asChild>
                <m.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <Mic className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">
                      {t.sidebar.voiceAssistant}
                    </span>
                    <span className="sm:hidden">Voice</span>
                  </Button>
                </m.div>
              </DialogTrigger>
              <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-neutral-900/95 py-6 px-4 flex flex-col items-center justify-center">
                <DialogHeader className="text-center pt-4">
                  <DialogTitle>Enhanced Voice Assistant</DialogTitle>
                  <DialogDescription>
                    Ask me anything! I can help you navigate, answer questions
                    about Manvaasam, or provide information about our platform.
                  </DialogDescription>
                </DialogHeader>
                <Suspense
                  fallback={
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  }
                >
                  <VoiceAssistant />
                </Suspense>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="outline"
                    className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    {selectedLanguage}
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

        <main className="flex min-h-screen flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8">
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

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 text-black [text-shadow:0_0_8px_rgb(255_255_255/_80%)] tracking-wide px-2">
              {t.joinCommunity}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
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
                    {t.roles.farmer.name}
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-primary animate-arrow-flow sm:rotate-0 rotate-90 flex-shrink-0"
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    {t.roles.hub.name}
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-primary animate-arrow-flow sm:rotate-0 rotate-90 flex-shrink-0"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <span className="text-center px-2 py-1 rounded-lg bg-primary/10">
                    {t.roles.customer.name}
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
                        {role.name === t.roles.customer.name && "🛒"}
                        {role.name === t.roles.hub.name && "🏢"}
                        {role.name === t.roles.restaurant.name && "🍽️"}
                      </span>
                      <span>{role.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>slytherinpls8@gmail.com</span>
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
