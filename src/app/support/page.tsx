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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Your data protection matters
              </p>
            </div>
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
          <div className="relative text-center space-y-6 py-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <HelpCircle className="relative h-10 w-10 text-purple-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How can we help you?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get instant support for your Manvaasam experience with our
                comprehensive help center
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-purple-700 font-medium">
                  24/7 Support Available
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative border-0 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-800">
                    Live Chat
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant responses from our support team
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-800">
                    Phone Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Speak directly with our experts
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <a href="tel:+919876543210">Call Now</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="relative border-0 bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-800">
                    Email Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Send detailed messages for complex issues
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <a href="mailto:slytherinpls8@gmail.com">Email Us</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
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

          {/* Return Button */}
          <div className="text-center pt-6">
            <Link href="/">
              <Button className="gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
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
