"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "Click any role button on homepage and follow registration.",
    },
    {
      question: "How to list products?",
      answer: "Login as farmer, go to dashboard, click 'Add Product'.",
    },
    {
      question: "What payment methods?",
      answer: "UPI, bank transfers, digital wallets, cash on delivery.",
    },
    {
      question: "How to contact users?",
      answer: "Use built-in messaging or voice assistant feature.",
    },
    {
      question: "Any fees?",
      answer: "Free registration. Small commission on transactions.",
    },
  ];

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-primary">
              Support Center
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              How can we help?
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Get support for your Manvaasam experience.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm mb-1">Live Chat</h3>
                <p className="text-xs text-gray-600 mb-3">Get instant help</p>
                <Button size="sm" className="w-full text-xs">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm mb-1">Phone Support</h3>
                <p className="text-xs text-gray-600 mb-3">Speak with experts</p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <a href="tel:+919876543210">Call Now</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm mb-1">Email Support</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Send detailed message
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <a href="mailto:slytherinpls8@gmail.com">Email Us</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Support Hours */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Support Hours</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-medium mb-1">Live Chat & Phone</h4>
                  <p className="text-gray-600">Mon-Fri: 9AM-8PM IST</p>
                  <p className="text-gray-600">Sat-Sun: 10AM-6PM IST</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email Support</h4>
                  <p className="text-gray-600">24/7 - Response within 24hrs</p>
                  <p className="text-gray-600">
                    Multilingual support available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                  size="sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFAQs.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No FAQs found. Try different keywords or contact support.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <h3 className="font-medium text-sm text-red-800 mb-2">
                Emergency Support
              </h3>
              <p className="text-xs text-red-700 mb-3">
                For urgent issues affecting your business operations:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <Phone className="h-3 w-3" />
                  Emergency: +91 9876543210
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Mail className="h-3 w-3" />
                  slytherinpls8@gmail.com
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center pt-4">
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Manvaasam
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
