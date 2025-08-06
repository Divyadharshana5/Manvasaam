
"use client";

import { AppLayout } from "@/components/app-layout";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";


const faqItems = [
    {
        question: "What is Manvaasam?",
        answer: "Manvaasam is a platform designed to bridge the gap between farmers and customers. We provide a network for farmers to sell their produce directly, and for customers to buy fresh, organic products."
    },
    {
        question: "How do I register as a Farmer or Customer?",
        answer: "On the homepage, select either 'Farmer' or 'Customer' and click 'Continue'. You will be taken to a registration page where you can create your account."
    },
    {
        question: "What is a Hub?",
        answer: "A Hub is a central point in our logistics network. Hubs manage the collection of produce from farmers and coordinate the delivery to customers, ensuring efficiency and freshness."
    },
    {
        question: "How can I update my profile information?",
        answer: "Navigate to the 'Profile' page from the dashboard sidebar. You will find an option to edit your details like username and phone number."
    },
    {
        question: "Where can I see my orders?",
        answer: "All your recent and past orders are available on the 'Orders' page, accessible from the dashboard sidebar."
    }
]

export default function FaqPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Here are some answers to common questions.
            </p>
          </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Common Questions</CardTitle>
                <CardDescription>Find answers to the most frequently asked questions below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
