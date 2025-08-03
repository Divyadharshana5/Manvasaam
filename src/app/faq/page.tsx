import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqItems = [
  {
    question: "How do I list a crop for sale?",
    answer:
      "As a farmer, navigate to the 'Crop Market' page and click the 'Add New Listing' button. Fill in the details about your crop, including type, quantity, price, and expected harvest date.",
  },
  {
    question: "How can I place an order?",
    answer:
      "As a buyer, you can browse the 'Crop Market'. When you find a crop you want to purchase, click the 'Place Order' button on the respective row and specify the quantity you need.",
  },
  {
    question: "How does the AI Matchmaking work?",
    answer:
      "Our AI Matchmaking tool helps buyers find the most suitable farmers. Go to the 'AI Matchmaking' page, enter your requirements (crop type, location, quantity, price), and our AI will provide a list of the best matches based on availability, proximity, and cost.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You can track all your orders on the 'Orders' page. Click on 'View Details' for any order to see its current status and detailed logistics timeline, from the farm to your location.",
  },
  {
    question: "Can I change my user role?",
    answer:
      "User roles are typically assigned upon registration and verified by an administrator to ensure platform integrity. If you need to change your role, please contact our support team through the support page.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Find answers to common questions about AgriLink.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>
            Everything you need to know to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
