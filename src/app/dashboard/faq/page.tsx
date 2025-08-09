
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
        question: "How do I place an order for specific products from a farmer?",
        answer: "You can browse available products on the 'Products' page. Once you find what you need, you can select the quantity and add it to your order. The platform will then match you with a farmer who can fulfill your request."
    },
    {
        question: "Can I see the list of available farmers and their specialties?",
        answer: "Yes, the 'Matchmaking' page provides a list of all registered farmers in the network. You can view their profiles to see what they specialize in and their location, helping you source the best local ingredients for your restaurant."
    },
    {
        question: "How do I track my order status?",
        answer: "You can view the status of all your current and past orders on the 'Orders' page. For active deliveries, you can use the 'Track Order' feature to see live updates on its location and estimated time of arrival."
    },
    {
        question: "What is Manvaasam and how does it benefit my restaurant?",
        answer: "Manvaasam is a platform designed to connect restaurants like yours directly with local farmers. This allows you to source fresh, high-quality ingredients while supporting local agriculture and ensuring a transparent supply chain."
    },
    {
        question: "What if there's an issue with my order or the quality of the products?",
        answer: "If you encounter any issues with your order, please contact our support team immediately through the app. We are committed to ensuring the quality of all products and will work with you and the farmer to resolve the situation promptly."
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
