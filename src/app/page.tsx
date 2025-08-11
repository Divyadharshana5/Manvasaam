
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import { ArrowRight, Languages, Users, Building, Tractor, Utensils, Mic, Volume2, Square, Loader2, MicOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, translations, languages } from "@/context/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { speechToText } from "@/ai/flows/stt-flow";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { understandNavigation } from "@/ai/flows/navigation-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "confirming_navigation";

interface NavigationConfirmation {
    page: string;
    message: string;
}

const pagePaths: Record<string, string> = {
  restaurantRegistration: '/login/restaurant',
  farmerCustomerLogin: '/login/farmer-customer',
  hubLogin: '/login/hub',
  faq: '/dashboard/faq',
};

const navTranslations: Record<string, Record<string, string>> = {
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
    Urdu: "ایسا लगता ہے کہ آپ کسان اور گاہک لاگ ان صفحہ پر جانا چاہتے ہیں۔ کیا میں آپ کو وہاں لے جاؤں؟",
    Srilanka: "ඔබට ගොවි සහ පාරිභෝගික පිවිසුම් පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඔබව එතැනට ගෙන යා යුතුද?",
  },
  hubLogin: {
    English: "It seems you want to go to the Hub Login page. Should I proceed?",
    Tamil: "நீங்கள் ஹப் உள்நுழைவு பக்கத்திற்குச் செல்ல விரும்புகிறீர்கள் என்று தெரிகிறது. আমি কি আপনাকে সেখানে নিয়ে যাব?",
    Malayalam: "നിങ്ങൾ ഹബ് ലോഗിൻ പേജിലേക്ക് പോകാൻ ആഗ്രഹിക്കുന്നു എന്ന് തോന്നുന്നു. ഞാൻ തുടരണോ?",
    Telugu: "మీరు హబ్ లాగిన్ పేజీకి వెళ్లాలనుకుంటున్నారని అనిపిస్తుంది. నేను కొనసాగించాలా?",
    Hindi: "ऐसा लगता है कि आप हब लॉगिन पृष्ठ पर जाना चाहते हैं। क्या मुझे आगे बढ़ना चाहिए?",
    Kannada: "ನೀವು ಹಬ್ ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ಮುಂದುವರಿಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনি হাব লগইন পৃষ্ঠাতে যেতে চান। আমি কি এগিয়ে যাব?",
    Arabic: "يبدو أنك تريد الذهاب إلى صفحة تسجيل دخول المركز. هل أتابع؟",
    Urdu: "ایسا لگتا ہے کہ آپ حب لاگ ان صفحہ پر جانا چاہتے ہیں۔ کیا میں آگے بڑھوں؟",
    Srilanka: "ඔබට හබ් පිවිසුම් පිටුවට යාමට අවශ්‍ය බව පෙනේ. මම ඉදිරියට යා යුතුද?",
  },
  faq: {
    English: "It sounds like you have a question. Would you like me to take you to the FAQ page?",
    Tamil: "உங்களுக்கு ஒரு கேள்வி இருப்பது போல் தெரிகிறது. ನಾನು ನಿಮ್ಮನ್ನು FAQ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Malayalam: "നിങ്ങൾക്കൊരു ചോദ്യമുണ്ടെന്ന് തോന്നുന്നു. ഞാൻ നിങ്ങളെ പതിവുചോദ്യങ്ങൾ പേജിലേക്ക് കൊണ്ടുപോകണോ?",
    Telugu: "మీకు ఒక ప్రశ్న ఉన్నట్లు అనిపిస్తుంది. నేను మిమ్మల్ని తరచుగా అడిగే ప్రశ్నల పేజీకి తీసుకెళ్లాలా?",
    Hindi: "ऐसा लगता है कि आपका कोई प्रश्न है। क्या आप चाहते हैं कि मैं आपको अक्सर पूछे जाने वाले प्रश्न पृष्ठ पर ले जाऊं?",
    Kannada: "ನಿಮಗೆ ಒಂದು ಪ್ರಶ್ನೆ ಇದೆ ಎಂದು ತೋರುತ್ತದೆ. ನಾನು ನಿಮ್ಮನ್ನು FAQ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಬೇಕೇ?",
    Bengali: "মনে হচ্ছে আপনার একটি প্রশ্ন আছে। আমি কি আপনাকে প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী পৃষ্ঠাতে নিয়ে যাব?",
    Arabic: "يبدو أن لديك سؤال. هل تود أن آخذك إلى صفحة الأسئلة الشائعة؟",
    Urdu: "ایسا لگتا ہے کہ آپ کا کوئی سوال ہے۔ کیا آپ چاہتے ہیں کہ میں آپ کو عمومی سوالات کے صفحے پر لے جاؤں؟",
    Srilanka: "ඔබට ප්‍රශ්නයක් ඇති බව පෙනේ. මම ඔබව නිතර අසන පැන පිටුවට ගෙන යාමට කැමතිද?",
  }
};


export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [lastResponse, setLastResponse] = useState("");
  const [navigationConfirmation, setNavigationConfirmation] = useState<NavigationConfirmation | null>(null);

  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);

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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicrophonePermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Microphone access denied:", error);
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
            description: "Please allow microphone access in your browser settings to use this feature.",
        });
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophonePermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = processAudio;
      
      mediaRecorderRef.current.start();
      setAssistantState("listening");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setHasMicrophonePermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && assistantState === "listening") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
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
        const sttResult = await speechToText({ audioDataUri: base64Audio, language: selectedLanguage });
        const { transcript, intent, pageKey } = sttResult;
        setTranscribedText(transcript);
        
        if (navigationConfirmation) {
            if (transcript.toLowerCase().includes('yes') || transcript.toLowerCase().includes('ஆமாம்')) {
                 router.push(navigationConfirmation.page);
                 setIsAssistantOpen(false);
                 return;
            } else {
                 setNavigationConfirmation(null);
                 setAssistantState("idle");
                 return;
            }
        }
        
        if ((intent === 'navigate' || intent === 'faq') && pageKey && pageKey !== 'none') {
            const pagePath = pagePaths[pageKey];
            const confirmationMessage = navTranslations[pageKey]?.[selectedLanguage] || navTranslations[pageKey]?.['English'];

            if (pagePath && confirmationMessage) {
                setNavigationConfirmation({ page: pagePath, message: confirmationMessage });
                await speak(confirmationMessage);
                setAssistantState("confirming_navigation");
            } else {
                 await speak(`I'm sorry, I couldn't find the right page for "${transcript}".`);
            }
        } else {
          await speak(`I heard you say: "${transcript}". I can only help with navigation right now.`);
        }

      } catch (error: any) {
        console.error("Error during AI processing:", error);
        toast({
          variant: "destructive",
          title: "AI Processing Failed",
          description: error.message || "An unexpected error occurred.",
        });
        setAssistantState("idle");
      }
    };
  };

  const speak = async (text: string) => {
     if (!text.trim()) {
        setAssistantState("idle");
        return;
     };
    setAssistantState("speaking");
    setLastResponse(text);
    setAudioUrl("");
    try {
        const result = await textToSpeech(text);
        setAudioUrl(result.audioDataUri);
    } catch (error: any) {
        console.error("Error converting text to speech:", error);
        toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setAssistantState("idle");
    }
  }
  
  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        audioRef.current.onended = () => {
            if (assistantState !== 'confirming_navigation') {
                setAssistantState('idle');
            } else {
                handleStartRecording();
            }
        };
    } else if(assistantState === 'speaking' && !audioUrl) {
       setAssistantState('idle');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);


  const getButtonState = () => {
      if(hasMicrophonePermission === false) return { disabled: true, text: "Mic Disabled", icon: <MicOff className="mr-2 h-6 w-6" /> };
      switch(assistantState) {
        case 'listening': return { disabled: false, text: "Stop", onClick: handleStopRecording, variant: "destructive", icon: <Square className="mr-2 h-6 w-6" /> };
        case 'thinking':
        case 'speaking': return { disabled: true, text: "Processing...", icon: <Loader2 className="h-6 w-6 animate-spin" /> };
        case 'confirming_navigation':
        case 'idle':
        default: return { disabled: false, text: "Ask", onClick: handleStartRecording, variant: "default", icon: <Mic className="mr-2 h-6 w-6" /> };
      }
  }

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <ManvaasamLogo width={32} height={32} />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </Link>
        <div className="flex items-center gap-4">
             <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                    <Mic className="mr-2 h-4 w-4" />
                    {t.sidebar.voiceAssistant}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
                 <DialogHeader className="text-center pt-4">
                    <DialogTitle>Voice Assistant</DialogTitle>
                    <DialogDescription>
                    Ask me to navigate to a page, like "Go to the restaurant registration page".
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {hasMicrophonePermission === false && (
                        <Alert variant="destructive" className="mb-4">
                        <MicOff className="h-4 w-4" />
                        <AlertTitle>Microphone Access Denied</AlertTitle>
                        <AlertDescription>
                            You have denied microphone access. Please go to your browser settings to enable it for this site.
                        </AlertDescription>
                        </Alert>
                    )}
                
                    <div className="flex justify-center">
                        <Button 
                            onClick={buttonState.onClick} 
                            disabled={buttonState.disabled} 
                            variant={buttonState.variant as any}
                            className="w-48 h-16 text-lg"
                        >
                            {buttonState.icon}
                            {buttonState.text}
                        </Button>
                    </div>
                    
                    {assistantState === 'listening' && <div className="text-center text-destructive animate-pulse">Listening...</div>}
                    
                    <div className="min-h-[8rem] space-y-4 px-2">
                        {transcribedText && (
                            <Alert>
                                <Mic className="h-4 w-4" />
                                <AlertTitle>You Said:</AlertTitle>
                                <AlertDescription>
                                {transcribedText}
                                </AlertDescription>
                            </Alert>
                        )}

                        {lastResponse && (
                            <Alert>
                                <Volume2 className="h-4 w-4" />
                                <AlertTitle>Assistant Said:</AlertTitle>
                                <AlertDescription>
                                    {lastResponse}
                                    {audioUrl && <audio ref={audioRef} src={audioUrl} className="w-full mt-2" />}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
              </DialogContent>
            </Dialog>

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
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 relative z-10">
        <section className="text-center w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-center mb-12" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>{t.tagline}</h1>
          <h2 className="text-3xl font-bold mb-8 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.joinCommunity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userRoles.map((role) => (
              <Card
                key={role.name}
                className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
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
            <Card className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg p-6">
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

