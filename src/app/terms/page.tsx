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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground">
                Your data protection matters
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero */}
          <div className="relative text-center space-y-6 py-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <Scale className="relative h-10 w-10 text-green-600" />
            </div>
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
          </div>

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
                    <Users className="h-6 w-6 text-white" />
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
                    <Shield className="h-6 w-6 text-white" />
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
                    <Scale className="h-6 w-6 text-white" />
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
            <Link href="/">
              <Button className="gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
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
