"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { speechToText } from "@/ai/flows/stt-flow";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QuickAccessButton } from "@/components/ui/fast-nav";
import { NavigationPerformanceMonitor } from "@/components/ui/navigation-performance";

type AssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "confirming_navigation";

interface NavigationConfirmation {
  page: string;
  message: string;
}

const pagePaths: Record<string, string> = {
  restaurantRegistration: "/login/restaurant",
  farmerCustomerLogin: "/login/farmer-customer",
  hubLogin: "/login/hub",
  faq: "/dashboard/faq",
};

const navTranslations: Record<string, Record<string, string>> = {
  restaurantRegistration: {
    English:
      "It sounds like you want to go to the Restaurant Registration page. Should I take you there?",
  },
  farmerCustomerLogin: {
    English:
      "It looks like you want to go to the Farmer and Customer login page. Shall I take you there?",
  },
  hubLogin: {
    English: "It seems you want to go to the Hub Login page. Should I proceed?",
  },
  faq: {
    English:
      "It sounds like you have a question. Would you like me to take you to the FAQ page?",
    Tamil:
      "உங்களுக்கு ஒரு கேள்வி இருப்பது போல் தெரிகிறது. நான் మిమ్మల్ని తరచుగా అడిగే ప్రశ్఩ల பக்கம் கொண்டு செல்லலாமா?",
    Malayalam:
      "നിങ്ങൾക്കൊരു ചോദ്യമുണ്ടെന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ പതിവുചോദ്യങ്ങൾ പേജിലേക്ക് കൊണ്ടുപോകണോ?",
    Telugu:
      "మీకు ఒక ప్రశ్న ఉన్నట్లు అనిపిస్తుంది. నేను మిమ్మల్ని తరచుగా అడిగే ప్రశ్నల పేజీకి తీసుకెళ్లాలా?",
    Hindi:
      "ऐसा लगता है कि आपका कोई प्रश्न है। क्या आप चाहते हैं कि मैं आपको अक्सर पूछे जाने वाले प्रश्न पृष्ठ पर ले जाऊं?",
    Kannada:
      "ನೀವು ರೆಸ್ಟೋರೆಂಟ್ ನೋಂದಣಿ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು ಅಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Bengali:
      "মনে হচ্ছে আপনি রেস্টুরেন্ট রেজিস্ট্রেশন পৃষ্ঠাতে যেতে চান। আমি কি আপনাকে সেখানে নিয়ে যাব?",
    Arabic:
      "يبدو أنك تريد الذهاب إلى صفحة تسجيل المطعم. هل يجب أن آخذك إلى هناك؟",
    Urdu: "ایسا لگتا ہے کہ آپ کا کوئی سوال ہے۔ کیا آپ چاہتے ہیں کہ میں آپ کو عمومی سوالات کے صفحے پر لے جاؤں؟",
    Srilanka:
      "ඔබට ප්‍රශ්නයක් ඇති බව පෙනේ. මම ඔබව නිතර අසන පැන පිටුවට ගෙන යාමට කැමතිද?",
  },
};

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [lastResponse, setLastResponse] = useState("");
  const [navigationConfirmation, setNavigationConfirmation] =
    useState<NavigationConfirmation | null>(null);

  const [loadingRoleHref, setLoadingRoleHref] = useState<string | null>(null);

  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<
    boolean | null
  >(null);

  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    {
      name: t.roles.restaurant.name,
      description: t.roles.restaurant.description,
      href: "/login/restaurant",
      icon: <Utensils className="h-12 w-12 text-primary" />,
    },
  ];

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasMicrophonePermission(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setHasMicrophonePermission(false);
      }
    };
    if (isAssistantOpen) {
      checkMicrophonePermission();
    }
  }, [isAssistantOpen]);

  const handleStartRecording = async () => {
    setTranscribedText("");
    setLastResponse("");
    setAudioUrl("");
    setNavigationConfirmation(null);

    if (hasMicrophonePermission === false) {
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description:
          "Please allow microphone access in your browser settings to use this feature.",
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = processAudio;

      mediaRecorderRef.current.start();
      setAssistantState("listening");
    } catch {
      setHasMicrophonePermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description:
          "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && assistantState === "listening") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const processAudio = async () => {
    setAssistantState("thinking");
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const sttResult = await speechToText({
          audioDataUri: base64Audio,
          language: selectedLanguage,
        });
        const { transcript } = sttResult;
        setTranscribedText(transcript);

        if (navigationConfirmation) {
          if (
            transcript.toLowerCase().includes("yes") ||
            transcript.toLowerCase().includes("ஆமாம்")
          ) {
            router.push(navigationConfirmation.page);
            setIsAssistantOpen(false);
            return;
          } else {
            setNavigationConfirmation(null);
            setAssistantState("idle");
            return;
          }
        }

        // Simple keyword-based navigation for now
        const transcriptLower = transcript.toLowerCase();
        let pageKey = null;

        if (
          transcriptLower.includes("restaurant") ||
          transcriptLower.includes("ரெஸ்டோரன்ட்")
        ) {
          pageKey = "restaurantRegistration";
        } else if (
          transcriptLower.includes("farmer") ||
          transcriptLower.includes("customer") ||
          transcriptLower.includes("விவசாயி") ||
          transcriptLower.includes("வாடிக்கையாளர்")
        ) {
          pageKey = "farmerCustomerLogin";
        } else if (
          transcriptLower.includes("hub") ||
          transcriptLower.includes("ஹப்")
        ) {
          pageKey = "hubLogin";
        } else if (
          transcriptLower.includes("faq") ||
          transcriptLower.includes("question") ||
          transcriptLower.includes("கேள்வி")
        ) {
          pageKey = "faq";
        }

        if (pageKey && pageKey !== "none") {
          const pagePath = pagePaths[pageKey];
          const confirmationMessage =
            navTranslations[pageKey]?.[selectedLanguage] ||
            navTranslations[pageKey]?.["English"];

          if (pagePath && confirmationMessage) {
            setNavigationConfirmation({
              page: pagePath,
              message: confirmationMessage,
            });
            await speak(confirmationMessage);
            setAssistantState("confirming_navigation");
          } else {
            await speak(
              `I'm sorry, I couldn't find the right page for "${transcript}".`
            );
          }
        } else {
          await speak(
            `I heard you say: "${transcript}". I can only help with navigation right now.`
          );
        }
      } catch {
        toast({
          variant: "destructive",
          title: "AI Processing Failed",
          description: "An unexpected error occurred.",
        });
        setAssistantState("idle");
      }
    };
  };

  const speak = async (text: string) => {
    if (!text.trim()) {
      setAssistantState("idle");
      return;
    }
    setAssistantState("speaking");
    setLastResponse(text);
    setAudioUrl("");
    try {
      const result = await textToSpeech({ text, language: selectedLanguage });
      setAudioUrl(result.audioDataUri);
    } catch {
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "An unexpected error occurred.",
      });
      setAssistantState("idle");
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => {
        if (assistantState !== "confirming_navigation") {
          setAssistantState("idle");
        } else {
          handleStartRecording();
        }
      };
    } else if (assistantState === "speaking" && !audioUrl) {
      setAssistantState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const getButtonState = () => {
    if (hasMicrophonePermission === false)
      return {
        disabled: true,
        text: "Mic Disabled",
        icon: <MicOff className="mr-2 h-6 w-6" />,
      };
    switch (assistantState) {
      case "listening":
        return {
          disabled: false,
          text: "Stop",
          onClick: handleStopRecording,
          variant: "destructive",
          icon: <Square className="mr-2 h-6 w-6" />,
        };
      case "thinking":
      case "speaking":
        return {
          disabled: true,
          text: "Processing...",
          icon: <Loader2 className="h-6 w-6 animate-spin" />,
        };
      case "confirming_navigation":
      case "idle":
      default:
        return {
          disabled: false,
          text: "Ask",
          onClick: handleStartRecording,
          variant: "default",
          icon: <Mic className="mr-2 h-6 w-6" />,
        };
    }
  };

  const handleContinueClick = (href: string) => {
    setLoadingRoleHref(href);
    // The actual navigation is handled by the Link component.
    // The loading state is just for user feedback.
  };

  // Add scroll-based animation for the hero section
  const { scrollY } = useScroll();
  // Fade out and move up as you scroll down
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);
  const heroY = useTransform(scrollY, [0, 300], [0, -100]);

  const buttonState = getButtonState();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <ManvaasamLogo width={32} height={32} />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </Link>
        <div className="flex items-center gap-4">
          <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-primary/90 hover:text-primary-foreground"
              >
                <Mic className="mr-2 h-4 w-4" />
                {t.sidebar.voiceAssistant}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90vw] rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <DialogHeader className="text-center pt-4">
                <DialogTitle>Voice Assistant</DialogTitle>
                <DialogDescription>
                  Ask me to navigate to a page, like "Go to the restaurant
                  registration page".
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex justify-center">
                  <Button
                    onClick={buttonState.onClick}
                    disabled={buttonState.disabled}
                    variant={(buttonState.variant as any) || "default"}
                    className="w-48 h-16 text-lg"
                  >
                    {buttonState.icon}
                    {buttonState.text}
                  </Button>
                </div>

                {assistantState === "listening" && (
                  <div className="text-center text-destructive animate-pulse">
                    Listening...
                  </div>
                )}

                <div className="min-h-[8rem] space-y-4 px-2">
                  {transcribedText && (
                    <Alert variant="info" className="no-animation">
                      <Mic className="h-4 w-4" />
                      <AlertTitle>You Said:</AlertTitle>
                      <AlertDescription>{transcribedText}</AlertDescription>
                    </Alert>
                  )}

                  {lastResponse && (
                    <Alert variant="info" className="no-animation">
                      <Volume2 className="h-4 w-4" />
                      <AlertTitle>Assistant Said:</AlertTitle>
                      <AlertDescription>
                        {lastResponse}
                        {audioUrl && (
                          <audio
                            ref={audioRef}
                            src={audioUrl}
                            className="w-full mt-2"
                          />
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90"
              >
                <Languages className="mr-2 h-4 w-4" />
                {selectedLanguage}
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
      </motion.header>

      <main className="flex min-h-screen flex-col items-center justify-center pt-24 px-4 relative z-10">
        {/* Glassmorphism background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            background: "linear-gradient(135deg, #e6f9ec 0%, #d0f5e3 100%)",
          }}
        ></div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "rgba(220, 255, 220, 0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(180, 255, 200, 0.25)",
          }}
        ></div>
        <motion.section
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center w-full max-w-4xl mx-auto z-10"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-center mb-12 [text-shadow:_0_2px_4px_rgb(0_0_0_/_30%)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t.tagline}
          </motion.h1>
          <motion.h2
            className="text-3xl font-bold mb-8 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {t.joinCommunity}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userRoles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.07, y: -8 }}
              >
                <Card className="bg-white/40 backdrop-blur-xl border border-green-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full">
                  <CardHeader className="items-center flex-shrink-0">
                    {role.icon}
                  </CardHeader>
                  <CardContent className="text-center flex-grow flex flex-col justify-between">
                    <div>
                      <CardTitle className="mt-4 text-2xl">
                        {role.name}
                      </CardTitle>
                      <p className="text-muted-foreground my-4">
                        {role.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-auto"
                      onClick={() => handleContinueClick(role.href)}
                      disabled={loadingRoleHref === role.href}
                    >
                      <Link href={role.href}>
                        {loadingRoleHref === role.href ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {t.continue} <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="w-full max-w-4xl mx-auto mt-24 text-center z-10"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
            {t.ourMission}
          </h2>
          <p className="text-lg text-foreground/90 mb-8 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
            {t.missionStatement}
          </p>
          <Card className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg p-6">
            <CardContent className="p-0 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg font-semibold text-foreground">
                <span>{t.roles.farmer.name}</span>
                <ArrowRight
                  size={24}
                  className="text-primary animate-arrow-flow sm:rotate-0 rotate-90"
                />
                <span>{t.roles.hub.name}</span>
                <ArrowRight
                  size={24}
                  className="text-primary animate-arrow-flow sm:rotate-0 rotate-90"
                  style={{ animationDelay: "0.5s" }}
                />
                <span>{t.roles.customer.name}</span>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <footer className="w-full p-4 text-center text-foreground/80 mt-12 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] relative z-10">
        © {new Date().getFullYear()} Manvaasam. {t.footer}
      </footer>
      {/* Quick Access Button for Fast Navigation */}
      <QuickAccessButton />

      {/* Navigation Performance Monitor */}
      <NavigationPerformanceMonitor />
    </motion.div>
  );
}
