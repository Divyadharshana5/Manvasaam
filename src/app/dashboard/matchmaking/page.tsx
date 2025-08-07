
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
import { MapPin, Leaf, MessageSquare, Send, Loader2 } from "lucide-react";
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
  },
  {
    name: "Anjali Devi",
    location: "Mysuru, Karnataka",
    specialties: ["Mangoes", "Coconuts", "Spices"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "indian farmer woman",
  },
  {
    name: "Sandeep Singh",
    location: "Ludhiana, Punjab",
    specialties: ["Wheat", "Potatoes", "Carrots"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "punjabi farmer",
  },
   {
    name: "Priya Patel",
    location: "Anand, Gujarat",
    specialties: ["Organic Milk", "Okra", "Chilies"],
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "gujarati woman",
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
                    <CardContent className="flex-grow">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Leaf className="h-4 w-4 text-primary"/> {t.matchmaking.specializesIn}</h4>
                        <div className="flex flex-wrap gap-2">
                            {farmer.specialties.map(specialty => (
                                <span key={specialty} className="bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">{specialty}</span>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <DialogTrigger asChild>
                             <Button className="w-full">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t.matchmaking.sendInquiry}
                            </Button>
                        </DialogTrigger>
                    </CardFooter>
                </Card>
                 <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.matchmaking.dialogTitle} {farmer.name}</DialogTitle>
                      <DialogDescription>
                        {t.matchmaking.dialogDescription}
                      </DialogDescription>
                    </DialogHeader>
                    <ContactFarmerForm farmerName={farmer.name} onClose={() => setIsDialogOpen(false)} />
                  </DialogContent>
              </Dialog>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
