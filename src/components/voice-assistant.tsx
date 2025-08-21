"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
    className?: string;
}

export function VoiceAssistant({ className }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    // Navigation routes mapping
    const navigationRoutes = {
        dashboard: '/dashboard',
        profile: '/dashboard/profile',
        orders: '/dashboard/orders',
        products: '/dashboard/products',
        track: '/dashboard/track',
        tracking: '/dashboard/track',
        matchmaking: '/dashboard/matchmaking',
        marketing: '/dashboard/marketing',
        faq: '/dashboard/faq',
        help: '/dashboard/faq',
        'hub dashboard': '/dashboard/hub',
        'hub inventory': '/dashboard/hub/inventory',
        inventory: '/dashboard/hub/inventory',
        farmers: '/dashboard/hub/farmers',
        deliveries: '/dashboard/hub/deliveries',
        analytics: '/dashboard/hub/analytics',
        home: '/dashboard',
        login: '/',
        logout: '/logout',
        'voice help': '/voice-assistant-help'
    };

    useEffect(() => {
        // Check if speech recognition is supported
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                setIsSupported(true);
                recognitionRef.current = new SpeechRecognition();

                if (recognitionRef.current) {
                    recognitionRef.current.continuous = false;
                    recognitionRef.current.interimResults = false;
                    recognitionRef.current.lang = 'en-US';

                    recognitionRef.current.onstart = () => {
                        setIsListening(true);
                        // Set timeout to auto-stop after 10 seconds
                        timeoutRef.current = setTimeout(() => {
                            if (recognitionRef.current && isListening) {
                                recognitionRef.current.stop();
                                toast({
                                    title: "Voice Assistant",
                                    description: "Listening timeout. Please try again."
                                });
                            }
                        }, 10000);
                    };

                    recognitionRef.current.onend = () => {
                        setIsListening(false);
                        // Clear timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }
                        // Clear transcript after a delay
                        setTimeout(() => {
                            setTranscript('');
                        }, 3000);
                    };

                    recognitionRef.current.onresult = (event) => {
                        const result = event.results[0][0].transcript.toLowerCase().trim();
                        setTranscript(result);

                        // Clear timeout since we got a result
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }

                        // Auto-stop after recognizing command
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                        }

                        // Handle the command after stopping
                        setTimeout(() => {
                            handleVoiceCommand(result);
                        }, 100);
                    };

                    recognitionRef.current.onerror = (event) => {
                        setIsListening(false);
                        setTranscript('');

                        // Clear timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }

                        // Stop recognition on error
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                        }

                        // Handle different error types silently for network errors
                        if (event.error === 'network') {
                            // Network errors are common and expected, don't show error toast
                            console.warn('Speech recognition network error (expected)');
                            return;
                        }

                        // Only show toast for other types of errors
                        if (event.error !== 'aborted' && event.error !== 'no-speech') {
                            toast({
                                variant: "destructive",
                                title: "Voice Recognition Error",
                                description: "Please try again or check your microphone permissions."
                            });
                        }
                    };
                }
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleVoiceCommand = (command: string) => {
        // Clean the command
        const cleanCommand = command.replace(/^(go to|navigate to|open|show me|take me to)\s*/i, '').trim();

        // Check for navigation commands
        const route = navigationRoutes[cleanCommand as keyof typeof navigationRoutes];

        if (route) {
            speak(`Navigating to ${cleanCommand}`);
            router.push(route);
            toast({
                title: "Navigation",
                description: `Navigating to ${cleanCommand}`
            });
        } else if (cleanCommand.includes('help') || cleanCommand.includes('what can you do') || cleanCommand.includes('commands')) {
            const helpMessage = "I can help you navigate through the app. Try saying: go to dashboard, open profile, show orders, or navigate to inventory. Say 'voice help' for more details.";
            speak(helpMessage);
            toast({
                title: "Voice Assistant Help",
                description: helpMessage
            });
        } else if (cleanCommand.includes('voice help') || cleanCommand === 'help page') {
            speak("Opening voice assistant help page");
            router.push('/voice-assistant-help');
            toast({
                title: "Voice Help",
                description: "Opening voice assistant help page"
            });
        } else {
            const errorMessage = "I'm dedicated to helping you navigate through this agricultural platform. Please say commands like 'go to dashboard', 'open profile', or 'show orders'. Say 'voice help' for more information.";
            speak(errorMessage);
            toast({
                variant: "destructive",
                title: "Command Not Recognized",
                description: errorMessage
            });
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                toast({
                    title: "Voice Assistant",
                    description: "Listening... Say a navigation command."
                });
            } catch (error) {
                console.error('Error starting recognition:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not start voice recognition. Please check microphone permissions."
                });
            }
        }
    };

    if (!isSupported) {
        return null; // Don't render if not supported
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={toggleListening}
                className={cn(
                    "relative transition-all duration-200",
                    isListening && "animate-pulse bg-red-500 hover:bg-red-600"
                )}
                title="Voice Assistant - Click to speak navigation commands"
            >
                {isListening ? (
                    <MicOff className="h-4 w-4" />
                ) : (
                    <Mic className="h-4 w-4" />
                )}
                {isListening && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full animate-ping" />
                )}
            </Button>

            {transcript && (
                <div className="hidden md:block text-xs text-muted-foreground max-w-32 truncate">
                    "{transcript}"
                </div>
            )}
        </div>
    );
}