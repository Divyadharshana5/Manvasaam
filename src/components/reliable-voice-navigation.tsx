"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface ReliableVoiceNavigationProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function ReliableVoiceNavigation({
    className = "",
    size = "md"
}: ReliableVoiceNavigationProps) {
    const [isListening, setIsListening] = useState(false);
    const router = useRouter();
    const recognitionRef = useRef<any>(null);

    const routes: Record<string, string> = {
        "dashboard": "/dashboard",
        "home": "/",
        "orders": "/dashboard/orders",
        "products": "/dashboard/products",
        "profile": "/dashboard/profile",
        "farmer": "/login/farmer",
        "customer": "/login/customer",
        "hub": "/login/hub",
        "restaurant": "/login/restaurant",
        "inventory": "/dashboard/hub/inventory",
        "track": "/dashboard/track",
        "help": "/dashboard/faq"
    };

    const findRoute = useCallback((text: string) => {
        const words = text.toLowerCase().split(' ');
        
        // Check each word against routes
        for (const word of words) {
            if (routes[word]) {
                return routes[word];
            }
        }
        
        // Check partial matches
        for (const [key, route] of Object.entries(routes)) {
            if (text.toLowerCase().includes(key)) {
                return route;
            }
        }
        
        return null;
    }, []);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition not supported. Please use Chrome browser.');
            return;
        }

        try {
            // Clean up existing recognition
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }

            const recognition = new (window as any).webkitSpeechRecognition();
            
            // Minimal configuration for maximum compatibility
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
                console.log('Listening started');
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0]?.[0]?.transcript?.trim();
                console.log('Heard:', transcript);
                
                if (transcript) {
                    const route = findRoute(transcript);
                    if (route) {
                        console.log('Navigating to:', route);
                        router.push(route);
                    } else {
                        console.log('No route found for:', transcript);
                    }
                }
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Recognition error:', event.error);
                setIsListening(false);
                
                if (event.error === 'not-allowed') {
                    alert('Please allow microphone access and try again.');
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                console.log('Recognition ended');
            };

            recognitionRef.current = recognition;
            recognition.start();

        } catch (error) {
            console.error('Failed to start recognition:', error);
            setIsListening(false);
            alert('Voice recognition failed. Please try again.');
        }
    }, [findRoute, router]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const handleClick = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10", 
        lg: "w-12 h-12"
    };

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    return (
        <Button
            onClick={handleClick}
            variant={isListening ? "destructive" : "default"}
            className={`${sizeClasses[size]} rounded-full ${className} ${
                isListening ? 'animate-pulse' : ''
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice command"}
        >
            {isListening ? (
                <Square className={iconSizes[size]} />
            ) : (
                <Mic className={iconSizes[size]} />
            )}
        </Button>
    );
}