"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Scale,
  Users,
  Shield,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";

// Loading component for fast initial render
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.6, 0.2, 0.3],
            x: [0, 30, -10, 0],
            y: [0, -20, 15, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.7, 1.4, 1],
            opacity: [0.3, 0.7, 0.1, 0.3],
            x: [0, -25, 15, 0],
            y: [0, 20, -10, 0],
            skewY: [0, 15, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.3, 0.5, 0.4, 0.6, 0.3],
            rotate: [0, -90, 180, -270, 360],
            borderRadius: ["50%", "25%", "40%", "60%", "50%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 4,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-28 h-28 bg-amber-200/25 rounded-full blur-2xl"
          animate={{
            scale: [0.9, 1.5, 0.6, 0.9],
            opacity: [0.2, 0.5, 0.3, 0.2],
            x: [0, 40, -20, 0],
            y: [0, -15, 25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-rose-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.2, 0.4, 0.1, 0.2],
            rotate: [0, -45, 45, 0],
            x: [0, -35, 20, 0],
            skewX: [0, 20, -20, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3.5,
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
                scale: 1.1,
                rotate: [0, -10, 10, 0],
                boxShadow: "0 15px 30px rgba(34, 197, 94, 0.4)",
                transition: { type: "tween", duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  x: [-2, 2, -2, 2, 0],
                  y: [-1, 1, -1, 1, 0],
                  rotate: [-6, 6, -6, 6, 0],
                  transition: {
                    type: "tween",
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                }}
              >
                <FileText className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.h1>
              <motion.p
                className="text-xs text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Legal guidelines and policies
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
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
              initial={{ scale: 0, rotate: -270, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.4,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
              whileHover={{
                scale: 1.2,
                rotate: [0, 15, -15, 0],
                boxShadow: "0 30px 60px rgba(34, 197, 94, 0.3)",
                y: -8,
                transition: { type: "tween", duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.4, 0.8, 1],
                  opacity: [0.2, 0.6, 0.1, 0.2],
                  rotate: [0, -180, 180, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                whileHover={{
                  rotate: [0, 180, 360],
                  x: [-3, 3, -3, 3, 0],
                  y: [-2, 2, -2, 2, 0],
                  scale: [1, 1.1, 1],
                  transition: { type: "tween", duration: 0.8 },
                }}
              >
                <Scale className="relative h-10 w-10 text-green-600" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-blue-300/40"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                }}
              />
            </motion.div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Terms of Service
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

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Important:</strong> By using Manvaasam, you agree to these
              terms.
            </AlertDescription>
          </Alert>

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
                        rotate: [-4, 4, -4, 4, 0],
                        transition: {
                          type: "tween",
                          duration: 0.4,
                          ease: "easeInOut",
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      <Users className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Fair Use
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Use responsibly and legally on our platform
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
                        rotate: [-3, 3, -3, 3, 0],
                        transition: {
                          type: "tween",
                          duration: 0.4,
                          ease: "easeInOut",
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      <Shield className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Account Security
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Keep your credentials safe and secure
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
                        rotate: [-5, 5, -5, 5, 0],
                        transition: {
                          type: "tween",
                          duration: 0.4,
                          ease: "easeInOut",
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      <Scale className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Legal Compliance
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Follow all applicable laws and regulations
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Main Terms */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Platform Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1 text-green-700">✓ Allowed</h4>
                  <p className="text-gray-600 text-xs">
                    Buy/sell agricultural products, connect with users, manage
                    business
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-red-700">
                    ✗ Prohibited
                  </h4>
                  <p className="text-gray-600 text-xs">
                    False information, fraud, harassment, illegal activities
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Your Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Account Security</h4>
                  <p className="text-gray-600 text-xs">
                    Protect login credentials, report unauthorized access
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Accurate Information</h4>
                  <p className="text-gray-600 text-xs">
                    Provide truthful details, keep profile updated
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions & Liability */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Transactions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2 text-gray-600 text-xs">
                  <li>• Direct transactions between buyers and sellers</li>
                  <li>• Manvaasam facilitates connections only</li>
                  <li>• Prices and terms set by sellers</li>
                  <li>• Platform fees may apply</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2 text-gray-600 text-xs">
                  <li>• Platform provided "as is"</li>
                  <li>• No warranties on product quality</li>
                  <li>• Limited liability for damages</li>
                  <li>• Users responsible for transactions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Questions about Terms?</h3>
              </div>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Email:</strong> slytherinpls8@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 9876543210
                </p>
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

export default function TermsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TermsContent />
    </Suspense>
  );
}
