"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Privacy Policy</h1>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Manvaasam collects, 
              uses, and protects your personal information.
            </p>
            <p className="text-sm text-gray-500">Last updated: December 2024</p>
          </motion.div>

          {/* Quick Overview */}
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Data Protection</h3>
                    <p className="text-sm text-gray-600">We use industry-standard encryption</p>
                  </div>
                  <div className="text-center p-4">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">No Sharing</h3>
                    <p className="text-sm text-gray-600">We never sell your personal data</p>
                  </div>
                  <div className="text-center p-4">
                    <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Your Control</h3>
                    <p className="text-sm text-gray-600">You can delete your data anytime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information We Collect */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Name, email address, and phone number</li>
                    <li>Farm location and agricultural details</li>
                    <li>Business information for hubs and restaurants</li>
                    <li>Profile pictures and documents (optional)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>How you interact with our platform</li>
                    <li>Device information and IP address</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and time spent on the platform</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How We Use Information */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Platform Services:</strong> To provide agricultural marketplace services, connect farmers with buyers, and facilitate transactions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Communication:</strong> To send important updates, notifications, and respond to your inquiries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Improvement:</strong> To analyze usage patterns and improve our platform's functionality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Security:</strong> To protect against fraud, abuse, and unauthorized access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Protection */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>3. Data Protection & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We implement robust security measures to protect your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Technical Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Encrypted data storage</li>
                      <li>Regular security audits</li>
                      <li>Secure authentication systems</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Operational Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Limited access to personal data</li>
                      <li>Employee training on data protection</li>
                      <li>Regular backup and recovery procedures</li>
                      <li>Incident response protocols</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Rights */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>4. Your Rights & Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">You have the following rights regarding your personal data:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Eye className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Access</h4>
                          <p className="text-sm text-gray-600">View your personal data</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Portability</h4>
                          <p className="text-sm text-gray-600">Export your data</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Lock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Correction</h4>
                          <p className="text-sm text-gray-600">Update incorrect information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Deletion</h4>
                          <p className="text-sm text-gray-600">Remove your account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeInUp}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or your personal data, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@manvaasam.com</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Address:</strong> Agricultural Hub, India</p>
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
