
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
        question: "How do customers or restaurants contact me?",
        answer: "Customers and restaurants can find your profile on the 'Matchmaking' page and send you a direct inquiry. You will be notified of new messages. Ensure your profile is up-to-date to attract more buyers."
    },
    {
        question: "How do I manage my product listings?",
        answer: "You can manage your products from the 'Products' page in your dashboard. Here, you can add new products, update existing ones with prices and availability, and mark items as 'out of stock'."
    },
    {
        question: "How do I view and process new orders?",
        answer: "All new orders for your products will appear on the 'Orders' page. You can view order details, update the status from 'Processing' to 'Shipped', and prepare the items for pickup by our hub logistics."
    },
    {
        question: "What is the role of the Manvaasam hub?",
        answer: "The Manvaasam hub handles the logistics of getting your products from your farm to the customer. Once you confirm an order, our hub team is notified to arrange for pickup and delivery, so you can focus on farming."
    },
    {
        question: "How does Manvaasam help me get a better price for my produce?",
        answer: "By connecting you directly with customers and restaurants, Manvaasam removes the need for multiple intermediaries. This ensures that a larger portion of the final price comes directly to you, resulting in fairer compensation for your hard work."
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
