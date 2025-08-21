"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Users,
  Shield,
  Smartphone,
  Truck,
  CreditCard,
  Leaf,
  MessageCircle,
  Star,
  Clock,
} from "lucide-react";

const faqCategories = [
  {
    id: "farmers",
    title: "Farmer Connections",
    icon: Users,
    color: "bg-green-100 text-green-800",
    questions: [
      {
        id: "reach-farmers",
        question: "How can I reach and connect with organic farmers?",
        answer: "You can connect with farmers through multiple ways: 1) Browse our verified farmer directory in the 'Farmers' section, 2) Use the 'Matchmaking' feature to find farmers based on your specific needs, 3) Search for products and contact farmers directly through their profiles, 4) Join our farmer networking events and webinars announced in the app."
      },
      {
        id: "farmer-verification",
        question: "How do I know if a farmer is legitimate and trustworthy?",
        answer: "All farmers on our platform go through a rigorous verification process: ✓ Identity verification with government documents, ✓ Farm location verification with GPS coordinates, ✓ Organic certification validation, ✓ Quality audits and inspections, ✓ Customer reviews and ratings system, ✓ Background checks and references. Look for the 'Verified' badge on farmer profiles."
      },
      {
        id: "farmer-ratings",
        question: "How does the farmer rating system work?",
        answer: "Our rating system is based on: Product Quality (40%), Delivery Timeliness (25%), Communication (20%), Packaging Quality (10%), and Overall Experience (5%). Ratings are from 1-5 stars and are updated in real-time. Only verified purchases can leave reviews to ensure authenticity."
      },
      {
        id: "new-farmers",
        question: "Can I add new farmers to my network?",
        answer: "Yes! You can: 1) Invite farmers through the 'Add Farmer' feature, 2) Send referral links to farmers you know, 3) Request our team to onboard specific farmers in your area, 4) Use our farmer discovery tool to find new suppliers. All new farmers must complete our verification process before joining your network."
      }
    ]
  },
  {
    id: "trust-safety",
    title: "Trust & Safety",
    icon: Shield,
    color: "bg-blue-100 text-blue-800",
    questions: [
      {
        id: "trust-farmers",
        question: "How can I trust farmers I've never met before?",
        answer: "Building trust is our priority: 1) Start with small orders to test quality and reliability, 2) Check farmer certifications and reviews, 3) Use our escrow payment system for protection, 4) Schedule video calls or farm visits, 5) Read detailed farmer profiles and history, 6) Use our dispute resolution system if issues arise, 7) Join our restaurant community forums to get recommendations."
      },
      {
        id: "quality-assurance",
        question: "What if the product quality doesn't meet my standards?",
        answer: "We have multiple quality safeguards: 1) 48-hour quality guarantee on all deliveries, 2) Photo documentation of products before shipping, 3) Quality dispute resolution process, 4) Full refund or replacement policy, 5) Quality feedback system to improve farmer standards, 6) Third-party quality audits for premium suppliers."
      },
      {
        id: "payment-security",
        question: "Is my payment information secure?",
        answer: "Absolutely! We use: ✓ Bank-grade encryption (256-bit SSL), ✓ PCI DSS compliance for payment processing, ✓ Escrow payment system for large orders, ✓ Multiple payment options (UPI, cards, bank transfer), ✓ Fraud detection and prevention, ✓ Secure payment gateways, ✓ No storage of sensitive payment data on our servers."
      },
      {
        id: "dispute-resolution",
        question: "What happens if there's a dispute with a farmer?",
        answer: "Our dispute resolution process: 1) Report the issue within 48 hours, 2) Our mediation team investigates both sides, 3) Evidence review (photos, delivery receipts, communication logs), 4) Fair resolution within 5-7 business days, 5) Compensation or replacement as appropriate, 6) Farmer coaching if needed, 7) Escalation to senior management for complex cases."
      }
    ]
  },
  {
    id: "app-usage",
    title: "App Features & Usage",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-800",
    questions: [
      {
        id: "place-orders",
        question: "How do I place bulk orders for my restaurant?",
        answer: "Placing bulk orders is simple: 1) Browse products or search by category, 2) Click 'Order Now' on any product, 3) Specify quantity needed (e.g., 50kg weekly), 4) Set delivery date and special requirements, 5) Choose payment method, 6) Confirm order details, 7) Track order status in real-time. For recurring orders, set up auto-ordering schedules."
      },
      {
        id: "inventory-management",
        question: "Can the app help manage my restaurant inventory?",
        answer: "Yes! Our inventory features include: ✓ Stock level tracking for all purchased items, ✓ Low stock alerts and notifications, ✓ Automatic reorder suggestions, ✓ Expiry date tracking, ✓ Usage analytics and trends, ✓ Integration with your existing POS systems, ✓ Waste reduction recommendations, ✓ Seasonal planning tools."
      },
      {
        id: "mobile-app",
        question: "Is there a mobile app for easier access?",
        answer: "Currently, we offer a mobile-optimized web app that works perfectly on all devices. Our native mobile apps for iOS and Android are in development and will be available soon. The web app includes: ✓ Offline order viewing, ✓ Push notifications, ✓ Camera integration for quality photos, ✓ GPS tracking for deliveries, ✓ Voice search capabilities."
      },
      {
        id: "integration",
        question: "Can I integrate this with my restaurant management system?",
        answer: "Yes! We offer integrations with popular restaurant systems: ✓ POS systems (Square, Toast, Clover), ✓ Inventory management (BevSpot, MarketMan), ✓ Accounting software (QuickBooks, Xero), ✓ Delivery platforms (DoorDash, Uber Eats), ✓ Custom API integration available, ✓ Webhook support for real-time data sync."
      }
    ]
  },
  {
    id: "orders-delivery",
    title: "Orders & Delivery",
    icon: Truck,
    color: "bg-orange-100 text-orange-800",
    questions: [
      {
        id: "delivery-schedule",
        question: "How flexible are delivery schedules?",
        answer: "Very flexible! Options include: ✓ Same-day delivery (orders before 10 AM), ✓ Next-day delivery, ✓ Scheduled deliveries up to 2 weeks in advance, ✓ Recurring weekly/bi-weekly deliveries, ✓ Emergency rush deliveries (additional fee), ✓ Specific time slots (morning, afternoon, evening), ✓ Weekend deliveries available in most areas."
      },
      {
        id: "minimum-orders",
        question: "Is there a minimum order quantity?",
        answer: "Minimum orders vary by farmer and location: ✓ Most farmers: ₹500-1000 minimum, ✓ Premium suppliers: ₹2000+ minimum, ✓ Bulk discounts available for larger orders, ✓ Combined orders from multiple farmers to meet minimums, ✓ No minimum for established restaurant partners, ✓ Special arrangements for regular customers."
      },
      {
        id: "track-orders",
        question: "Can I track my orders in real-time?",
        answer: "Absolutely! Track every step: ✓ Order confirmation and farmer acceptance, ✓ Harvesting/preparation status, ✓ Quality check and packaging, ✓ Dispatch notification with driver details, ✓ Live GPS tracking during delivery, ✓ Delivery confirmation with photos, ✓ SMS and email updates at each stage."
      },
      {
        id: "delivery-areas",
        question: "What areas do you deliver to?",
        answer: "We deliver to most major cities and surrounding areas: ✓ Metro cities: Same-day delivery, ✓ Tier-2 cities: Next-day delivery, ✓ Rural areas: 2-3 day delivery, ✓ Coverage expanding monthly, ✓ Check delivery availability by entering your pincode, ✓ Special arrangements for bulk orders outside coverage areas."
      }
    ]
  },
  {
    id: "pricing-payments",
    title: "Pricing & Payments",
    icon: CreditCard,
    color: "bg-yellow-100 text-yellow-800",
    questions: [
      {
        id: "pricing-transparency",
        question: "How transparent is the pricing?",
        answer: "Complete transparency: ✓ No hidden fees or charges, ✓ Farmer price + delivery fee clearly shown, ✓ Bulk discount tiers displayed, ✓ Seasonal price variations explained, ✓ Compare prices across multiple farmers, ✓ Price history and trends available, ✓ Volume-based pricing for regular customers."
      },
      {
        id: "payment-methods",
        question: "What payment methods are accepted?",
        answer: "Multiple secure options: ✓ UPI (Google Pay, PhonePe, Paytm), ✓ Credit/Debit cards (Visa, Mastercard, RuPay), ✓ Net banking from all major banks, ✓ Digital wallets (Paytm, Amazon Pay), ✓ Bank transfers for bulk orders, ✓ Credit terms for verified restaurants, ✓ Cryptocurrency payments (coming soon)."
      },
      {
        id: "credit-terms",
        question: "Do you offer credit terms for established restaurants?",
        answer: "Yes, for qualified restaurants: ✓ 15-30 day payment terms available, ✓ Credit limit based on order history, ✓ Automatic approval for regular customers, ✓ Flexible payment schedules, ✓ Early payment discounts, ✓ Credit monitoring and reporting, ✓ Apply through the 'Credit Application' in settings."
      },
      {
        id: "bulk-discounts",
        question: "Are there discounts for bulk orders?",
        answer: "Multiple discount opportunities: ✓ Volume discounts (5-15% based on quantity), ✓ Loyalty program rewards, ✓ Seasonal promotional offers, ✓ Multi-farmer order discounts, ✓ Subscription-based pricing, ✓ Group buying with other restaurants, ✓ Early bird discounts for advance orders."
      }
    ]
  },
  {
    id: "organic-quality",
    title: "Organic & Quality",
    icon: Leaf,
    color: "bg-green-100 text-green-800",
    questions: [
      {
        id: "organic-certification",
        question: "How do you verify organic certification?",
        answer: "Rigorous verification process: ✓ Government organic certification validation, ✓ Third-party lab testing for pesticide residues, ✓ Regular farm inspections and audits, ✓ Soil and water quality testing, ✓ Supply chain traceability, ✓ Certification renewal tracking, ✓ Surprise quality checks, ✓ Customer feedback integration."
      },
      {
        id: "quality-standards",
        question: "What quality standards do you maintain?",
        answer: "Comprehensive quality framework: ✓ FSSAI compliance for all products, ✓ ISO 22000 food safety standards, ✓ Good Agricultural Practices (GAP) certification, ✓ Cold chain maintenance for perishables, ✓ Packaging and hygiene standards, ✓ Regular quality audits, ✓ Customer satisfaction metrics."
      },
      {
        id: "seasonal-availability",
        question: "How do you handle seasonal availability of organic products?",
        answer: "Smart seasonal management: ✓ Seasonal calendar with availability forecasts, ✓ Alternative product suggestions, ✓ Pre-season ordering for guaranteed supply, ✓ Preservation and storage solutions, ✓ Network of farmers across different regions, ✓ Greenhouse and controlled environment partnerships, ✓ Import options for off-season items."
      }
    ]
  }
];

export default function RestaurantFAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqCategories.filter(category => {
    if (selectedCategory && category.id !== selectedCategory) return false;
    
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return category.questions.some(q => 
      q.question.toLowerCase().includes(searchLower) || 
      q.answer.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant FAQ</h1>
          <p className="text-muted-foreground">
            Everything you need to know about connecting with organic farmers and using our platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Badge>
        {faqCategories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === category.id ? category.color : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon className="mr-1 h-3 w-3" />
            {category.title}
          </Badge>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {filteredFAQs.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
              <CardDescription>
                {category.questions.length} questions in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Still have questions?</h3>
              <p className="text-green-700">
                Our restaurant support team is here to help you succeed with organic sourcing.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Badge className="bg-green-600">📧 restaurant-support@manvaasam.com</Badge>
            <Badge className="bg-green-600">📞 1800-ORGANIC (1800-674-2642)</Badge>
            <Badge className="bg-green-600">💬 Live Chat Available 9 AM - 9 PM</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}