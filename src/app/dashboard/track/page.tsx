
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const mockTrackingData = {
    "ORD002": {
        path: [
            { name: "Origin Hub, Chennai", position: { top: '80%', left: '85%' } },
            { name: "State Warehouse, Maharashtra", position: { top: '50%', left: '60%' } },
            { name: "Local Hub, Mumbai", position: { top: '40%', left: '40%' } },
            { name: "Out for Delivery", position: { top: '30%', left: '20%' } },
        ],
        eta: "15 minutes",
    },
    "ORD003": {
         path: [
            { name: "Origin Hub, Ahmedabad", position: { top: '75%', left: '25%' } },
            { name: "State Warehouse, Gujarat", position: { top: '60%', left: '45%' } },
            { name: "In Transit", position: { top: '45%', left: '65%' } },
            { name: "Destination Hub", position: { top: '30%', left: '80%' } },
        ],
        eta: "45 minutes",
    },
     "ORD005": {
         path: [
            { name: "Origin Hub, Madurai", position: { top: '85%', left: '70%' } },
            { name: "State Warehouse, Tamil Nadu", position: { top: '65%', left: '50%' } },
            { name: "In Transit", position: { top: '40%', left: '30%' } },
            { name: "Destination Hub", position: { top: '20%', left: '15%' } },
        ],
        eta: "1 hour 20 minutes",
    }
};

function LiveTrackingPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || "ORD002"; // Fallback for direct access
    
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    
    const trackingInfo = mockTrackingData[orderId as keyof typeof mockTrackingData] || mockTrackingData["ORD002"];
    const totalSteps = trackingInfo.path.length - 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                setCurrentStep(Math.floor(newProgress / (100 / totalSteps)));
                return newProgress;
            });
        }, 500); // Update every 0.5 seconds for smoother animation

        return () => clearInterval(interval);
    }, [totalSteps]);
    
    const truckPosition = () => {
        if (currentStep >= totalSteps) {
            return trackingInfo.path[totalSteps].position;
        }

        const start = trackingInfo.path[currentStep].position;
        const end = trackingInfo.path[currentStep + 1].position;
        
        const startTop = parseFloat(start.top);
        const startLeft = parseFloat(start.left);
        const endTop = parseFloat(end.top);
        const endLeft = parseFloat(end.left);

        const progressInStep = (progress % (100 / totalSteps)) / (100 / totalSteps);
        
        const currentTop = startTop + (endTop - startTop) * progressInStep;
        const currentLeft = startLeft + (endLeft - startLeft) * progressInStep;

        return { top: `${currentTop}%`, left: `${currentLeft}%` };
    };
    
    const currentStatus = trackingInfo.path[currentStep]?.name || "Dispatched";

    return (
        <AppLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Live Order Tracking</h2>
                        <p className="text-muted-foreground">
                            Watching order {orderId} in real-time.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Delivery is on its way!</CardTitle>
                        <CardDescription>Estimated Time of Arrival: <span className="text-primary font-bold">{trackingInfo.eta}</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden border">
                            {/* This is a mock map background */}
                             <div 
                                className="absolute inset-0 bg-cover bg-center opacity-30" 
                                style={{ backgroundImage: "url('https://placehold.co/1000x800.png?text=Map+View')" }}
                                data-ai-hint="map road"
                             ></div>

                            {/* Path markers */}
                            {trackingInfo.path.map((step, index) => (
                                <div key={index} className="absolute" style={{ top: step.position.top, left: step.position.left, transform: 'translate(-50%, -50%)' }}>
                                    <div className="h-3 w-3 rounded-full bg-primary/50"></div>
                                    <span className="text-xs text-muted-foreground -translate-x-1/2 relative left-1/2 text-center block mt-1 whitespace-nowrap">{step.name}</span>
                                </div>
                            ))}

                            {/* Truck Icon */}
                            <div className="absolute transition-all duration-500 ease-linear" style={truckPosition()}>
                                <Truck className="h-8 w-8 text-primary -rotate-45" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold">Current Status: <span className="text-primary">{currentStatus}</span></h3>
                            <Progress value={progress} />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LiveTrackingPage />
        </Suspense>
    );
}
