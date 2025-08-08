
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
        question: "How can I be sure about the quality of the products?",
        answer: "We partner directly with trusted farmers who are committed to organic and sustainable farming practices. Each farmer profile on our Matchmaking page provides details about their farm and specialties, so you know exactly where your food is coming from."
    },
    {
        question: "How does the ordering process work?",
        answer: "You can browse products on the 'Products' page and place an order directly using the 'Buy Now' button. After filling in your details, your order is sent to the farmer and our logistics hub for processing. You can track the status of your order on the 'Orders' page."
    },
    {
        question: "How can I track my delivery?",
        answer: "Once an order is shipped, you can track it live from the 'Orders' page by clicking the 'Track Live' button. This will take you to a map view showing your delivery's real-time location and estimated time of arrival."
    },
    {
        question: "What is Manvaasam and how does it help farmers?",
        answer: "Manvaasam is an application that directly connects customers with local farmers. By removing intermediaries, we ensure that farmers get a fair price for their produce, helping them build a sustainable business while providing you with the freshest products."
    },
    {
        question: "Can I contact a farmer directly?",
        answer: "Yes! The 'Matchmaking' page allows you to view farmer profiles and send them a direct inquiry. This is a great way to ask about specific products, farming practices, or arrange bulk orders."
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
