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
  Users, 
  BookOpen,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const faqItems = [
    {
      question: "How do I create an account on Manvaasam?",
      answer: "Click on any role button (Farmer, Hub, or Restaurant) on the homepage and follow the registration process. You'll need to provide basic information about yourself and your business."
    },
    {
      question: "How can farmers list their products?",
      answer: "After logging in as a farmer, go to your dashboard and click 'Add Product'. Fill in the product details, upload photos, set your price, and publish your listing."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We support various payment methods including UPI, bank transfers, digital wallets, and cash on delivery (where applicable). Payment options may vary by region."
    },
    {
      question: "How do I contact buyers or sellers?",
      answer: "Use our built-in messaging system to communicate with other users. You can also use the voice assistant feature to get help with navigation and platform features."
    },
    {
      question: "Is there a fee for using Manvaasam?",
      answer: "Basic registration and browsing are free. We charge a small commission on successful transactions to maintain and improve the platform."
    },
    {
      question: "How do I report a problem or dispute?",
      answer: "Contact our support team immediately through the contact methods below. We have a dedicated dispute resolution process to help resolve issues fairly."
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Support Center</h1>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">How can we help you?</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get support for your Manvaasam experience. Find answers, contact our team, 
              or explore our resources.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-4">Speak directly with our experts</p>
                  <Button variant="outline" className="w-full">
                    <a href="tel:+919876543210">Call +91 9876543210</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                <CardContent className="p-6 text-center">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">Send us a detailed message</p>
                  <Button variant="outline" className="w-full">
                    <a href="mailto:support@manvaasam.com">Email Us</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Support Hours */}
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Live Chat & Phone</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>Monday - Friday: 9:00 AM - 8:00 PM IST</li>
                      <li>Saturday: 10:00 AM - 6:00 PM IST</li>
                      <li>Sunday: 10:00 AM - 4:00 PM IST</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email Support</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>24/7 - We respond within 24 hours</li>
                      <li>Priority support for urgent issues</li>
                      <li>Multilingual support available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No FAQs found matching your search. Try different keywords or contact support directly.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Guides */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                    <h4 className="font-semibold mb-2">Farmer Guide</h4>
                    <p className="text-sm text-gray-600 mb-3">Learn how to list products, manage orders, and grow your business</p>
                    <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                    <h4 className="font-semibold mb-2">Hub Guide</h4>
                    <p className="text-sm text-gray-600 mb-3">Discover how to connect farmers with buyers and manage logistics</p>
                    <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                    <h4 className="font-semibold mb-2">Restaurant Guide</h4>
                    <p className="text-sm text-gray-600 mb-3">Find fresh ingredients and build supplier relationships</p>
                    <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div variants={fadeInUp}>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-4">
                  For urgent issues affecting your business operations or security concerns:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="destructive" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Emergency Hotline: +91 9876543210
                  </Button>
                  <Button variant="outline" className="gap-2 border-red-300 text-red-700 hover:bg-red-100">
                    <Mail className="h-4 w-4" />
                    urgent@manvaasam.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Home */}
          <motion.div variants={fadeInUp} className="text-center pt-8">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Manvaasam
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
