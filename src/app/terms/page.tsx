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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-12 w-36 h-36 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-16 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 left-1/4 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 bg-blue-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground">
                Platform usage guidelines
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
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
              <Scale className="relative h-10 w-10 text-blue-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Rules and guidelines for using the Manvaasam platform
                responsibly
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-700 font-medium">
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
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Users className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Fair Use</h3>
                  <p className="text-xs text-gray-600">
                    Use responsibly and legally
                  </p>
                </div>
                <div className="space-y-2">
                  <Shield className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Account Security</h3>
                  <p className="text-xs text-gray-600">Keep credentials safe</p>
                </div>
                <div className="space-y-2">
                  <Scale className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Legal Compliance</h3>
                  <p className="text-xs text-gray-600">Follow all laws</p>
                </div>
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
              <Button className="gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
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
