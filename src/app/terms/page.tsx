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
          <motion.div variants={fadeInUp}>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> By using Manvaasam, you agree to
                these terms. If you don't agree, please don't use our platform.
              </AlertDescription>
            </Alert>
          </motion.div>

          {/* Key Points */}
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Fair Use</h3>
                    <p className="text-sm text-gray-600">
                      Use platform responsibly and legally
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Account Security</h3>
                    <p className="text-sm text-gray-600">
                      Keep your login credentials safe
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <Scale className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Legal Compliance</h3>
                    <p className="text-sm text-gray-600">
                      Follow all applicable laws
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Usage */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>1. Platform Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Permitted Uses
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Buying and selling agricultural products</li>
                    <li>Connecting with farmers, hubs, and restaurants</li>
                    <li>Managing your agricultural business</li>
                    <li>Accessing platform features and services</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Prohibited Activities
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Posting false or misleading information</li>
                    <li>Engaging in fraudulent transactions</li>
                    <li>Violating intellectual property rights</li>
                    <li>Harassing or threatening other users</li>
                    <li>Using the platform for illegal activities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Responsibilities */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>2. Account Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Account Security
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>
                        Maintain the confidentiality of your login credentials
                      </li>
                      <li>Notify us immediately of any unauthorized access</li>
                      <li>
                        Use strong passwords and enable two-factor
                        authentication
                      </li>
                      <li>
                        You are responsible for all activities under your
                        account
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Accurate Information
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Provide truthful and accurate information</li>
                      <li>Keep your profile and business details updated</li>
                      <li>Verify your identity when requested</li>
                      <li>Report any changes to your business status</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions & Payments */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>3. Transactions & Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Transaction Terms
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>
                      All transactions are between buyers and sellers directly
                    </li>
                    <li>
                      Manvaasam facilitates connections but is not party to
                      transactions
                    </li>
                    <li>
                      Prices, quality, and delivery terms are set by sellers
                    </li>
                    <li>Disputes should be resolved between parties first</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Payment Processing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>
                      Payments are processed through secure third-party
                      providers
                    </li>
                    <li>Platform fees may apply to certain transactions</li>
                    <li>
                      Refund policies are determined by individual sellers
                    </li>
                    <li>We may hold payments in case of disputes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>4. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Platform Content
                    </h4>
                    <p className="text-gray-600 mb-2">
                      The Manvaasam platform, including its design, features,
                      and content, is protected by intellectual property laws.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>
                        You may not copy, modify, or distribute our platform
                      </li>
                      <li>Our trademarks and logos are protected</li>
                      <li>You receive a limited license to use the platform</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      User Content
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>You retain ownership of content you post</li>
                      <li>
                        You grant us license to use your content on the platform
                      </li>
                      <li>Don't post content that infringes others' rights</li>
                      <li>We may remove content that violates these terms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>5. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Manvaasam provides the platform "as is" and makes no
                    warranties about:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>The quality, safety, or legality of products listed</li>
                    <li>The accuracy of user-provided information</li>
                    <li>The reliability of other users</li>
                    <li>Uninterrupted or error-free platform operation</li>
                  </ul>
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Important:</strong> Our liability is limited to
                      the maximum extent permitted by law. We are not
                      responsible for indirect, incidental, or consequential
                      damages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Termination */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>6. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Your Rights
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>You may terminate your account at any time</li>
                      <li>Download your data before closing your account</li>
                      <li>Some obligations may survive account termination</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Our Rights
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>
                        We may suspend or terminate accounts for violations
                      </li>
                      <li>We may discontinue the platform with notice</li>
                      <li>We may modify these terms with advance notice</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Questions About These Terms?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> legal@manvaasam.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 9876543210
                  </p>
                  <p>
                    <strong>Address:</strong> Agricultural Hub, India
                  </p>
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
