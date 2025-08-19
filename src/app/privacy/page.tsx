"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Users, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-primary">
              Privacy Policy
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
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              How we collect, use, and protect your information on Manvaasam.
            </p>
            <p className="text-xs text-gray-500">Updated: December 2024</p>
          </div>

          {/* Key Points */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Lock className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Secure</h3>
                  <p className="text-xs text-gray-600">
                    Industry-standard encryption
                  </p>
                </div>
                <div className="space-y-2">
                  <Users className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Private</h3>
                  <p className="text-xs text-gray-600">
                    We never sell your data
                  </p>
                </div>
                <div className="space-y-2">
                  <Database className="h-6 w-6 text-primary mx-auto" />
                  <h3 className="font-medium text-sm">Your Control</h3>
                  <p className="text-xs text-gray-600">Delete data anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Personal Info</h4>
                  <p className="text-gray-600 text-xs">
                    Name, email, phone, farm/business details
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Usage Data</h4>
                  <p className="text-gray-600 text-xs">
                    How you use our platform, device info
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How We Use It</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Platform Services</h4>
                  <p className="text-gray-600 text-xs">
                    Connect farmers, buyers, facilitate transactions
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Communication</h4>
                  <p className="text-gray-600 text-xs">
                    Updates, notifications, support
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Rights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3 text-center text-sm">
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Access</h4>
                  <p className="text-xs text-gray-600">View your data</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Correct</h4>
                  <p className="text-xs text-gray-600">Update info</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Export</h4>
                  <p className="text-xs text-gray-600">Download data</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Delete</h4>
                  <p className="text-xs text-gray-600">Remove account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Questions?</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Contact us about privacy
              </p>
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
