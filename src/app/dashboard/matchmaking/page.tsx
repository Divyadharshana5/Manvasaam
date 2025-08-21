
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { MapPin, Leaf, MessageSquare, Send, Loader2, Phone, Video } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";


const farmers = [
  {
    name: "Rajesh Kumar",
    location: "Pune, Maharashtra",
    specialties: ["Tomatoes", "Onions", "Leafy Greens"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "indian farmer",
    phone: "+91 98765 43210",
    rating: 4.8,
    experience: "10 years",
    verified: true,
  },
  {
    name: "Anjali Devi",
    location: "Mysuru, Karnataka",
    specialties: ["Mangoes", "Coconuts", "Spices"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "indian farmer woman",
    phone: "+91 87654 32109",
    rating: 4.6,
    experience: "8 years",
    verified: true,
  },
  {
    name: "Sandeep Singh",
    location: "Ludhiana, Punjab",
    specialties: ["Wheat", "Potatoes", "Carrots"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "punjabi farmer",
    phone: "+91 76543 21098",
    rating: 4.9,
    experience: "15 years",
    verified: true,
  },
   {
    name: "Priya Patel",
    location: "Anand, Gujarat",
    specialties: ["Organic Milk", "Okra", "Chilies"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "gujarati woman",
    phone: "+91 65432 10987",
    rating: 4.7,
    experience: "12 years",
    verified: true,
  }
];

const inquirySchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

function ContactFarmerForm({ farmerName, onClose }: { farmerName: string; onClose: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof inquirySchema>) {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: t.matchmaking.inquirySuccessTitle,
      description: t.matchmaking.inquirySuccessDescription.replace('{farmerName}', farmerName),
    });
    
    setIsSending(false);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.matchmaking.subjectLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.matchmaking.subjectPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.matchmaking.messageLabel}</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder={t.matchmaking.messagePlaceholder.replace('{farmerName}', farmerName)} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSending}>{t.matchmaking.cancel}</Button>
          </DialogClose>
          <Button type="submit" disabled={isSending}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {t.matchmaking.send}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


export default function MatchmakingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.matchmaking.title}</h2>
            <p className="text-muted-foreground">
              {t.matchmaking.description}
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer, index) => (
              <Dialog key={index} onOpenChange={setIsDialogOpen}>
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={farmer.avatar} data-ai-hint={farmer.dataAiHint} />
                            <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{farmer.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" /> {farmer.location}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{farmer.rating}</span>
                          </div>
                          <span>{farmer.experience}</span>
                          {farmer.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-primary"/> {t.matchmaking.specializesIn}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                              {farmer.specialties.map(specialty => (
                                  <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                              ))}
                          </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <DialogTrigger asChild>
                             <Button variant="outline" className="flex-1">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                            </Button>
                        </DialogTrigger>
                        <Button className="flex-1">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                    </CardFooter>
                </Card>
                 <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chat with {farmer.name}</DialogTitle>
                      <DialogDescription>
                        Start a conversation to discuss products and orders.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="h-64 border rounded-lg p-4 bg-muted/20">
                        <p className="text-sm text-muted-foreground text-center mt-20">
                          Chat interface would be implemented here
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Video className="mr-2 h-4 w-4" />
                          Video Call
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Phone className="mr-2 h-4 w-4" />
                          Voice Call
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
              </Dialog>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
