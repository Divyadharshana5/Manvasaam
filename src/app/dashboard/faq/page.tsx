
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
import { useLanguage } from "@/context/language-context";


const faqItems = [
    {
        question: "What is my role as a Manvaasam Hub?",
        answer: "Your role is to act as the central logistics and coordination point between farmers and customers. You manage incoming orders from various customers, coordinate the pickup of fresh produce from farmers, and ensure timely and efficient delivery."
    },
    {
        question: "How can I see all the orders assigned to my hub?",
        answer: "You can view and manage all orders assigned to your hub from the 'Orders' page in your dashboard. This page provides details on the customer, the products ordered, and the current status of each order."
    },
    {
        question: "How do I connect with farmers for produce pickup?",
        answer: "The 'Matchmaking' page allows you to see profiles of farmers in your network. You can find their locations and the products they specialize in, helping you to efficiently plan your pickup routes."
    },
    {
        question: "How do I get information about the customers I need to deliver to?",
        answer: "Customer information, including their delivery address, is available within each order on the 'Orders' page. The platform automatically assigns orders to your hub based on your operational area."
    },
    {
        question: "What happens if a product in an order is unavailable?",
        answer: "If a farmer informs you that a product is unavailable, you should first check if another farmer in your network can fulfill that item. If not, you will need to contact the customer to inform them of the situation and discuss potential replacements or a refund for that item. It is important to encourage farmers to keep their product listings up-to-date."
    }
]

export default function FaqPage() {
  const { t } = useLanguage();
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t.faq.title}
            </h2>
            <p className="text-muted-foreground">
              {t.faq.description}
            </p>
          </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>{t.faq.cardTitle}</CardTitle>
                <CardDescription>{t.faq.cardDescription}</CardDescription>
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
