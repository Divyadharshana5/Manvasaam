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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-primary">
              Terms of Service
            </h1>
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
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Rules and guidelines for using the Manvaasam platform.
            </p>
            <p className="text-xs text-gray-500">Updated: December 2024</p>
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
