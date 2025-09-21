"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserType } from "@/lib/auth-redirect";

type VoiceState = "idle" | "listening" | "processing";

interface SimpleVoiceNavigationProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function SimpleVoiceNavigation({
    className = "",
    size = "md"
}: SimpleVoiceNavigationProps) {
    const { selectedLanguage } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [voiceState, setVoiceState] = useState<VoiceState>("idle");
    const recognitionRef = useRef<any>(null);
    const retryCountRef = useRef(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                    recognitionRef.current = null;
                } catch (error) {
                    console.error('Error cleaning up speech recognition:', error);
                }
            }
        };
    }, []);

    // Protected routes that require authentication
    const protectedRoutes = [
        "dashboard", "orders", "products", "track", "profile",
        "inventory", "matchmaking", "analytics", "reports", "settings"
    ];

    // Get route mappings based on user type and current context
    const getRouteMapping = useCallback(() => {
        const userType = getUserType();
        const currentPath = window.location.pathname;

        const baseRoutes: Record<string, string> = {
            "home": "/",
            "faq": "/dashboard/faq",
            "help": "/dashboard/faq",
            "support": "/dashboard/faq"
        };

        // User-specific routes
        if (userType === 'restaurant' || currentPath.includes('/restaurant')) {
            return {
                ...baseRoutes,
                "dashboard": "/dashboard/restaurant",
                "orders": "/dashboard/restaurant/orders",
                "products": "/dashboard/restaurant/products",
                "inventory": "/dashboard/restaurant/inventory",
                "farmers": "/dashboard/restaurant/farmers",
                "reports": "/dashboard/restaurant/reports",
                "analytics": "/dashboard/restaurant/reports",
                "settings": "/dashboard/restaurant/settings",
                "profile": "/dashboard/profile"
            };
        }

        if (userType === 'farmer' || currentPath.includes('/farmer')) {
            return {
                ...baseRoutes,
                "dashboard": "/dashboard/farmer",
                "products": "/dashboard/farmer/products",
                "matchmaking": "/dashboard/farmer/matchmaking",
                "analytics": "/dashboard/farmer/analytics",
                "orders": "/dashboard/orders",
                "profile": "/dashboard/profile"
            };
        }

        if (userType === 'hub' || currentPath.includes('/hub')) {
            return {
                ...baseRoutes,
                "dashboard": "/dashboard/hub",
                "orders": "/dashboard/hub/orders",
                "inventory": "/dashboard/hub/inventory",
                "attendance": "/dashboard/hub/attendance",
                "analytics": "/dashboard/hub/analytics",
                "profile": "/dashboard/profile"
            };
        }

        if (userType === 'customer' || currentPath.includes('/customer')) {
            return {
                ...baseRoutes,
                "dashboard": "/dashboard/customer",
                "products": "/dashboard/products",
                "orders": "/dashboard/orders",
                "track": "/dashboard/track",
                "cart": "/dashboard/customer/cart",
                "settings": "/dashboard/customer/settings",
                "profile": "/dashboard/profile"
            };
        }

        // Default routes
        return {
            ...baseRoutes,
            "dashboard": "/dashboard",
            "orders": "/dashboard/orders",
            "products": "/dashboard/products",
            "track": "/dashboard/track",
            "profile": "/dashboard/profile"
        };
    }, []);

    // Get messages in selected language
    const getMessages = useCallback(() => {
        const messages: Record<string, Record<string, string>> = {
            notFound: {
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
            },
            loginRequired: {
                English: "Please login first. Taking you to login page.",
                Tamil: "முதலில் உள்நுழையவும். உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.",
                Hindi: "कृपया पहले लॉगिन करें। लॉगिन पेज पर ले जा रहे हैं।",
                Malayalam: "ദയവായി ആദ്യം ലോഗിൻ ചെയ്യുക. ലോഗിൻ പേജിലേക്ക് കൊണ്ടുപോകുന്നു.",
                Telugu: "దయచేసి మొదట లాగిన్ చేయండి. లాగిన్ పేజీకి తీసుకెళ్తున్నాము.",
                Kannada: "ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ. ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಕೊಂಡೊಯ್ಯುತ್ತಿದ್ದೇವೆ.",
                Bengali: "অনুগ্রহ করে প্রথমে লগইন করুন। লগইন পেজে নিয়ে যাচ্ছি।",
                Arabic: "يرجى تسجيل الدخول أولاً. نأخذك إلى صفحة تسجيل الدخول.",
                Urdu: "پہلے لاگ ان کریں۔ لاگ ان صفحے پر لے جا رہے ہیں۔",
                Srilanka: "කරුණාකර මුලින්ම ලොගින් වන්න. ලොගින් පිටුවට ගෙන යමින්."
            },
            navigating: {
                English: "Going to",
                Tamil: "செல்கிறேன்",
                Hindi: "जा रहे हैं",
                Malayalam: "പോകുന്നു",
                Telugu: "వెళ్తున్నాము",
                Kannada: "ಹೋಗುತ್ತಿದ್ದೇವೆ",
                Bengali: "যাচ্ছি",
                Arabic: "الذهاب إلى",
                Urdu: "جا رہے ہیں",
                Srilanka: "යමින්"
            }
        };

        return {
            notFound: messages.notFound[selectedLanguage] || messages.notFound.English,
            loginRequired: messages.loginRequired[selectedLanguage] || messages.loginRequired.English,
            navigating: messages.navigating[selectedLanguage] || messages.navigating.English
        };
    }, [selectedLanguage]);

    // Check if route requires authentication
    const isProtectedRoute = useCallback((routeKey: string) => {
        return protectedRoutes.includes(routeKey.toLowerCase());
    }, []);

    // Get login page based on current context
    const getLoginPage = useCallback(() => {
        const userType = getUserType();
        const currentPath = window.location.pathname;

        if (userType === 'restaurant' || currentPath.includes('/restaurant')) return '/login/restaurant';
        if (userType === 'farmer' || currentPath.includes('/farmer')) return '/login/farmer';
        if (userType === 'hub' || currentPath.includes('/hub')) return '/login/hub';
        if (userType === 'customer' || currentPath.includes('/customer')) return '/login/customer';

        // Default to home page which has login options
        return '/';
    }, []);

    // Process voice command and navigate
    const processVoiceCommand = useCallback((transcript: string) => {
        const command = transcript.toLowerCase().trim();
        const routeMapping = getRouteMapping();
        const messages = getMessages();

        // Remove common navigation words
        const navigationWords = ['go to', 'navigate to', 'open', 'show', 'take me to', 'visit', 'page'];
        let targetPage = command;

        navigationWords.forEach(word => {
            if (command.includes(word)) {
                targetPage = command.replace(word, '').trim();
            }
        });

        // Find matching route
        const route = Object.prototype.hasOwnProperty.call(routeMapping, targetPage)
            ? routeMapping[targetPage as keyof typeof routeMapping]
            : undefined;

        if (route) {
            // Check if route requires authentication
            if (isProtectedRoute(targetPage) && !user) {
                // Store the intended destination and redirect to login
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('redirectAfterLogin', route);
                }

                speak(messages.loginRequired);
                setTimeout(() => {
                    router.push(getLoginPage());
                }, 2500);
            } else {
                // Navigate directly
                speak(`${messages.navigating} ${targetPage}`);
                setTimeout(() => {
                    router.push(route);
                }, 1500);
            }
        } else {
            // Page not found
            speak(messages.notFound);
        }
    }, [user, router, getRouteMapping, isProtectedRoute, getLoginPage, getMessages]);

    // Text-to-speech function
    const speak = useCallback((text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Set language based on selected language
            const languageCodes: Record<string, string> = {
                English: "en-US",
                Tamil: "ta-IN",
                Hindi: "hi-IN",
                Malayalam: "ml-IN",
                Telugu: "te-IN",
                Kannada: "kn-IN",
                Bengali: "bn-IN",
                Arabic: "ar-SA",
                Urdu: "ur-PK",
                Srilanka: "si-LK"
            };

            utterance.lang = languageCodes[selectedLanguage] || "en-US";
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;

            window.speechSynthesis.speak(utterance);
        }
    }, [selectedLanguage]);

    // Start voice recognition
    const startListening = useCallback(() => {
        // Check browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast({
                variant: "destructive",
                title: "Not Supported",
                description: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
            });
            return;
        }

        try {
            // Reset retry counter for new session
            retryCountRef.current = 0;
            
            // Clean up any existing recognition
            if (recognitionRef.current) {
                recognitionRef.current.abort();
                recognitionRef.current = null;
            }

            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            // Configure recognition settings for offline use
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;
            
            // Force offline mode to avoid network dependency
            if ('serviceURI' in recognitionRef.current) {
                recognitionRef.current.serviceURI = '';
            }
            
            // Always use en-US for better offline compatibility
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setVoiceState("listening");
                console.log('Voice recognition started');
            };

            recognitionRef.current.onresult = (event: any) => {
                try {
                    const transcript = event.results[0]?.[0]?.transcript;
                    if (transcript && transcript.trim()) {
                        console.log('Voice transcript:', transcript);
                        setVoiceState("processing");
                        processVoiceCommand(transcript);
                        setTimeout(() => setVoiceState("idle"), 3000);
                    } else {
                        setVoiceState("idle");
                        toast({
                            variant: "destructive",
                            title: "No Speech Detected",
                            description: "Please speak clearly and try again.",
                        });
                    }
                } catch (error) {
                    console.error('Error processing speech result:', error);
                    setVoiceState("idle");
                    toast({
                        variant: "destructive",
                        title: "Processing Error",
                        description: "Error processing speech. Please try again.",
                    });
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setVoiceState("idle");
                
                // Handle network errors with retry
                if (event.error === 'network' && retryCountRef.current < 2) {
                    retryCountRef.current++;
                    console.log(`Network error, retrying... (${retryCountRef.current}/2)`);
                    
                    // Try again with minimal settings
                    setTimeout(() => {
                        try {
                            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                            const newRecognition = new SpeechRecognition();
                            
                            // Minimal configuration for better compatibility
                            newRecognition.continuous = false;
                            newRecognition.interimResults = false;
                            newRecognition.lang = 'en-US';
                            
                            newRecognition.onresult = recognitionRef.current.onresult;
                            newRecognition.onend = () => {
                                setVoiceState("idle");
                                retryCountRef.current = 0;
                            };
                            newRecognition.onerror = () => {
                                setVoiceState("idle");
                                retryCountRef.current = 0;
                                toast({
                                    variant: "destructive",
                                    title: "Voice Recognition Failed",
                                    description: "Please try speaking again or use manual navigation.",
                                });
                            };
                            
                            recognitionRef.current = newRecognition;
                            setVoiceState("listening");
                            newRecognition.start();
                            
                        } catch (error) {
                            setVoiceState("idle");
                            retryCountRef.current = 0;
                        }
                    }, 500);
                    return;
                }
                
                // Reset retry count
                retryCountRef.current = 0;
                
                let errorMessage = "Could not recognize speech. Please try again.";
                
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = "No speech detected. Please speak clearly and try again.";
                        break;
                    case 'audio-capture':
                        errorMessage = "Microphone not accessible. Please check your microphone permissions.";
                        break;
                    case 'not-allowed':
                        errorMessage = "Microphone access denied. Please allow microphone permissions and try again.";
                        break;
                    case 'network':
                        errorMessage = "Voice recognition is having connectivity issues. Please try manual navigation.";
                        break;
                    case 'service-not-allowed':
                        errorMessage = "Speech service not available. Please try again later.";
                        break;
                    case 'bad-grammar':
                        errorMessage = "Speech recognition failed. Please speak more clearly.";
                        break;
                    case 'language-not-supported':
                        errorMessage = "Language not supported. Using English instead.";
                        break;
                }
                
                toast({
                    variant: "destructive",
                    title: "Voice Recognition Error",
                    description: errorMessage,
                });
            };

            recognitionRef.current.onend = () => {
                console.log('Voice recognition ended');
                if (voiceState === "listening") {
                    setVoiceState("idle");
                }
            };

            // Start recognition with error handling
            recognitionRef.current.start();
            
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setVoiceState("idle");
            toast({
                variant: "destructive",
                title: "Initialization Error",
                description: "Could not start voice recognition. Please refresh the page and try again.",
            });
        }
    }, [processVoiceCommand, toast, voiceState, selectedLanguage]);

    // Stop listening
    const stopListening = useCallback(() => {
        try {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
            setVoiceState("idle");
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            setVoiceState("idle");
        }
    }, []);

    // Handle button click - immediately start listening
    const handleClick = useCallback(() => {
        if (voiceState === "idle") {
            startListening();
        } else if (voiceState === "listening") {
            stopListening();
        }
    }, [voiceState, startListening, stopListening]);

    const getButtonProps = () => {
        const sizeClasses = {
            sm: "w-10 h-10",
            md: "w-12 h-12",
            lg: "w-16 h-16"
        };

        const iconSizes = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-7 w-7"
        };

        switch (voiceState) {
            case "listening":
                return {
                    variant: "destructive" as const,
                    className: `${sizeClasses[size]} rounded-full ${className} animate-pulse border-2 border-red-400`,
                    children: <Square className={iconSizes[size]} />,
                    disabled: false
                };
            case "processing":
                return {
                    variant: "secondary" as const,
                    className: `${sizeClasses[size]} rounded-full ${className}`,
                    children: <Loader2 className={`${iconSizes[size]} animate-spin`} />,
                    disabled: true
                };
            default:
                return {
                    variant: "default" as const,
                    className: `${sizeClasses[size]} rounded-full ${className} bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200`,
                    children: <Mic className={iconSizes[size]} />,
                    disabled: false
                };
        }
    };

    const buttonProps = getButtonProps();

    return (
        <Button
            onClick={handleClick}
            {...buttonProps}
            aria-label={
                voiceState === "listening"
                    ? "Stop recording"
                    : voiceState === "processing"
                        ? "Processing voice command"
                        : "Start voice command"
            }
        />
    );
}