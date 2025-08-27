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
import { useState, Suspense, useMemo } from "react";

// Loading component for fast initial render
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

function SupportContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = useMemo(() => [
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
  ], []);

  const filteredFAQs = useMemo(() =>
    faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ), [faqItems, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 0.7, 1],
            opacity: [0.3, 0.7, 0.2, 0.3],
            x: [0, 35, -15, 0],
            y: [0, -25, 20, 0],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "30%", "70%", "50%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.6, 1.5, 1],
            opacity: [0.3, 0.8, 0.1, 0.3],
            x: [0, -30, 20, 0],
            y: [0, 25, -15, 0],
            skewX: [0, 20, -20, 0],
            skewY: [0, -10, 10, 0]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1.1, 1],
            opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
            rotate: [0, -120, 240, -360],
            x: [0, 20, -25, 10, 0],
            y: [0, -10, 15, -5, 0]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 6
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/5 w-28 h-28 bg-teal-200/25 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.6, 0.5, 0.8],
            opacity: [0.2, 0.6, 0.3, 0.2],
            x: [0, 45, -30, 0],
            y: [0, -20, 30, 0],
            rotate: [0, 270, 540, 720]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-30 h-30 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.9, 1.4, 1],
            opacity: [0.2, 0.5, 0.1, 0.2],
            rotate: [0, -60, 120, -180, 240, -300, 360],
            x: [0, -40, 25, 0],
            borderRadius: ["50%", "40%", "60%", "50%"]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Enhanced Animated Header */}
      <motion.header
        className="relative bg-white/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg"
              whileHover={{
                scale: 1.15,
                rotate: [0, -20, 20, 0],
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  x: [-2, 2, -2, 2, 0],
                  y: [-1, 1, -1, 1, 0],
                  rotate: [-8, 8, -8, 8, 0]
                }}
              >
                <HelpCircle className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 8px rgba(34, 197, 94, 0.3)"
                }}
              >
                Support Center
              </motion.h1>
              <motion.p
                className="text-xs text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                We're here to help you succeed
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Enhanced Hero Section */}
          <motion.div
            className="relative text-center space-y-6 py-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg"
              initial={{ scale: 0, rotate: 360, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.4,
                type: "spring",
                stiffness: 120,
                damping: 10
              }}
              whileHover={{
                scale: 1.25,
                rotate: [0, -20, 20, 0],
                boxShadow: "0 35px 70px rgba(34, 197, 94, 0.4)",
                y: -10
              }}
              whileTap={{ scale: 0.85 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.5, 0.7, 1],
                  opacity: [0.2, 0.7, 0.1, 0.2],
                  rotate: [0, 270, 540, 720]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 0.8, 1]
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                whileHover={{
                  rotate: [0, -720],
                  x: [-4, 4, -4, 4, 0],
                  y: [-2, 2, -2, 2, 0],
                  scale: [1, 1.2, 1],
                  transition: { duration: 1.5 }
                }}
              >
                <HelpCircle className="relative h-10 w-10 text-green-600" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-purple-300/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, -180, -360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border border-cyan-300/30"
                animate={{
                  scale: [1, 0.8, 1.3, 1],
                  opacity: [0.3, 0.6, 0.2, 0.3],
                  rotate: [0, 120, 240, 360]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
            </motion.div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                How we collect, use, and protect your information on Manvaasam
                platform
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-700 font-medium">
                  Updated: December 2024
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Points */}
          <Card className="relative border-0 bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-green-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <motion.div
                      whileHover={{
                        x: [-2, 2, -2, 2, 0],
                        y: [-1, 1, -1, 1, 0],
                        rotate: [-4, 4, -4, 4, 0]
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      <MessageCircle className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Live Chat
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get instant responses from our support team
                  </p>
                </motion.div>
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <motion.div
                      whileHover={{
                        x: [-2, 2, -2, 2, 0],
                        y: [-1, 1, -1, 1, 0],
                        rotate: [-3, 3, -3, 3, 0]
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      <Phone className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Phone Support
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Speak directly with our experts
                  </p>
                </motion.div>
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <motion.div
                      whileHover={{
                        x: [-2, 2, -2, 2, 0],
                        y: [-1, 1, -1, 1, 0],
                        rotate: [-5, 5, -5, 5, 0]
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Email Support
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Send detailed messages for complex issues
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

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
                  className="pl-9 text-sm h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 hover:border-primary/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      borderColor: "rgba(34, 197, 94, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-2">
                      <motion.div
                        whileHover={{ rotate: 90, scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.h4
                          className="font-medium text-sm text-gray-900 mb-1"
                          whileHover={{ color: "#059669" }}
                        >
                          {faq.question}
                        </motion.h4>
                        <motion.p
                          className="text-xs text-gray-600 leading-relaxed"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
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
            <Link href="/" prefetch={true}>
              <Button className="gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl transform-gpu hover:scale-105 active:scale-95">
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

export default function SupportPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SupportContent />
    </Suspense>
  );
}
