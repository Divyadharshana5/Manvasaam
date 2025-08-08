
"use client";

import { Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from "@/components/app-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Truck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


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

const cancellationSchema = z.object({
  reason: z.enum(["mistake", "timing", "item", "other"]),
  otherDetails: z.string().optional(),
}).refine(data => {
    if (data.reason === 'other') {
        return data.otherDetails && data.otherDetails.length >= 10;
    }
    return true;
}, {
    message: "Please provide at least 10 characters for your reason.",
    path: ["otherDetails"],
});


function LiveTrackingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const orderId = searchParams.get('orderId') || "ORD002"; // Fallback for direct access
    
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCancelling, setIsCancelling] = useState(false);
    
    const trackingInfo = mockTrackingData[orderId as keyof typeof mockTrackingData] || mockTrackingData["ORD002"];
    const totalSteps = trackingInfo.path.length - 1;

    const form = useForm<z.infer<typeof cancellationSchema>>({
        resolver: zodResolver(cancellationSchema),
        defaultValues: {
            reason: "mistake",
            otherDetails: "",
        }
    });
    
    const selectedReason = form.watch("reason");

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

    const onCancelSubmit = async (values: z.infer<typeof cancellationSchema>) => {
        setIsCancelling(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would also update the local order state if needed,
        // e.g., by refetching or updating the localStorage entry.
        
        toast({
            title: "Order Cancellation Requested",
            description: `Your request to cancel order ${orderId} has been submitted.`,
        });
        
        setIsCancelling(false);
        router.push("/dashboard/orders");
    };

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
                     <CardFooter className="flex justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Cancel Order {orderId}</DialogTitle>
                                    <DialogDescription>
                                        Please let us know why you're cancelling. This helps us improve our service.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onCancelSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="reason"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Reason for Cancellation</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value="mistake" /></FormControl>
                                                                <FormLabel className="font-normal">Ordered by mistake</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value="timing" /></FormControl>
                                                                <FormLabel className="font-normal">Delivery timing is not suitable</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value="item" /></FormControl>
                                                                <FormLabel className="font-normal">Incorrect item was ordered</FormLabel>
                                                            </FormItem>
                                                             <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value="other" /></FormControl>
                                                                <FormLabel className="font-normal">Other</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {selectedReason === 'other' && (
                                            <FormField
                                                control={form.control}
                                                name="otherDetails"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Please specify</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Tell us more..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="ghost" disabled={isCancelling}>Back</Button>
                                            </DialogClose>
                                            <Button type="submit" variant="destructive" disabled={isCancelling}>
                                                {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Confirm Cancellation
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
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
